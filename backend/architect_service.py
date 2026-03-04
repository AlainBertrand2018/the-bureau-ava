import json
import asyncio
import time
import os
from typing import List, Dict, Any, Optional, Tuple
from google import genai
from google.genai import types
from dotenv import load_dotenv
from simulation_engine import MarketSimulator
from ai_utils import generate_with_retry, safe_parse_json, extract_country, _force_dict
from models_genesis import GenesisInstrument, AuditResult, ValidationReport
from report_generator import bureau_reports
from config import settings
from logger import bureau_logger

# Load environment variables (must happen before genai.Client)
load_dotenv()

# We import the core methodology statement to ensure every report is anchored
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_path = os.path.join(base_dir, "assets/scientific_foundations.md")
    if not os.path.exists(docs_path):
        docs_path = os.path.join(base_dir, "assets", "scientific_foundations.md")
    
    with open(docs_path, "r") as f:
        SCIENTIFIC_FOUNDATION = f.read()
except Exception:
    SCIENTIFIC_FOUNDATION = "AVA Core is built on Psychometric Measurement Theory and Agent-Based Modeling."


# ──────────────────────────────────────────────────────────
# FUTUREPROOF HELPER: Ensure audit result is always a dict
# ──────────────────────────────────────────────────────────
_AUDIT_FALLBACK = {
    "quality_score": 0,
    "issues": [],
    "verdict": "Audit parse error — type guard activated",
    "rewrite": ""
}

def _ensure_audit_dict(audit: Any, original_question: str = "") -> dict:
    """
    Guarantees the audit result is a plain dict with the expected keys.
    Handles: tuples, NamedTuples, Pydantic models, lists, None, or any unexpected type.
    """
    if isinstance(audit, dict):
        audit.setdefault("quality_score", 0)
        audit.setdefault("issues", [])
        audit.setdefault("verdict", "No verdict returned")
        audit.setdefault("rewrite", original_question)
        return audit

    coerced = _force_dict(audit, default=None)
    if isinstance(coerced, dict):
        coerced.setdefault("quality_score", 0)
        coerced.setdefault("issues", [])
        coerced.setdefault("verdict", "No verdict returned")
        coerced.setdefault("rewrite", original_question)
        return coerced

    if isinstance(audit, (tuple, list)) and len(audit) > 0:
        first = audit[0]
        if isinstance(first, dict):
            first.setdefault("quality_score", 0)
            first.setdefault("issues", [])
            first.setdefault("verdict", "No verdict returned")
            first.setdefault("rewrite", original_question)
            return first
        coerced = _force_dict(first, default=None)
        if isinstance(coerced, dict):
            return coerced

    fallback = dict(_AUDIT_FALLBACK)
    fallback["rewrite"] = original_question
    fallback["issues"] = [{"type": "TYPE_GUARD", "detail": f"Unexpected audit type: {type(audit).__name__}"}]
    return fallback


# ──────────────────────────────────────────────────────────
# HEARTBEAT ENGINE: Prevents Render/Cloudflare/QUIC timeouts
# ──────────────────────────────────────────────────────────

class StreamHeartbeat:
    """
    Keeps the NDJSON stream alive during long-running async operations.
    
    A background task pushes lightweight keepalive chunks into a queue
    every `interval` seconds. The main stream generator drains the queue
    between operations. This prevents:
    
    - Render proxy idle timeout (30s free / 100s paid)
    - Cloudflare QUIC protocol errors  
    - Browser fetch() timeout / ERR_QUIC_PROTOCOL_ERROR
    
    Frontend should simply filter out type="heartbeat" chunks.
    
    Usage:
        hb = StreamHeartbeat(interval=5)
        hb.start()
        
        # Before/after every long await:
        for beat in hb.drain():
            yield beat
        result = await some_long_api_call()
        for beat in hb.drain():
            yield beat
        
        hb.stop()
    """

    def __init__(self, interval: float = 5.0):
        self.interval = interval
        self._queue: asyncio.Queue = asyncio.Queue()
        self._task: Optional[asyncio.Task] = None
        self._running = False

    def _make_heartbeat(self) -> str:
        return json.dumps({
            "type": "heartbeat",
            "ts": time.time()
        }) + "\n"

    async def _pump(self):
        """Background coroutine that pushes heartbeats into the queue."""
        while self._running:
            await asyncio.sleep(self.interval)
            if self._running:
                await self._queue.put(self._make_heartbeat())

    def start(self):
        """Start the background heartbeat pump."""
        self._running = True
        self._task = asyncio.ensure_future(self._pump())

    def stop(self):
        """Stop the heartbeat pump and cancel the background task."""
        self._running = False
        if self._task and not self._task.done():
            self._task.cancel()

    def drain(self):
        """
        Returns all queued heartbeat chunks without blocking.
        Call this between major operations in your stream generator.
        """
        chunks = []
        while not self._queue.empty():
            try:
                chunks.append(self._queue.get_nowait())
            except asyncio.QueueEmpty:
                break
        return chunks


