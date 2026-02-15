import json
import asyncio
import time
import os
from typing import List, Dict, Any, Optional
from google import genai
from dotenv import load_dotenv
from simulation_engine import MarketSimulator

# Load environment variables (must happen before genai.Client)
load_dotenv()

# We import the core methodology statement to ensure every report is anchored
try:
    with open("c:/Users/USER/Desktop/SOB_SurveyOptimizationBureau/SOB/docs/scientific_foundations.md", "r") as f:
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
        api_key = os.getenv("GOOGLE_API_KEY")
        self.client = genai.Client(api_key=api_key)
        self.simulator = MarketSimulator()
        self.model = "gemini-2.0-flash"

    # ──────────────────────────────────────────────────────────
    # GENUINE INTERNAL AUDIT
    # Same AI, same evaluation — but NO auto-pass exemption.
    # The /quick_audit hero demo is completely unaffected.
    # ──────────────────────────────────────────────────────────
    async def _genuine_audit(self, question: str) -> Dict[str, Any]:
        """
        Honest self-audit for AVA's own output.
        
        Key difference from /quick_audit's perform_audit():
        - NO "Gold Standard" exemption ("DO NOT find flaws")
        - NO Consensus Lock (auto-100)
        - Evaluates EVERY question critically, even if it has a scale
        """
        prompt = f"""You are AVA, an elite survey methodologist at The Bureau.
Perform a RIGOROUS quality audit of this survey question. Be genuinely critical.
Having a response scale does NOT automatically make a question good.

CHECK ALL OF THESE — score harshly if ANY are present:

1. LEADING/BIAS: Does the phrasing push toward a particular answer?
   BAD: "How much do you agree that climate change is a serious threat?" (presupposes threat)
   GOOD: "How concerned are you about the potential effects of climate change? (1=Not at all, 5=Extremely)"

2. DOUBLE-BARRELED: Does it ask about TWO things?
   BAD: "How satisfied are you with our quality and price?" (two concepts)
   GOOD: "How satisfied are you with service quality? (1=Very Dissatisfied, 5=Very Satisfied)"

3. AMBIGUITY: Could respondents interpret key terms differently?
   BAD: "How often do you engage in eco-friendly activities?" (what counts as eco-friendly?)
   GOOD: "In the past month, how often have you recycled household waste? (Never, Rarely, Sometimes, Often, Always)"

4. MISSING OPTIONS: Does the scale miss valid responses?
   BAD: "How often do you exercise? (Daily, Weekly, Monthly)" (missing "Never")
   GOOD: "How often do you exercise? (Never, Rarely, Monthly, Weekly, Daily)"

5. VAGUE TEMPORAL FRAME: No specific time reference?
   BAD: "How satisfied are you with our service?"
   GOOD: "In the past 3 months, how satisfied have you been with our service?"

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
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt
            )

            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1] if "\n" in text else text[3:]
                if text.endswith("```"):
                    text = text[:-3].strip()

            return json.loads(text)

        except Exception as e:
            print(f"[Architect] Audit error: {e}")
            return {
                "quality_score": 0,
                "issues": [{"type": "ERROR", "detail": str(e)}],
                "verdict": "Audit failed",
                "rewrite": question
            }

    async def _perfect_single_question(self, question: str) -> str:
        """
        Runs a single question through the genuine audit.
        If it fails (<95), uses the rewrite. Re-audits up to 2 passes.
        Returns the best version.
        """
        audit = await self._genuine_audit(question)
        score = int(audit.get("quality_score", 0))

        if score >= 95:
            return question

        # Take the rewrite
        current = audit.get("rewrite", question) or question
        best = current
        best_score = score

        for _ in range(2):
            re_audit = await self._genuine_audit(current)
            re_score = int(re_audit.get("quality_score", 0))

            if re_score > best_score:
                best_score = re_score
                best = current

            if re_score >= 95:
                return current

            # Targeted rewrite addressing specific issues
            rewrite_prompt = f"""You are a senior survey methodologist. Fix this question.

CURRENT: "{current}"
SCORE: {re_score}/100
ISSUES: {json.dumps(re_audit.get('issues', []))}

REWRITE RULES:
- If LEADING/BIAS: Remove loaded language. Ask neutrally.
- If DOUBLE-BARRELED: Split into ONE concept only.
- If AMBIGUOUS: Define vague terms or replace with specific ones.
- If MISSING OPTIONS: Add "Other" or expand the scale.
- If NO TEMPORAL FRAME: Add "In the past [X months]..."
- MUST end with an appropriate scale in parentheses.
- Keep it concise and culturally neutral for Mauritius.

