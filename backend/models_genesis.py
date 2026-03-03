from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GenesisPersona(BaseModel):
    name: str = Field(..., description="Full name of the respondent archetype")
    age: Any = Field(..., description="Age or age range")
    location: str = Field(..., description="Geographic location within the target territory")
    occupation: str = Field(..., description="Job or economic activity")
    traits: str = Field(..., description="Psychographical and behavioral characteristics")

class GenesisQuestion(BaseModel):
    text: str = Field(..., description="The high-fidelity question text")
    relevance: str = Field(..., description="Rationale linking this question to objectives")
    scientific_grounding: str = Field(..., description="Psychometric principle utilized")

class GenesisInstrument(BaseModel):
    questionnaire: List[GenesisQuestion] = Field(..., description="List of items in the draft instrument")
    strategic_rationale: str = Field(..., description="Executive strategy for the questionnaire design")

class AuditResult(BaseModel):
    quality_score: int = Field(..., ge=0, le=100)
    issues: List[Dict[str, str]] = Field(default_factory=list)
    verdict: str
    rewrite: str

class ValidationQuestionJustification(BaseModel):
    question: str
    relevance_to_objective: str
    psychometric_trustworthiness: str
    design_rationale: str
    validation_confirmed: str

class ValidationReport(BaseModel):
    executive_summary: str
    quality_score: int
    methodology_notes: List[str]
    question_justifications: List[ValidationQuestionJustification]
    field_deployment_protocol: List[str]
    demographic_insights: List[Dict[str, str]]
    next_steps: List[str]
    bureau_verdict: str

class GenesisFinalPackage(BaseModel):
    mission: Optional[Dict[str, Any]] = None
    instrument: List[str]
    strategic_rationale: str
    field_manual: Dict[str, Any]
    simulation_report: ValidationReport
    certified_by: str = "AVA Lead Architect v2.0"
    timestamp: str
    formatted_report: Optional[str] = None
    field_instrument_html: Optional[str] = None
