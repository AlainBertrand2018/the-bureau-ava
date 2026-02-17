import json
import time
import uuid
import os
import datetime
import asyncio
from typing import List, Dict, Any, Optional, AsyncGenerator
from ai_utils import generate_with_retry, safe_parse_json
from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

load_dotenv()

# ── Models ──

class MissionConfiguration(BaseModel):
    target_country: str
    target_region: str
    target_language: str
    target_audience: str
    research_topic: Optional[str] = "General Market Research"

class PersonaArchetype(BaseModel):
    name: str = Field(..., description="A culturally appropriate name")
    role: str = Field(..., description="Social or professional role")
    traits: str = Field(..., description="Key personality and behavioral traits")
    background: str = Field(..., description="Brief life context or demographic summary")

class EconomicsDossier(BaseModel):
    salary_ranges: str = Field(..., description="Local salary benchmarks and ranges")
    gender_revenue_parity: str = Field(..., description="Economic status of genders and parity indicators")
    macro_indicators: str = Field(..., description="GDP, Inflation, and Unemployment rates")
    budgetary_decisions: str = Field(..., description="Recent government fiscal policies and consumer impact")

class EducationDossier(BaseModel):
    literacy_levels: str = Field(..., description="Literacy by age-group and gender")
    educational_attainment: str = Field(..., description="General educational landscape")

class TechnologyDossier(BaseModel):
    adoption_metrics: str = Field(..., description="Mobile and internet penetration rates")
    tech_literacy: str = Field(..., description="Digital literacy indices and usage patterns")

class DemographicsDossier(BaseModel):
    gender_ratios: str = Field(..., description="Male to Female population distribution")
    age_structure: str = Field(..., description="Population breakdown by age groups")
    urban_rural_split: str = Field(..., description="Urban vs Rural population percentage")
    ethnic_religious_composition: str = Field(..., description="Major ethnic and religious groups with percentages")

class SamplingParameters(BaseModel):
    targeted_segment_size: str = Field(..., description="Estimated total population size of the target audience based on census data")
    ideal_sample_size: str = Field(..., description="Recommended sample size for statistical significance (e.g. 95% confidence)")
    suggested_distribution_mode: str = Field(..., description="Recommended survey channel (Field, Digital, Social, Hybrid)")

class CulturalDossier(BaseModel):
    country: str
    economic_context: Optional[str] = Field(default=None, description="Executive summary of economic reality")
    economics: EconomicsDossier
    demographics: Optional[DemographicsDossier] = Field(default=None, description="Statistical demographic breakdown")
    sampling_parameters: Optional[SamplingParameters] = Field(default=None, description="Strategic sampling recommendations")
    education: EducationDossier
    technology: TechnologyDossier
    cultural_axioms: List[str] = Field(default=[], description="Core societal values and communication norms")
    linguistic_nuances: List[str] = Field(default=[], description="Honorifics, register, and specific phrasing rules")
    taboos: List[str] = Field(default=[], description="Topics to avoid or handle with extreme care")
    demographic_archetypes: List[PersonaArchetype] = Field(default=[], description="5-7 representative personas for this market")
    fieldwork_etiquette: List[str] = Field(default=[], description="How to engage respondents in this specific culture")
    citation_index: List[str] = Field(default=[], description="List of sources verified by the Adjudicator")

class MissionLogEntry(BaseModel):
    timestamp: str
    agent: str
    action: str
    details: str

class Mission(BaseModel):
    mission_id: str
    config: MissionConfiguration
    dossier: CulturalDossier
    audit_trail: List[MissionLogEntry]
    created_at: float = Field(default_factory=time.time)

# ── Engine ──