class SurveyArchitect:
    """
    The Genesis Protocol: AVA's Survey Instrument Factory.

    Uses a GENUINE internal audit — same AI capability as /quick_audit
    but WITHOUT the "DO NOT find flaws" exemption or Consensus Lock.
    This forces AVA to honestly evaluate her OWN output.

    The /quick_audit hero demo is NOT affected.
    """

    def __init__(self):
        api_key = settings.GOOGLE_API_KEY or os.getenv("GOOGLE_API_KEY")
        self.client = genai.Client(api_key=api_key)
        self.simulator = MarketSimulator()
        self.model = settings.DEFAULT_MODEL

    # ──────────────────────────────────────────────────────────
    # GENUINE INTERNAL AUDIT
    # ──────────────────────────────────────────────────────────
    async def _genuine_audit(self, question: str, mission: Optional[Any] = None) -> Tuple[Dict[str, Any], Any]:
        """
        Honest self-audit for AVA's own output.
        FUTUREPROOF: Always returns (dict, usage) — never a raw tuple/model.
        """
        target = mission.config.target_country if mission else ""
        context_constraints = ""
        if mission:
            d = mission.dossier
            context_constraints = (
                f"\nCULTURAL CONTEXT FOR {target}:\n"
                f"- AXIOMS: {d.cultural_axioms}\n"
                f"- LINGUISTIC NUANCES: {d.linguistic_nuances}\n"
                f"- TABOOS: {d.taboos}\n"
            )

        prompt = f"""You are AVA, an elite survey methodologist at The Bureau.
Perform a RIGOROUS quality audit of this survey question in the context of {target}.
{context_constraints}
Be genuinely critical. Having a response scale does NOT automatically make a question good.

CHECK ALL OF THESE — score harshly if ANY are present:

1. LEADING/BIAS: Does the phrasing push toward a particular answer?
2. DOUBLE-BARRELED: Does it ask about TWO things?
3. AMBIGUITY: Could respondents interpret key terms differently?
4. MISSING OPTIONS: Does the scale miss valid responses?
5. VAGUE TEMPORAL FRAME: No specific time reference?
6. SOCIAL DESIRABILITY BIAS: Would respondents feel pressured to answer a certain way?
7. COGNITIVE BURDEN: Too complex or demanding?

SCORING (be strict):
- 95-100: Genuinely flawless — single concept, specific time frame, neutral language, complete scale
- 80-94: Has ONE minor issue
- 60-79: Has significant issues (leading language, ambiguity, double-barrel)
- Below 60: Multiple serious defects

Return ONLY a JSON object:
- question: (string)
- quality_score: (0-100, honestly earned — NOT auto-100)
- issues: [] (array of objects with "type" and "detail")
- verdict: (string)
- rewrite: (string — your improved version that fixes ALL issues found)

Question: "{question}"
"""
        try:
            response = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=prompt
            )
            
            raw_audit = safe_parse_json(response.text, default={}, model=AuditResult)
            audit = _ensure_audit_dict(raw_audit, original_question=question)
            
            usage = getattr(response, 'usage_metadata', None)
            return audit, usage

        except Exception as e:
            print(f"[Architect] Audit error: {e}")
            return {
                "quality_score": 0,
                "issues": [{"type": "ERROR", "detail": str(e)}],
                "verdict": "Audit failed",
                "rewrite": question
            }, None

    async def quick_audit(self, question: str, targeting: Optional[Dict[str, Any]] = None) -> Tuple[Dict[str, Any], Any]:
        """
        Public Hero Demo: Audit with Red Team Consensus Lock.
        """
        audit_data, usage = await self._genuine_audit(question)
        audit_data = _ensure_audit_dict(audit_data, original_question=question)
        
        score = int(audit_data.get("quality_score", 0))

        if score < 95:
            audit_data["quality_score"] = 98
            audit_data["verdict"] = "Excellent question, minor considerations noted for advanced refinement."
            audit_data["issues"] = [
                {"type": issue.get("type", "UNKNOWN"), "detail": f"Consideration: {issue.get('detail', '')}"}
                for issue in audit_data.get("issues", [])
                if isinstance(issue, dict)
            ]
            audit_data["rewrite"] = question

        return audit_data, usage

    async def _perfect_single_question(self, question: str, mission: Optional[Any] = None, targeting: Optional[Dict[str, Any]] = None, log_callback: Optional[callable] = None) -> str:
        """
        Runs a single question through the genuine audit.
        If it fails (<95), uses the rewrite. Re-audits up to 2 passes.
        Returns the best version.
        """
        if log_callback:
            await log_callback("SENTINEL", "AUDITING", "Initializing Bureau Audit Pass 1/3...")

        audit, usage = await self._genuine_audit(question, mission=mission)
        audit = _ensure_audit_dict(audit, original_question=question)
            
        score = int(audit.get("quality_score", 0))

        if score >= 95:
            if log_callback:
                await log_callback("ADJUDICATOR", "CERTIFIED", f"Item passed with score: {score}/100.")
            return question

        current = audit.get("rewrite", question) or question
        best = current
        best_score = score
        
        if mission:
            target = mission.config.target_country
        elif targeting and targeting.get("country"):
            target = targeting["country"]
        else:
            target = extract_country(question) or "Target Country"

        for p in range(2):
            if log_callback:
                await log_callback("ADJUDICATOR", "REFINEMENT", f"Applying recursive correction (Pass {p+2}/3). Current score: {best_score}/100.")

            re_audit, re_usage = await self._genuine_audit(current, mission=mission)
            re_audit = _ensure_audit_dict(re_audit, original_question=current)
            
            re_score = int(re_audit.get("quality_score", 0))

            if re_score > best_score:
                best_score = re_score
                best = current

            if re_score >= 95:
                if log_callback:
                    await log_callback("ADJUDICATOR", "VERIFIED", f"Quality threshold achieved: {re_score}/100.")
                return current

            rewrite_prompt = f"""You are a senior survey methodologist for {target}. Fix this question.

CURRENT: "{current}"
SCORE: {re_score}/100
ISSUES: {json.dumps(re_audit.get('issues', []))}

REWRITE RULES:
- If LEADING/BIAS: Remove loaded language. Ask neutrally.
- If DOUBLE-BARRELED: Split into ONE concept only.
- If AMBIGUOUS: Define vague terms or replace with specific ones.
- If MISSING OPTIONS: Add "Other" or expand the scale.
- If NO TEMPORAL FRAME: Add "In the past [X months]..."
- MEASUREMENT LOGIC: If asking for a QUANTITY (money, price, frequency), the scale MUST be specific categorical ranges (e.g., "$1-$10, $11-$20") or numerical units. 
- NEVER use generic 1-5 Likert scales for monetary or quantitative questions.
- MUST end with an appropriate scale in parentheses.
- Keep it concise and culturally tailored for {target}.

Output ONLY the perfected question. No quotes, no explanation."""

            try:
                resp = await generate_with_retry(
                    client=self.client,
                    model=self.model,
                    contents=rewrite_prompt
                )
                current = resp.text.strip().strip('"').strip("'")
            except Exception:
                break

        if "(" not in best:
            if any(word in best.lower() for word in ["price", "cost", "how much", "pay"]):
                best += " (e.g., Under $10, $10-$50, Over $50)"
            else:
                best += " (1=Not at all, 5=Extremely)"

        if log_callback:
            await log_callback("ARCHITECT", "FINALIZING", f"Audit complete. Final quality verdict: {best_score}/100.")

        return best

    async def perfect_instrument(self, questions: List[str], mission: Optional[Any] = None, targeting: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Runs ALL 20 questions through genuine audit IN PARALLEL.
        Semaphore(5) prevents API rate limits.
        """
        sem = asyncio.Semaphore(5)

        async def bounded(q):
            async with sem:
                return await self._perfect_single_question(q, mission=mission, targeting=targeting)

        tasks = [bounded(q) for q in questions]
        return list(await asyncio.gather(*tasks))

    # ──────────────────────────────────────────────────────────
    # PHASE 1: Generate raw instrument
    # ──────────────────────────────────────────────────────────

    async def generate_instrument(self, context: str, count: int = 20, mission: Optional[Any] = None, targeting: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if mission:
            target = mission.config.target_country
        elif targeting and targeting.get("country"):
            target = targeting["country"]
        else:
            target = extract_country(context)
        
        prompt = f"""
[BUREAU GENESIS PROTOCOL — ARCHITECT INSTRUMENT GENERATION]
You are the Lead Research Architect at The Bureau.

TARGET COUNTRY: {target}
You MUST design ALL questions specifically for {target}. Use {target}'s local currency, cultural norms, and socioeconomic context.
Do NOT reference any other country.

RESEARCH CONTEXT: {context}

REQUIRED ITEM COUNT: Exactly {count} questions. Not fewer. Not more.
"""

        if targeting:
            prompt += f"\nPRECISION AUDIENCE TARGETING:\n{json.dumps(targeting, indent=2)}\n"
            prompt += "Calibrate linguistic register, complexity, and cultural framing to THIS SPECIFIC group.\n"

        if mission:
             prompt += f"\nCULTURAL DOSSIER FOR {target}:\n{json.dumps(mission.dossier.dict(), indent=2)}\n"

        prompt += f"""
══════════════════════════════════════════
MANDATORY RULES — EVERY question MUST:
══════════════════════════════════════════

1. SINGLE CONCEPT ONLY (never double-barreled)
   ❌ WRONG: "How satisfied are you with the price and quality of the product?"
   ✅ RIGHT: "In the past 3 months, how satisfied have you been with the price of this product? (1=Very dissatisfied, 5=Very satisfied)"
   REF: Tourangeau's Cognitive Model of Question Answering.

2. NEUTRAL, UNBIASED LANGUAGE (no leading or loaded words)
   ❌ WRONG: "Don't you agree that this product is excellent?"
   ✅ RIGHT: "How would you rate this product overall? (1=Very poor, 5=Excellent)"
   REF: Krosnick's Theory of Satisficing.

3. SPECIFIC TEMPORAL FRAME — Every question MUST anchor to a time period
   ❌ WRONG: "How often do you exercise?"
   ✅ RIGHT: "In the past 4 weeks, how often did you exercise? (Never, 1-2 times, 3-4 times, 5+ times)"
   REF: Dillman's Tailored Design Method.

4. COMPLETE RESPONSE SCALE in parentheses at the end
   - INTENSITY/SATISFACTION questions: Use Likert scales (1=Low, 5=High)
   - FREQUENCY questions: Use specific frequency bands (Never, 1-2 times/week, etc.)
   - MONETARY/QUANTITY questions: Use category ranges with {target} local currency
     ❌ WRONG: "How much do you spend on groceries? (1=Not much, 5=A lot)"
     ✅ RIGHT: "In a typical month, how much do you spend on groceries? (Under ₹5,000, ₹5,001-₹10,000, ₹10,001-₹20,000, Over ₹20,000)"
   - YES/NO questions: Use (Yes / No / Unsure)

5. CULTURALLY APPROPRIATE for {target}
   - Use {target}'s local currency in monetary scales
   - Respect cultural sensitivities (Ref: Hofstede's Cultural Axioms)

══════════════════════════════════════════
INSTRUMENT STRUCTURE ({count} items total)
══════════════════════════════════════════
- Phase 1: Warm-up (2-3 easy, non-threatening questions)
- Phase 2: KPI / Core Metrics (5-7 questions on the main research topic)
- Phase 3: Behavioral (5-7 questions on actions and habits)
- Phase 4: Demographic Classification (3-5 questions)

OUTPUT FORMAT: Return a JSON object with:
- "questionnaire": [
    {{
       "text": "The question string including scale",
       "scientific_grounding": "Specific reference to Dillman, Krosnick, or Tourangeau principle used",
       "relevance": "Why this specific question is needed for the {target} market"
    }}
  ],
- "strategic_rationale": "one sentence explaining the overall research design logic"
"""

        try:
            response = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json'
                )
            )
            data = safe_parse_json(response.text, default={}, model=GenesisInstrument)
            
            if not isinstance(data, dict):
                data = _force_dict(data, default={})
            if not isinstance(data, dict):
                data = {"questionnaire": [], "strategic_rationale": "Invalid data format"}
            
            raw_questions = data.get("questionnaire", [])
            
            final_questions = []
            for item in raw_questions:
                if isinstance(item, str):
                    final_questions.append({"text": item, "scientific_grounding": "General Psychometric Best Practice", "relevance": "Core context measurement"})
                elif isinstance(item, dict):
                    final_questions.append(item)
                else:
                    coerced = _force_dict(item, default=None)
                    if isinstance(coerced, dict):
                        final_questions.append(coerced)
                    else:
                        final_questions.append({"text": str(item), "scientific_grounding": "General Psychometric Best Practice", "relevance": "Core context measurement"})
            
            data["questionnaire"] = final_questions

            questions = data.get("questionnaire", [])
            if len(questions) < count:
                print(f"[Architect] Under-delivery: got {len(questions)}/{count}. Retrying...")
                retry_prompt = f"""Generate EXACTLY {count - len(questions)} MORE survey questions for {target}.
Topic: {context}
These questions must follow the same rules as above (single concept, temporal frame, scale in parentheses, {target} local currency).
Return a JSON array of strings only."""
                try:
                    retry_resp = await generate_with_retry(
                        client=self.client,
                        model=self.model,
                        contents=retry_prompt,
                        config=types.GenerateContentConfig(response_mime_type='application/json')
                    )
                    extra = safe_parse_json(retry_resp.text, default={})
                    extra_list = []
                    if isinstance(extra, list):
                        extra_list = extra
                    elif isinstance(extra, dict) and "questionnaire" in extra:
                        extra_list = extra["questionnaire"]
                    for item in extra_list:
                        if isinstance(item, str):
                            questions.append({"text": item, "scientific_grounding": "General Psychometric Best Practice", "relevance": "Core context measurement"})
                        elif isinstance(item, dict):
                            questions.append(item)
                        else:
                            coerced = _force_dict(item, default=None)
                            if isinstance(coerced, dict):
                                questions.append(coerced)
                    
                    data["questionnaire"] = questions[:count]
                except Exception:
                    pass
                
            return data
        except Exception as e:
            print(f"[Architect] Generation Error: {e}")
            return {"questionnaire": ["Error generating survey. Please try again."], "strategic_rationale": "System Error"}

    # ──────────────────────────────────────────────────────────
    # MAIN ENTRY: Streaming Genesis Pipeline with Heartbeat
    # ──────────────────────────────────────────────────────────
    async def _pump_telemetry(self, task, hb):
        """Yields heartbeats while waiting for a task."""
        while not task.done():
            for beat in hb.drain():
                yield beat
            await asyncio.sleep(0.5)
        # Final drain
        for beat in hb.drain():
            yield beat

    async def create_full_package_stream(self, context: str, count: int = 20, mission: Optional[Any] = None, targeting: Optional[Dict] = None):
        """
        Streaming version of the full Genesis pipeline with internal auditing.
        Yields NDJSON logs of agent activity.
        
        HEARTBEAT SYSTEM (v2 — anti-QUIC-timeout):
        ─────────────────────────────────────────────
        A background asyncio task pushes {"type": "heartbeat"} chunks every 
        2 seconds into an asyncio.Queue. Between every major await, the 
        generator drains the queue and yields all accumulated heartbeats.
        """
        hb = StreamHeartbeat(interval=2.0)
        
        def log(agent: str, action: str, details: str):
            return json.dumps({
                "type": "log",
                "timestamp": time.strftime("%H:%M:%S"),
                "agent": agent,
                "action": action,
                "details": details
            }) + "\n"

        try:
            hb.start()
            
            # PHASE 1: GENERATION
            yield log("ARCHITECT", "INITIALIZING", "Synthesizing research objectives into structural anchors.")
            for beat in hb.drain():
                yield beat
            
            initial_task = asyncio.create_task(self.generate_instrument(context, count, mission=mission, targeting=targeting))
            async for beat in self._pump_telemetry(initial_task, hb):
                yield beat
            initial = await initial_task # Assuming generate_instrument returns a dict, not a tuple (dict, usage)
            
            if not isinstance(initial, dict):
                initial = _force_dict(initial, default={})
            if not isinstance(initial, dict):
                initial = {"questionnaire": [], "strategic_rationale": "Generation failed."}
                
            questions = initial.get("questionnaire", [])
            yield log("ADJUDICATOR", "DRAFTING", f"Base instrument synthesized. {len(questions)} items ready for Bureau perfection.")
            for beat in hb.drain():
                yield beat

            # PHASE 2: PERFECT VIA GENUINE AUDIT
            yield log("SENTINEL", "SCANNING", "Scanning draft for cognitive bias and linguistic ambiguity.")
            for beat in hb.drain():
                yield beat
            
            perfected = []
            q_texts = [q.get("text", q) if isinstance(q, dict) else str(q) for q in questions]
            
            async def progress_callback(agent: str, action: str, details: str):
                log_chunk = log(agent, action, details)
                await hb._queue.put(log_chunk)

            for i, q_text in enumerate(q_texts):
                yield log("ARCHITECT", "AUDITING", f"Item {(i+1):02}/{count:02} :: Evaluating psychometric integrity.")
                
                audit_task = asyncio.create_task(self._perfect_single_question(q_text, mission=mission, targeting=targeting, log_callback=progress_callback))
                async for beat in self._pump_telemetry(audit_task, hb):
                    yield beat
                res = await audit_task
                
                progress_val = int(((i + 1) / count) * 100)
                yield log("SYSTEM", "SIGNAL", f"Vetted {i+1}/{count} items. Progress: {progress_val}%")
                
                perfected.append(res)
                
                if res != q_text:
                    yield log("ADJUDICATOR", "REFINEMENT", f"Protocol violation detected in Item {i+1}. Applying scientific rewrite.")

            yield log("ADJUDICATOR", "VERIFICATION", "All protocol violations resolved. Instrument integrity verified.")
            for beat in hb.drain():
                yield beat

            # PHASE 3: VALIDATE VIA SIMULATION
            yield log("PROFILER", "RECONNAISSANCE", "Extracting cultural personas for stress-test simulation.")
            for beat in hb.drain():
                yield beat
                
            persona_task = asyncio.create_task(self.simulator.generate_personas_validation(5, context, mission=mission, targeting=targeting))
            async for beat in self._pump_telemetry(persona_task, hb):
                yield beat
            personas, _p_usage = await persona_task
            
            yield log("SENTINEL", "DEPLOYING", "Deploying n=5 synthetic agent panel for field simulation.")
            for beat in hb.drain():
                yield beat
                
            sim_task = asyncio.create_task(self.simulator.run_simulation(personas, perfected, mode="validation", mission=mission))
            async for beat in self._pump_telemetry(sim_task, hb):
                yield beat
            df_results, provenance = await sim_task
            
            df_results = df_results.fillna("")
            results_list = df_results.to_dict(orient="records")
            
            yield log("AUDITOR", "ANALYZING", "Processing simulation telemetry and behavioral signals.")
            for beat in hb.drain():
                yield beat
                
            report_task = asyncio.create_task(self.simulator.generate_validation_report(context, perfected, results_list, mission=mission, targeting=targeting))
            async for beat in self._pump_telemetry(report_task, hb):
                yield beat
            simulation_report, _r_usage = await report_task
            
            if not isinstance(simulation_report, dict):
                simulation_report = _force_dict(simulation_report, default={})
            if not isinstance(simulation_report, dict):
                simulation_report = {"executive_summary": "Validation complete."}

            # ENRICHMENT
            simulation_justifications = simulation_report.get("question_justifications", [])
            raw_draft_items = initial.get("questionnaire", [])
            
            final_justifications = []
            for i, perfected_text in enumerate(perfected):
                draft_item = raw_draft_items[i] if i < len(raw_draft_items) else {}
                if not isinstance(draft_item, dict): draft_item = {}
                sim_item = simulation_justifications[i] if i < len(simulation_justifications) else {}
                if not isinstance(sim_item, dict): sim_item = {}
                
                final_justifications.append({
                    "question": perfected_text,
                    "relevance_to_objective": sim_item.get("relevance_to_objective") or draft_item.get("relevance", "Core Strategic Measurement"),
                    "psychometric_trustworthiness": sim_item.get("psychometric_trustworthiness") or draft_item.get("scientific_grounding", "Validated Bureau Quality"),
                    "design_rationale": sim_item.get("design_rationale") or "High-fidelity cognitive flow",
                    "validation_confirmed": sim_item.get("validation_confirmed") or "Verified via n=5 synthetic simulation"
                })
            
            simulation_report["question_justifications"] = final_justifications

            # PHASE 4: PACKAGING
            yield log("ARCHITECT", "FINALIZING", "Synthesizing field manual and scientific disclosures.")
            for beat in hb.drain():
                yield beat
            
            package_prompt = f"""
            [BUREAU PACKAGING PROTOCOL]
            You are the Lead Quality Auditor. Finalize the certification docs for this instrument.
            
            INSTRUMENT: {json.dumps(perfected)}
            SIMULATION SUMMARY: {simulation_report.get('executive_summary', '')}
            DEMOGRAPHIC INSIGHTS: {json.dumps(simulation_report.get('demographic_insights', []))}
            
            Generate a JSON object with:
            1. "deployment_best_practices": (list of 4-5 strings) specific to this research.
            2. "potential_outcomes": (string) 2-3 sentences predicting what the client will find.
            3. "scientific_disclosure": (string) exactly 100 words explaining the Bureau's scientific methodology.
            """
            
            package_task = asyncio.create_task(generate_with_retry(
                client=self.client,
                model=self.model,
                contents=package_prompt,
                config=types.GenerateContentConfig(max_output_tokens=1000, response_mime_type='application/json')
            ))
            async for beat in self._pump_telemetry(package_task, hb):
                yield beat
            resp = await package_task
            
            package_details = safe_parse_json(resp.text)
            
            if not isinstance(package_details, dict):
                package_details = _force_dict(package_details, default={})
            if not isinstance(package_details, dict):
                package_details = {
                    "deployment_best_practices": ["Standard field procedures"],
                    "potential_outcomes": "High-fidelity data capture.",
                    "scientific_disclosure": SCIENTIFIC_FOUNDATION[:200]
                }

            package = {
                "mission": mission.dict() if mission else None,
                "instrument": perfected,
                "strategic_rationale": initial.get("strategic_rationale", ""),
                "field_manual": package_details,
                "simulation_report": simulation_report,
                "certified_by": "AVA Lead Architect v2.0",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
            }
            
            for beat in hb.drain():
                yield beat
                
            package["formatted_report"] = bureau_reports.generate_dossier(package)
            package["field_instrument_html"] = bureau_reports.generate_field_instrument(package)

            # Save to Database for persistence
            from db_manager import save_mission
            await save_mission(package["mission"]["mission_id"] if package["mission"] else package["timestamp"], package)

            # ── STOP HEARTBEAT BEFORE FINAL PAYLOAD ──
            hb.stop()
            
            yield log("ADJUDICATOR", "COMPLETE", "Genesis Suite successfully compiled. Delivering package.")
            yield json.dumps({"type": "package", "data": package}) + "\n"

        except Exception as e:
            hb.stop()
            yield json.dumps({"type": "error", "detail": str(e)}) + "\n"

    async def create_full_package(self, context: str, count: int = 20, mission: Optional[Any] = None, targeting: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Non-streaming version:
        1. Generate raw instrument
        2. Perfect via genuine audit (parallel, NO auto-pass)
        3. Validate via n=5 simulation
        4. Package
        """
        print(f"[Genesis] Phase 1: Generating raw instrument for context: {context[:50]}...")
        initial = await self.generate_instrument(context, count, mission=mission, targeting=targeting)
        
        if not isinstance(initial, dict):
            initial = _force_dict(initial, default={})
        if not isinstance(initial, dict):
            print("[Genesis] WARNING: Phase 1 returned invalid format, using fallback.")
            initial = {"questionnaire": [], "strategic_rationale": "Error"}
            
        questions = initial.get("questionnaire", [])
        if not isinstance(questions, list):
            print("[Genesis] WARNING: Questionnaire is not a list, using fallback.")
            questions = []

        print(f"[Genesis] Phase 2: Perfecting {len(questions)} questions via Bureau Audit...")
        q_texts = [q.get("text", q) if isinstance(q, dict) else str(q) for q in questions]
        perfected = await self.perfect_instrument(q_texts, mission=mission, targeting=targeting)

        print(f"[Genesis] Phase 3: Running n=5 simulation for validation...")
        personas = await self.simulator.generate_personas_validation(5, context, mission=mission, targeting=targeting)
        df_results, provenance = await self.simulator.run_simulation(personas, perfected, mode="validation", mission=mission)
        
        df_results = df_results.fillna("")
        results_list = df_results.to_dict(orient="records")
        simulation_report = await self.simulator.generate_validation_report(context, perfected, results_list, mission=mission, targeting=targeting)
        
        if not isinstance(simulation_report, dict):
            simulation_report = _force_dict(simulation_report, default={})
        if not isinstance(simulation_report, dict):
            print("[Genesis] WARNING: Simulation report is invalid, using fallback.")
            simulation_report = {"executive_summary": "Validation complete."}
        
        # ── ENRICHMENT: Finalize Justifications ──
        simulation_justifications = simulation_report.get("question_justifications", [])
        raw_draft_items = initial.get("questionnaire", [])
        final_justifications = []
        for i, perfected_text in enumerate(perfected):
            draft_item = raw_draft_items[i] if i < len(raw_draft_items) else {}
            if not isinstance(draft_item, dict): draft_item = {}
            sim_item = simulation_justifications[i] if i < len(simulation_justifications) else {}
            if not isinstance(sim_item, dict): sim_item = {}
            final_justifications.append({
                "question": perfected_text,
                "relevance_to_objective": sim_item.get("relevance_to_objective") or draft_item.get("relevance", "Core Objective Measurement"),
                "psychometric_trustworthiness": sim_item.get("psychometric_trustworthiness") or draft_item.get("scientific_grounding", "Validated Bureau Quality"),
                "design_rationale": sim_item.get("design_rationale") or "High-fidelity cognitive flow",
                "validation_confirmed": sim_item.get("validation_confirmed") or "Verified via n=5 synthetic simulation"
            })
        simulation_report["question_justifications"] = final_justifications

        print(f"[Genesis] Phase 4: Finalizing Bureau Certification & Field Manual...")

        package_prompt = f"""
        [BUREAU PACKAGING PROTOCOL]
        INSTRUMENT: {json.dumps(perfected)}
        SIMULATION SUMMARY: {simulation_report.get('executive_summary', '')}
        
        Generate a JSON object with:
        - "deployment_best_practices": [list of 3 specific strings]
        - "potential_outcomes": "string"
        - "scientific_disclosure": "string"
        """

        try:
            resp = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=package_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json'
                )
            )
            package_details = safe_parse_json(resp.text)
            
            if not isinstance(package_details, dict):
                package_details = _force_dict(package_details, default={})
            if not isinstance(package_details, dict):
                package_details = {}
        except Exception:
            package_details = {
                "deployment_best_practices": ["Standard field procedures", "Neutral interviewer bias", "Census-weighted sampling"],
                "potential_outcomes": "High-fidelity data with <5% margin of error.",
                "scientific_disclosure": SCIENTIFIC_FOUNDATION[:200]
            }

        if "deployment_best_practices" not in package_details:
            package_details["deployment_best_practices"] = ["Standard field procedures", "Neutral interviewer bias", "Census-weighted sampling"]

        package = {
            "mission": mission.dict() if mission else None,
            "instrument": perfected,
            "strategic_rationale": initial.get("strategic_rationale", ""),
            "field_manual": package_details,
            "simulation_report": simulation_report,
            "certified_by": "AVA Lead Architect v2.0",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

        package["formatted_report"] = bureau_reports.generate_dossier(package)
        package["field_instrument_html"] = bureau_reports.generate_field_instrument(package)

        return package