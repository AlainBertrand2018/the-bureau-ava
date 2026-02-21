import json
import os
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

class SynthesisService:
    """
    ENTITY: SYNTHESIS
    Role: The Qualitative Coder & Storyteller.
    Responsibilities:
    1. Qualitative Theme Extraction (Codebook Generation).
    2. Sentiment Analysis on open-ended responses.
    3. Narrative Synthesis (Executive Summaries).
    4. Strategic Recommendations based on findings.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY required for Synthesis Agent.")
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-2.0-flash"

    async def code_qualitative_responses(self, responses: List[str]) -> Dict[str, Any]:
        """
        Takes a list of open-ended text responses and generates a 
        thematic summary + sentiment profile.
        """
        if not responses:
            return {"themes": [], "sentiment": "NEUTRAL"}

        # Cap for processing (to manage tokens/latency in real-time)
        batch = responses[:50] 
        
        prompt = f"""You are the Synthesis Agent of the Bureau. 
Your task is to 'code' these ground-work survey responses into thematic pillars.

RESPONSES:
{json.dumps(batch, indent=2)}

TASK:
1. Extract the top 3-5 recurring themes.
2. Assign a sentiment score (-1 to +1) for the overall batch.
3. Provide 3 representative 'Impact Quotes' that exemplify the themes.

Return a JSON object with:
- "themes": [{{ "label": "string", "frequency_estimate": "%", "description": "string" }}]
- "sentiment_score": float
- "sentiment_label": "POSITIVE" | "NEGATIVE" | "NEUTRAL"
- "impact_quotes": ["string"]
"""

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.2
                )
            )
            return json.loads(response.text)
        except Exception as e:
            return {"error": str(e), "themes": [], "sentiment_label": "ERROR"}

    async def generate_executive_verdict(self, quant_data: Dict, qual_data: Dict, context: str) -> Dict[str, Any]:
        """
        The Master Synthesis: Compares Stats vs. Themes.
        This is where AVA 'brags' about her agentic consensus.
        """
        prompt = f"""You are the Lead Research Architect at the Bureau. 
You are performing a Triangulation Synthesis for a global client.

CONTEXT: {context}

QUANTITATIVE FINDINGS (from Analytics Agent):
{json.dumps(quant_data, indent=2)}

QUALITATIVE THEMES (from Synthesis Agent):
{json.dumps(qual_data, indent=2)}

TASK:
Generate a professional Bureau Executive Summary in JSON.
1. HEADLINE: A 1-sentence punchy summary.
2. AGENTIC_CONSENSUS: Do the stats and themes agree? (e.g., 'Numbers show Y, and text confirms Z').
3. STRATEGIC_RECOMMENDATIONS: 3 actionable steps for the client.
4. BUREAU_GRADE: Assign a confidence grade (A to F) based on data consistency.
"""

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json'
                )
            )
            return json.loads(response.text)
        except Exception as e:
            return {"error": str(e), "headline": "Synthesis Failed"}

    def brag(self) -> str:
        """Transparently states the service's agentic capabilities."""
        return (
            "I am the Synthesis Entity. While the others see rows and numbers, "
            "I see the human narrative. I perform the multi-layer coding required "
            "to transform raw fieldwork into a Bureau Verdict, ensuring no "
            "nuance is lost in the machine."
        )

# Singleton
synthesis = SynthesisService()
