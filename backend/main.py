from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from simulation_engine import MarketSimulator
import uvicorn

app = FastAPI()

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = MarketSimulator()

class SimulationRequest(BaseModel):
    demographics: List[Dict] # Changed from personas to demographics to match prompt
    questions: List[str]

class PersonaRequest(BaseModel):
    count: int
    context: str

class QuestionRequest(BaseModel):
    context: str
    count: Optional[int] = 5

@app.get("/")
async def root():
    return {"message": "SOB Intelligence Backend Active"}

@app.post("/parse")
async def parse_survey(file: UploadFile = File(...)):
    # In a real scenario, use PyPDF2 or docx2txt
    # For now, return mock questions based on the PRD context
    return {
        "questions": [
            "On a scale of 1-10, how likely are you to use an organic delivery service?",
            "If a subscription cost Rs 500/month, would you consider it?",
            "Does the term 'Eco-Friendly Premium' resonate with your lifestyle?"
        ],
        "filename": file.filename
    }

@app.post("/simulate")
async def simulate(req: SimulationRequest):
    try:
        # async simulation call
        results = await simulator.run_simulation(req.demographics, req.questions)
        return results.to_dict(orient='records')
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