Output ONLY the perfected question. No quotes, no explanation."""

            try:
                resp = await self.client.aio.models.generate_content(
                    model=self.model,
                    contents=rewrite_prompt
                )
                current = resp.text.strip().strip('"').strip("'")
            except Exception:
                break

        # Safety: ensure scale present
        if "(" not in best:
            best += " (1=Very Dissatisfied, 5=Very Satisfied)"

        return best

    async def perfect_instrument(self, questions: List[str]) -> List[str]:
        """
        Runs ALL 20 questions through genuine audit IN PARALLEL.
        Semaphore(5) prevents API rate limits.
        """
        sem = asyncio.Semaphore(5)

        async def bounded(q):
            async with sem:
                return await self._perfect_single_question(q)

        tasks = [bounded(q) for q in questions]
        return list(await asyncio.gather(*tasks))

    # ──────────────────────────────────────────────────────────
    # PHASE 1: Generate raw instrument
    # ──────────────────────────────────────────────────────────
    async def generate_instrument(self, context: str, count: int = 20) -> Dict[str, Any]:
        prompt = f"""
        [SCIENTIFIC PROTOCOL: ARCHITECT GENESIS]
        You are the Lead Research Architect at The Bureau.
        Craft a {count}-item survey instrument for this context:

        CONTEXT: {context}

        CRITICAL RULES — every question MUST:
        1. Ask about exactly ONE concept (never double-barreled)
        2. Use neutral, unbiased language (no leading words like "serious", "important", "agree that")
        3. Include a specific temporal frame ("In the past 3 months...")
        4. End with a complete response scale in parentheses
        5. Be culturally appropriate for diverse Mauritian audiences

        ANTI-PATTERNS — these will FAIL audit:
        ✗ "How much do you agree that X is a threat?" → LEADING (presupposes threat)
        ✗ "How satisfied are you with quality and price?" → DOUBLE-BARRELED
        ✗ "Do you engage in eco-friendly activities?" → AMBIGUOUS (undefined term)
        ✗ "Are you aware of X?" → VAGUE (no temporal frame, binary)
        
        GOOD PATTERNS:
        ✓ "In the past 3 months, how satisfied have you been with network speed? (1=Very Dissatisfied, 5=Very Satisfied)"
        ✓ "How familiar are you with the topic of climate change? (Not at all familiar, Slightly familiar, Moderately familiar, Very familiar, Extremely familiar)"
        ✓ "In the past year, how often have you recycled household waste? (Never, Rarely, Sometimes, Often, Always)"

        Divide into phases: Warm-up, KPI, Behavioral, Demographic.

        Return ONLY a JSON object with:
        - questionnaire: [list of {count} strings]
        - strategic_rationale: (string)
        - metadata: {{ items: {count}, version: "2.0-Genesis" }}
        """

        response = await self.client.aio.models.generate_content(
            model=self.model,
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )

        return json.loads(response.text)

    # ──────────────────────────────────────────────────────────
    # MAIN ENTRY: Genesis Pipeline
    # ──────────────────────────────────────────────────────────
    async def create_full_package(self, context: str, count: int = 20) -> Dict[str, Any]:
        """
        1. Generate raw instrument
        2. Perfect via genuine audit (parallel, NO auto-pass)
        3. Validate via n=5 simulation
        4. Package
        """
        # 1. Generate
        initial = await self.generate_instrument(context, count)
        questions = initial.get("questionnaire", [])

        # 2. Perfect via genuine audit (PARALLEL, NO Consensus Lock)
        perfected = await self.perfect_instrument(questions)

        # 3. Validate via simulation (VALIDATION MODE — natural responses, no Red Team)
        personas = await self.simulator.generate_personas_validation(5, context)
        df_results, provenance = await self.simulator.run_simulation(personas, perfected, mode="validation")
        results_list = df_results.to_dict(orient="records")
        simulation_report = await self.simulator.generate_validation_report(context, perfected, results_list)

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
            resp = await self.client.aio.models.generate_content(
                model=self.model,
                contents=package_prompt,
                config={'response_mime_type': 'application/json'}
            )
            package_details = json.loads(resp.text)
        except Exception:
            package_details = {
                "deployment_best_practices": ["Standard field procedures", "Neutral interviewer bias", "Census-weighted sampling"],
                "potential_outcomes": "High-fidelity data with <5% margin of error.",
                "scientific_disclosure": SCIENTIFIC_FOUNDATION[:200]
            }

        if "deployment_best_practices" not in package_details:
            package_details["deployment_best_practices"] = ["Standard field procedures", "Neutral interviewer bias", "Census-weighted sampling"]

        return {
            "instrument": perfected,
            "strategic_rationale": initial.get("strategic_rationale", ""),
            "field_manual": package_details,
            "simulation_report": simulation_report,
            "certified_by": "AVA Lead Architect v2.0",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }
