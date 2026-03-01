import pandas as pd
import json
import os
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

class SentinelService:
    """
    ENTITY: SENTINEL
    Role: Data Intake & Schema Inference Agent.
    Responsibilities:
    1. Parsing raw CSV/Excel ground-work data.
    2. Agentic inference of column types using Gemini.
    3. Normalization of messy field data into Bureau Standards.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY required for Sentinel Inference.")
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-1.5-flash"

    async def ingest_file(self, file_path: str) -> pd.DataFrame:
        """Parses a file into a pandas DataFrame."""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.csv':
            return pd.read_csv(file_path)
        elif ext in ['.xls', '.xlsx']:
            return pd.read_excel(file_path)
        else:
            raise ValueError(f"Sentinel cannot ingest format: {ext}")

    async def infer_schema(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Agentic Schema Inference.
        AVA's Sentinel Agent looks at the data and 'guesses' the mapping.
        """
        # Take a peek at the data (first 5 rows)
        sample = df.head(5).to_json(orient='records')
        headers = list(df.columns)

        prompt = f"""You are the Sentinel Agent, the first pillar of the Bureau's Agentic Analysis Council.
Your mission is to map raw ground-work data columns to Bureau Research Standards.

DATA SAMPLE:
Headers: {headers}
Sample Rows: {sample}

TASK:
Identify which columns correspond to these Bureau Entities:
1. DEMOGRAPHICS (Age, Gender, Region/Location, Occupation, etc.)
2. SURVEY_QUESTIONS (The actual items respondents answered)
3. METADATA (Timestamp, ID, GPS coordinates - if any)

Return a JSON object with:
- "mapping": {{ "BureauStandard": "OriginalColumnName" }}
- "confidence_scores": {{ "OriginalColumnName": 0-1.0 }}
- "agentic_notes": "A brief, authoritative note on any anomalies detected in the structure."
- "type_detection": {{ "OriginalColumnName": "numeric" | "text" | "categorical" }}
"""

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.1
                )
            )
            return json.loads(response.text)
        except Exception as e:
            return {
                "error": str(e),
                "mapping": {},
                "agentic_notes": "Sentinel encountered a processing error during inference."
            }

    def brag(self) -> str:
        """Transparently states the service's agentic capabilities."""
        return (
            "I am Sentinel, the Bureau's Reconnaissance Entity. "
            "I do not simply parse files; I use agentic reasoning to reconstruct "
            "the intent behind your data structures, ensuring your ground-work "
            "is grounded in scientific standard before analysis begins."
        )

# Singleton for easy re-use across tools
sentinel = SentinelService()
