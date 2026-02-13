from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import time
from simulation_engine import MarketSimulator
import uvicorn

app = FastAPI()

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = MarketSimulator()

# ── In-memory feedback store (replace with DB in production) ──
feedback_store: List[Dict] = []


# ── Request Models ──

class SimulationRequest(BaseModel):
    demographics: List[Dict]
    questions: List[str]

class PersonaRequest(BaseModel):
    count: int
    context: str

class QuestionRequest(BaseModel):
    context: str
    count: Optional[int] = 5

class AnalysisRequest(BaseModel):
    context: str
    questions: List[str]
    results: List[Dict]

class QuickAuditRequest(BaseModel):
    question: str

class FeedbackItem(BaseModel):
    question_index: int
    question_text: str
    finding_type: str          # e.g. "BIAS", "AMBIGUITY", etc.
    ai_assessment: str         # what the AI said
    client_verdict: str        # "AGREE" or "DISAGREE"
    client_comment: Optional[str] = ""
    timestamp: Optional[float] = None


# ── Endpoints ──

@app.get("/")
async def root():
    return {"message": "The Bureau — Survey Quality Audit Engine v2.0"}

@app.post("/simulate")
async def simulate(req: SimulationRequest):
    """Run diagnostic simulation — returns results + provenance metadata."""
    try:
        df, provenance = await simulator.run_simulation(req.demographics, req.questions)
        return {
            "results": df.to_dict(orient='records'),
            "provenance": provenance
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_personas")
async def generate_personas(req: PersonaRequest):
    try:
        personas = await simulator.generate_personas(req.count, req.context)
        return personas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_questions")
async def generate_questions(req: QuestionRequest):
    try:
        data = await simulator.generate_questions(req.context, req.count)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_results")
async def analyze_results(req: AnalysisRequest):
    try:
        report = await simulator.generate_report(req.context, req.questions, req.results)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── NEW: Benchmark Validation Suite ──

@app.get("/benchmark")
async def run_benchmark():
    """
    Runs the known-flaw benchmark suite against the AI engine.
    Returns detection accuracy, per-question results, and an overall grade.
    This is the 'proof of accuracy' endpoint.
    """
    try:
        result = await simulator.run_benchmark()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── NEW: Customer Feedback Loop ──

@app.post("/feedback")
async def submit_feedback(item: FeedbackItem):
    """
    Clients can submit feedback on individual AI findings.
    AGREE = the AI was correct. DISAGREE = the AI was wrong.
    This builds a calibration dataset over time.
    """
    entry = item.dict()
    entry["timestamp"] = entry.get("timestamp") or time.time()
    feedback_store.append(entry)
    
    # Calculate running accuracy from feedback
    total = len(feedback_store)
    agreed = sum(1 for f in feedback_store if f["client_verdict"] == "AGREE")
    
    return {
        "status": "recorded",
        "feedback_count": total,
        "client_agreement_rate": round(agreed / total * 100, 1) if total > 0 else 0,
        "message": "Thank you. Your feedback improves The Bureau's diagnostic accuracy."
    }

@app.get("/feedback/stats")
async def feedback_stats():
    """Returns aggregated feedback statistics for the trust dashboard."""
    total = len(feedback_store)
    if total == 0:
        return {
            "total_feedback": 0,
            "agreement_rate": None,
            "by_finding_type": {},
            "message": "No client feedback received yet."
        }
    
    agreed = sum(1 for f in feedback_store if f["client_verdict"] == "AGREE")
    
    # Group by finding type
    by_type = {}
    for f in feedback_store:
        ft = f.get("finding_type", "UNKNOWN")
        if ft not in by_type:
            by_type[ft] = {"total": 0, "agreed": 0}
        by_type[ft]["total"] += 1
        if f["client_verdict"] == "AGREE":
            by_type[ft]["agreed"] += 1
    
    for ft in by_type:
        by_type[ft]["accuracy"] = round(
            by_type[ft]["agreed"] / by_type[ft]["total"] * 100, 1
        )
    
    return {
        "total_feedback": total,
        "agreement_rate": round(agreed / total * 100, 1),
        "by_finding_type": by_type
    }


# ── Quick Audit (Hero Section Live Demo) ──

@app.post("/quick_audit")
async def quick_audit(req: QuickAuditRequest):
    """Single-question instant audit for landing page hero demo."""
    try:
        prompt = f"""You are AVA, an expert survey methodologist. Analyse this survey question and return a JSON object with these exact keys:

question: the original question (string)
quality_score: 0-100 (integer)
issues: array of objects, each with "type" (one of: LEADING_LANGUAGE, DOUBLE_BARRELLED, AMBIGUITY, MISSING_OPTIONS, LOADED_LANGUAGE, CULTURAL_SENSITIVITY, SOCIAL_DESIRABILITY, DROP_OFF_RISK) and "detail" (short explanation string, max 15 words)
verdict: one sentence summary of the main problem (string)
rewrite: improved version of the question (string)

Be precise and critical. If the question has no issues, return an empty issues array and quality_score of 85+.
Return ONLY valid JSON, no markdown.

Question to audit: "{req.question}"
"""
        import json as _json
        from google import genai

        client = genai.Client()
        response = await client.aio.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3].strip()

        result = _json.loads(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
