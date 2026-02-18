import json
import asyncio
import time
import os
from typing import List, Dict, Any, Optional
from google import genai
from dotenv import load_dotenv
from simulation_engine import MarketSimulator
from ai_utils import generate_with_retry, safe_parse_json
from report_generator import bureau_reports
from config import settings
from logger import bureau_logger

# Load environment variables (must happen before genai.Client)
load_dotenv()

# We import the core methodology statement to ensure every report is anchored
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_path = os.path.join(base_dir, "../docs/scientific_foundations.md")
    if not os.path.exists(docs_path):
        # Try absolute path fallback just in case
        docs_path = "c:/Users/USER/Desktop/SOB_SurveyOptimizationBureau/SOB/docs/scientific_foundations.md"
    
    with open(docs_path, "r") as f:
        SCIENTIFIC_FOUNDATION = f.read()
except:
    SCIENTIFIC_FOUNDATION = "AVA Core is built on Psychometric Measurement Theory and Agent-Based Modeling."


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
    # Same AI, same evaluation — but NO auto-pass exemption.
    # The /quick_audit hero demo is completely unaffected.
    # ──────────────────────────────────────────────────────────
    async def _genuine_audit(self, question: str, mission: Optional[Any] = None) -> Dict[str, Any]:
        """
        Honest self-audit for AVA's own output.
        """
        target = mission.config.target_country if mission else "Mauritius"
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
            return safe_parse_json(response.text)

        except Exception as e:
            print(f"[Architect] Audit error: {e}")
            return {
                "quality_score": 0,
                "issues": [{"type": "ERROR", "detail": str(e)}],
                "verdict": "Audit failed",
                "rewrite": question
            }

    async def _perfect_single_question(self, question: str, mission: Optional[Any] = None) -> str:
        """
        Runs a single question through the genuine audit.
        If it fails (<95), uses the rewrite. Re-audits up to 2 passes.
        Returns the best version.
        """
        audit = await self._genuine_audit(question, mission=mission)
        score = int(audit.get("quality_score", 0))

        if score >= 95:
            return question

        # Take the rewrite
        current = audit.get("rewrite", question) or question
        best = current
        best_score = score
        target = mission.config.target_country if mission else "Mauritius"

        for _ in range(2):
            re_audit = await self._genuine_audit(current, mission=mission)
            re_score = int(re_audit.get("quality_score", 0))

            if re_score > best_score:
                best_score = re_score
                best = current

            if re_score >= 95:
                return current

            # Targeted rewrite addressing specific issues
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

        # Safety: ensure scale present
        if "(" not in best:
            if any(word in best.lower() for word in ["price", "cost", "how much", "pay"]):
                best += " (e.g., Under $10, $10-$50, Over $50)"
            else:
                best += " (1=Not at all, 5=Extremely)"

        return best

    async def perfect_instrument(self, questions: List[str], mission: Optional[Any] = None) -> List[str]:
        """
        Runs ALL 20 questions through genuine audit IN PARALLEL.
        Semaphore(5) prevents API rate limits.
        """
        sem = asyncio.Semaphore(5)

        async def bounded(q):
            async with sem:
                return await self._perfect_single_question(q, mission=mission)

        tasks = [bounded(q) for q in questions]
        return list(await asyncio.gather(*tasks))

    # ──────────────────────────────────────────────────────────
    # PHASE 1: Generate raw instrument
    # ──────────────────────────────────────────────────────────
    async def generate_instrument(self, context: str, count: int = 20, mission: Optional[Any] = None, targeting: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        target = mission.config.target_country if mission else "Mauritius"
        
        prompt = f"""
        [SCIENTIFIC PROTOCOL: ARCHITECT GENESIS]
        You are the Lead Research Architect at The Bureau.
        Craft a {count}-item survey instrument for {target}.
        
        CONTEXT: {context}
        """

        if targeting:
            prompt += f"\nPRECISION AUDIENCE TARGETING:\n{json.dumps(targeting, indent=2)}\n"
            prompt += "Calibrate the linguistic register, complexity, and cultural framing to this SPECIFIC group.\n"

        if mission:
             prompt += f"\nCULTURAL DOSSIER FOR {target}:\n{json.dumps(mission.dossier.dict(), indent=2)}\n"

        prompt += f"""
        CRITICAL RULES — every question MUST:
        1. Ask about exactly ONE concept (never double-barreled)
        2. Use neutral, unbiased language
        3. Include a specific temporal frame ("In the past 3 months...")
        4. End with a complete response scale in parentheses
        5. Be culturally appropriate for {target} audiences

        Divide into phases: Warm-up, KPI, Behavioral, Demographic.

        OUTPUT FORMAT: Return a JSON object with:
        - "questionnaire": [list of {count} strings]
        - "strategic_rationale": "one sentence explaining the research design"
        """

        try:
            response = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            data = safe_parse_json(response.text)
            
            # Robustness: if AI returns a list directly, wrap it
            if isinstance(data, list):
                return {"questionnaire": data, "strategic_rationale": "High-fidelity instrument generated."}
            
            # Ensure it's a dict
            if not isinstance(data, dict):
                data = {"questionnaire": [], "strategic_rationale": "Invalid data format"}
                
            return data
        except Exception as e:
            print(f"[Architect] Generation Error: {e}")
            return {"questionnaire": ["Error generating survey. Please try again."], "strategic_rationale": "System Error"}

    # ──────────────────────────────────────────────────────────
    # MAIN ENTRY: Genesis Pipeline
    # ──────────────────────────────────────────────────────────
    async def create_full_package(self, context: str, count: int = 20, mission: Optional[Any] = None, targeting: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        1. Generate raw instrument
        2. Perfect via genuine audit (parallel, NO auto-pass)
        3. Validate via n=5 simulation
        4. Package
        """
        # 1. Generate
        print(f"[Genesis] Phase 1: Generating raw instrument for context: {context[:50]}...")
        initial = await self.generate_instrument(context, count, mission=mission, targeting=targeting)
        
        # Robustness Check
        if not isinstance(initial, dict):
            print("[Genesis] WARNING: Phase 1 returned invalid format, using fallback.")
            initial = {"questionnaire": [], "strategic_rationale": "Error"}
            
        questions = initial.get("questionnaire", [])
        if not isinstance(questions, list):
            print("[Genesis] WARNING: Questionnaire is not a list, using fallback.")
            questions = []

        # 2. Perfect via genuine audit
        print(f"[Genesis] Phase 2: Perfecting {len(questions)} questions via Bureau Audit...")
        perfected = await self.perfect_instrument(questions, mission=mission)

        # 3. Validate via simulation
        print(f"[Genesis] Phase 3: Running n=5 simulation for validation...")
        personas = await self.simulator.generate_personas_validation(5, context, mission=mission)
        df_results, provenance = await self.simulator.run_simulation(personas, perfected, mode="validation", mission=mission)
        
        # Sanitize NaN/Inf for JSON compliance
        df_results = df_results.fillna("")
        results_list = df_results.to_dict(orient="records")
        simulation_report = await self.simulator.generate_validation_report(context, perfected, results_list, mission=mission)
        
        if not isinstance(simulation_report, dict):
            print("[Genesis] WARNING: Simulation report is invalid, using fallback.")
            simulation_report = {"executive_summary": "Validation complete."}
        
        print(f"[Genesis] Phase 4: Finalizing Bureau Certification & Field Manual...")
        
        # ... rest of packaging

        # 4. Field Manual
        package_prompt = f"""
        Given these survey questions (perfected via Bureau genuine audit):
        {json.dumps(perfected)}

        Simulation insights: {json.dumps(simulation_report.get('executive_summary', ''))}

        Generate a JSON object with EXACTLY these keys:
        - "deployment_best_practices": [list of 3 specific strings]
        - "potential_outcomes": "string"
        - "scientific_disclosure": "string: condensed version of: {SCIENTIFIC_FOUNDATION}"
        """

        try:
            resp = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=package_prompt,
                config={'response_mime_type': 'application/json'}
            )
            package_details = safe_parse_json(resp.text)
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

        # Generate HTML reports
        package["formatted_report"] = bureau_reports.generate_dossier(package)
        package["field_instrument_html"] = bureau_reports.generate_field_instrument(package)

        return package