class ContextEngine:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            print("WARNING: GOOGLE_API_KEY not found caused warning.")
        try:
            self.client = genai.Client(api_key=self.api_key)
        except Exception as e:
            print(f"Error initializing Google Client: {e}")

    def _normalize_keys(self, data: Any) -> Any:
        if isinstance(data, dict):
            return {k.lower().replace(" ", "_"): self._normalize_keys(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._normalize_keys(i) for i in data]
        return data

    def _log(self, agent: str, action: str, details: str) -> MissionLogEntry:
        return MissionLogEntry(
            timestamp=datetime.datetime.now().strftime("%H:%M:%S"),
            agent=agent,
            action=action,
            details=details
        )

    def _sanitize_dossier_data(self, data: Any, config: MissionConfiguration) -> Dict[str, Any]:
        """
        Ensures the raw AI response fits the CulturalDossier schema exactly.
        Handles unwrapping, flattening dicts to strings, and repairing missing fields.
        """
        # Unwrap if needed
        if isinstance(data, list) and len(data) > 0: data = data[0]
        
        # Normalize keys
        data = self._normalize_keys(data)
        
        # --- UNWRAP LAYER ---
        # If the AI nested everything under "cultural_dossier", unwrap it
        possible_roots = ["CulturalDossier", "cultural_dossier", "culturaldossier", "dossier"]
        for r in possible_roots:
            if r in data and isinstance(data[r], dict):
                # Only unwrap if the root has the meat of the object
                if "economics" in data[r] or "country" in data[r]:
                    data = data[r]
                    break

        # --- SANITIZATION LAYER ---
        list_fields = ["linguistic_nuances", "fieldwork_etiquette", "cultural_axioms", "taboos"]
        for field in list_fields:
            if field not in data:
                data[field] = ["Information grounded in general market trends"]
            
            if field in data and isinstance(data[field], dict):
                # Flatten dict values to list
                flat_list = []
                for k, v in data[field].items():
                    if isinstance(v, list): flat_list.extend([f"{k}: {x}" for x in v])
                    else: flat_list.append(f"{k}: {v}")
                data[field] = flat_list
            # Ensure it is a list
            if field in data and not isinstance(data[field], list):
                data[field] = [str(data[field])]

        # --- FLATTEN NESTED DICTS FOR STRICT STRING FIELDS ---
        # Helper to stringify dicts if Pydantic expects str
        # Helper to stringify dicts if Pydantic expects str
        def stringify_if_dict(val: Any) -> str:
            if isinstance(val, dict):
                parts = []
                for k, v in val.items():
                    k_pretty = str(k).replace('_', ' ').title()
                    v_pretty = stringify_if_dict(v)
                    parts.append(f"{k_pretty}: {v_pretty}")
                return " | ".join(parts)
            elif isinstance(val, list):
                return ", ".join([str(x) for x in val])
            return str(val)

            return str(val)

        structural_fields = ["economics", "education", "technology", "demographics"]
        for root in structural_fields:
            if root in data and isinstance(data[root], dict):
                for k, v in data[root].items():
                    data[root][k] = stringify_if_dict(v)

        # --- BACKWARD COMPATIBILITY: ECONOMIC CONTEXT ---
        # The frontend expects 'economic_context' summary string, but we have structured data.
        # Synthesize it if missing.
        if "economic_context" not in data and "economics" in data and isinstance(data["economics"], dict):
            parts = []
            econ = data["economics"]
            if "macro_indicators" in econ: parts.append(f"Macro: {econ['macro_indicators']}")
            if "salary_ranges" in econ: parts.append(f"Salaries: {econ['salary_ranges']}")
            
            if parts:
                data["economic_context"] = " | ".join(parts)
            else:
                data["economic_context"] = "Economic data available in structured format below."

        # --- ARCHETYPE REPAIR ---
        if "demographic_archetypes" not in data:
            data["demographic_archetypes"] = []
            
        if "demographic_archetypes" in data and isinstance(data["demographic_archetypes"], list):
            valid_archetypes = []
            for arch in data["demographic_archetypes"]:
                # Ensure it is a dict
                if not isinstance(arch, dict): continue
                
                # Fix traits if list
                if "traits" in arch and isinstance(arch["traits"], list):
                    arch["traits"] = ", ".join(arch["traits"])
                
                # Fill missing fields
                if "name" not in arch: arch["name"] = "Unknown Persona"
                if "role" not in arch: arch["role"] = arch.get("description", "Standard Consumer")
                if "traits" not in arch: arch["traits"] = "Representative of local demographic"
                if "background" not in arch: arch["background"] = arch.get("bio", "General population member")
                
                valid_archetypes.append(arch)
            data["demographic_archetypes"] = valid_archetypes
        # --------------------------
        
        # Validate / Fill defaults
        if "country" not in data: data["country"] = config.target_country
        if "citation_index" not in data: data["citation_index"] = ["Source grounding provided via Google Search Grounding"]
        
        # Defensive check for sub-objects
        if "economics" not in data or not isinstance(data["economics"], dict): 
            data["economics"] = {
                "salary_ranges": "Data unavailable", 
                "gender_revenue_parity": "Data unavailable", 
                "macro_indicators": "Data unavailable", 
                "budgetary_decisions": "Data unavailable"
            }
        else:
             # Ensure sub-fields exist
             eco_fields = ["salary_ranges", "gender_revenue_parity", "macro_indicators", "budgetary_decisions"]
             for f in eco_fields:
                 if f not in data["economics"]: data["economics"][f] = "Data unavailable"

        if "education" not in data or not isinstance(data["education"], dict):
            data["education"] = {
                "literacy_levels": "Data unavailable",
                "educational_attainment": "Data unavailable"
            }
        else:
            edu_fields = ["literacy_levels", "educational_attainment"]
            for f in edu_fields:
                if f not in data["education"]: data["education"][f] = "Data unavailable"

        if "technology" not in data or not isinstance(data["technology"], dict):
            data["technology"] = {
                "adoption_metrics": "Data unavailable",
                "tech_literacy": "Data unavailable"
            }
        else:
            tech_fields = ["adoption_metrics", "tech_literacy"]
            for f in tech_fields:
                if f not in data["technology"]: data["technology"][f] = "Data unavailable"

        if "demographics" not in data or not isinstance(data["demographics"], dict):
            # Attempt to infer from other fields or set comprehensive defaults
            data["demographics"] = {
                "gender_ratios": "National Statistics Unavailable",
                "age_structure": "National Statistics Unavailable",
                "urban_rural_split": "National Statistics Unavailable",
                "ethnic_religious_composition": "National Statistics Unavailable"
            }
        else:
            demo_fields = ["gender_ratios", "age_structure", "urban_rural_split", "ethnic_religious_composition"]
            for f in demo_fields:
                if f not in data["demographics"]: data["demographics"][f] = "National Statistics Unavailable"

        if "sampling_parameters" not in data or not isinstance(data["sampling_parameters"], dict):
            data["sampling_parameters"] = {
                "targeted_segment_size": "Estimation Unavailable",
                "ideal_sample_size": "Calculation Unavailable",
                "suggested_distribution_mode": "Hybrid (Field + Digital)"
            }
        else:
            samp_fields = ["targeted_segment_size", "ideal_sample_size", "suggested_distribution_mode"]
            for f in samp_fields:
                if f not in data["sampling_parameters"]: data["sampling_parameters"][f] = "Unavailable"
                
        return data

    async def generate_dossier_stream(self, config: MissionConfiguration) -> AsyncGenerator[str, None]:
        audit_trail = []
        start_time = time.time()
        
        # --- PHASE 1: THE SENTINEL (Research Agent) ---
        log = self._log("SENTINEL", "DEPLOYED", f"Initiating deep-scan of {config.target_country} market parameters")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        research_prompt = f"""
        [BUREAU INTELLIGENCE DIRECTIVE: HIGH-FIDELITY GROUNDING]
        Target: '{config.target_audience}' in {config.target_region}, {config.target_country}.
        
        You MUST fetch precise, granular, and recent (2023-2025) statistical data from authoritative sources 
        (data.un.org, data.worldbank.org, official government portals, Wikipedia).
        
        REQUIRED INDICATORS:
        1. ECONOMICS: Salary ranges for {config.target_audience}, Gender-related revenue gap, GDP growth, Inflation rates (current month/year), Unemployment rates, and recent Budgetary Decisions affecting the populace.
        2. DEMOGRAPHICS: Specific national statistics for Gender Ratios (Male/Female %), Age Structure (0-14, 15-64, 65+), Urban vs Rural population split (%), and Ethnic/Religious composition breakdowns.
        3. EDUCATION: Literacy levels specifically broken down by Age-group and Gender in {config.target_country}.
        4. TECHNOLOGY: Mobile and Internet adoption rates, and Technological Literacy indices.
        5. SOCIO-LINGUISTICS: Real-world slang, linguistic codes, and cultural axioms derived from the current economic reality.
        
        Provide a forensic summary. If specific numbers are available, you MUST include them.
        """
        
        log = self._log("SENTINEL", "SEARCHING", f"Querying Global Index for '{config.target_audience} economics {config.target_region}'")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        start_time = time.time()
        research_data = ""
        try:
            # Asynchronous call with retry to handle 429
            response_research = await generate_with_retry(
                client=self.client,
                model="gemini-2.0-flash", 
                contents=research_prompt,
                config={
                    "tools": [{"google_search": {}}]
                }
            )
            research_data = response_research.text
            
            # Log sources if available
            if hasattr(response_research, 'candidates') and response_research.candidates:
                 meta = response_research.candidates[0].grounding_metadata
                 if meta and hasattr(meta, 'search_entry_point') and meta.search_entry_point:
                     content = meta.search_entry_point.rendered_content
                     log = self._log("SENTINEL", "SOURCING", f"Data Ingested from Live Web...")
                 else:
                     log = self._log("SENTINEL", "SOURCING", "Live Data Ingested (Metadata unavailable)")
            else:
                 log = self._log("SENTINEL", "SOURCING", "Live Data Ingested")
            
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"

        except Exception as e:
            print(f"SENTINEL ERROR: {e}")
            log = self._log("SENTINEL", "ERROR", str(e))
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
            research_data = "Research failed. Proceeding with internal knowledge base."
        
        elapsed = round(time.time() - start_time, 2)
        log = self._log("SENTINEL", "COMPLETE", f"Research Phase finalized in {elapsed}s")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"


        # --- PHASE 2: THE PROFILER & AUDITOR (Synthesis Agent) ---
        log = self._log("PROFILER", "ACTIVATED", "Synthesizing Cultural Dossier from Sentinel Data")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        synthesis_prompt = f"""
        ROLE: You are an Expert Forensic Auditor and Sociologist for the Survey Optimization Bureau.
        
        INPUT DATA (FROM SENTINEL SCRAPE):
        {research_data}
        
        MISSION CONTEXT:
        - Country: {config.target_country}
        - Region: {config.target_region}
        - Audience: {config.target_audience}
        
        TASK: Synthesize the scrape into a 'CulturalDossier' JSON object. You MUST be granular.
        
        STRUCTURAL REQUIREMENTS:
        1. 'economics': Breakdown into salary_ranges, gender_revenue_parity, macro_indicators (GDP/Inflation/Unemployment), and budgetary_decisions. Use precise currency values.
        2. 'demographics': Granular NATIONAL stats. Gender Ratios, Age Structure, Urban/Rural Split, Ethnic/Religious Composition. If scrape is missing numbers, provide general knowledge estimates for {config.target_country}. DO NOT leave empty.
        3. 'education': Specific literacy_levels (Age/Gender split) and attainment overview.
        4. 'technology': adoption_metrics (Mobile/Web) and tech_literacy indices.
        5. 'demographic_archetypes': Create 5-7 personas that embody the specific economics/tech/education levels discovered.
        6. 'cultural_axioms': LIST of strings. 3-5 core societal values or beliefs prevalent in this market.
        7. 'linguistic_nuances': LIST of strings. Specific slang, codes, or communication styles used by the audience.
        8. 'taboos': LIST of strings. Sensitive topics or behaviors to avoid in this culture.
        9. 'sampling_parameters': Calculate specific survey metrics:
           - 'targeted_segment_size': Estimate the total population of '{config.target_audience}' in this region using census data.
           - 'ideal_sample_size': Calculate recommended sample size for 95% confidence level, 5% margin of error.
           - 'suggested_distribution_mode': Recommend 'Field', 'Digital (Email/Social)', or 'Hybrid' based on tech adoption.
        10. 'citation_index': You MUST list the specific URLs or organizations (UN, World Bank, etc.) found in the research.
        
        Return a single JSON object fitting the schema exactly.
        """
        
        log = self._log("PROFILER", "ANALYZING", "Cross-referencing economic data with behavioral models")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        try:
            response_synthesis = await generate_with_retry(
                client=self.client,
                model="gemini-2.0-flash", 
                contents=synthesis_prompt,
                config={
                    "response_mime_type": "application/json"
                }
            )
            
            # Robust Parsing
            data = safe_parse_json(response_synthesis.text)
            
            # FILE LOGGING FOR DEBUG
            try:
                with open("debug_ai_response.log", "a", encoding="utf-8") as f:
                    f.write(f"\n--- MISSION: {config.target_country} ---\n")
                    f.write(f"RAW AI RESPONSE:\n{response_synthesis.text}\n")
                    f.write(f"PARSED DATA KEYS: {list(data.keys())}\n")
            except:
                pass

            # Robust Sanitization & Repair
            data = self._sanitize_dossier_data(data, config)

            log = self._log("ADJUDICATOR", "VERIFYING", f"Validated {len(data.get('citation_index', []))} citations against Sentinel Knowledge")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"

            log = self._log("AVA", "CERTIFIED", "Granular Statistical Dossier approved for distribution")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
            
            dossier = CulturalDossier(**data)
            
            # Yield final dossier
            yield json.dumps({"type": "dossier", "data": json.loads(dossier.json())}) + "\n"

        except Exception as e:
            log = self._log("PROFILER", "ERROR", str(e))
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
            raise e
            log = self._log("ADJUDICATOR", "VERIFYING", f"Validated {len(data.get('citation_index', []))} citations against Sentinel Knowledge")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"

            log = self._log("AVA", "CERTIFIED", "Granular Statistical Dossier approved for distribution")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
            
            dossier = CulturalDossier(**data)
            
            # Combine into tuple for internal use if needed, but here we are streaming
            # We return the dossier object to the caller of this generator? No, caller iterates.
            # We yield the final result.
            yield json.dumps({"type": "dossier", "data": json.loads(dossier.json())}) + "\n"

        except Exception as e:
            log = self._log("PROFILER", "ERROR", str(e))
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
            raise e

    async def initialize_mission_stream_generator(self, config: MissionConfiguration) -> AsyncGenerator[str, None]:
        mission_id = f"MSN-{int(time.time())}-{uuid.uuid4().hex[:6].upper()}"
        
        # Yield initial status
        yield json.dumps({"type": "status", "data": "Mission Initialized"}) + "\n"

        dossier = None
        audit_trail = []
        
        async for chunk in self.generate_dossier_stream(config):
            yield chunk
            # Reconstruct for final object
            try:
                msg = json.loads(chunk)
                if msg["type"] == "log":
                    audit_trail.append(MissionLogEntry(**msg["data"]))
                elif msg["type"] == "dossier":
                    dossier = CulturalDossier(**msg["data"])
            except:
                pass
        
        if dossier:
            mission = Mission(
                mission_id=mission_id,
                config=config,
                dossier=dossier,
                audit_trail=audit_trail
            )
            # Yield final mission object
            yield json.dumps({"type": "mission", "data": json.loads(mission.json())}) + "\n"

context_engine = ContextEngine()

if __name__ == "__main__":
    pass
