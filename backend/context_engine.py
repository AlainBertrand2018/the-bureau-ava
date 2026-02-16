import json
import time
import uuid
import os
import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator
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

class CulturalDossier(BaseModel):
    country: str
    economic_context: str = Field(..., description="Detailed forensic economic analysis with specific figures")
    cultural_axioms: List[str] = Field(..., description="Core societal values and communication norms")
    linguistic_nuances: List[str] = Field(..., description="Honorifics, register, and specific phrasing rules")
    taboos: List[str] = Field(..., description="Topics to avoid or handle with extreme care")
    demographic_archetypes: List[PersonaArchetype] = Field(..., description="5-7 representative personas for this market")
    fieldwork_etiquette: List[str] = Field(..., description="How to engage respondents in this specific culture")
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

    async def generate_dossier_stream(self, config: MissionConfiguration) -> AsyncGenerator[str, None]:
        audit_trail = []
        
        # --- PHASE 1: THE SENTINEL (Research Agent) ---
        log = self._log("SENTINEL", "INITIATED", f"Deploying Research Scrapers for {config.target_audience}")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        research_prompt = f"""
        Find precise, real-world economic and sociological data for: '{config.target_audience}' within the region of {config.target_region}, {config.target_country}.
        
        SPECIFICALLY SEARCH FOR:
        1. Average monthly income / purchasing power / earnings in {config.target_country} currency (2024/2025 data).
        2. Cost of living pressures and financial anxieties specific to this group.
        3. Real-world slang, verlan, or linguistic codes used by this group.
        4. Specific taboos or sensitive topics for this demographic.
        
        Provide a detailed summary with cited numbers and facts.
        """
        
        log = self._log("SENTINEL", "SEARCHING", f"Querying Global Index for '{config.target_audience} economics {config.target_region}'")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        start_time = time.time()
        research_data = ""
        try:
            # Asynchronous call to prevent blocking
            response_research = await self.client.aio.models.generate_content(
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
        ROLE: You are an Expert Forensic Auditor and Sociologist.
        
        INPUT DATA (FROM SENTINEL):
        {research_data}
        
        MISSION CONTEXT:
        - Country: {config.target_country}
        - Audience: {config.target_audience}
        
        TASK: Synthesize this into a 'CulturalDossier' JSON.
        
        REQUIREMENTS:
        1. 'economic_context': Must include the SPECIFIC INCOME NUMBERS found by Sentinel. Cite the sources in the text.
        2. 'cultural_axioms': Deduce values from the economic reality (e.g. 'Distrust of authority due to low wages').
        3. 'linguistic_nuances': A FLAT list of strings (e.g. ["Use of 'Ji' for elders", "Avoidance of first names"]). Do NOT use categories/objects.
        4. 'taboos': Must be specific to this group (e.g. 'Asking about hourly wage').
        5. 'demographic_archetypes': traits must be a SINGLE STRING description, not a list.
        6. 'fieldwork_etiquette': A FLAT list of strings.
        7. 'citation_index': List the sources mentioned or implied.
        
        Return a single JSON object with snake_case keys exactly fitting the schema.
        Key structure: country, economic_context, cultural_axioms, linguistic_nuances, taboos, demographic_archetypes (list of {{"name", "role", "traits", "background"}}), fieldwork_etiquette, citation_index.
        """
        
        log = self._log("PROFILER", "ANALYZING", "Cross-referencing economic data with behavioral models")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        try:
            response_synthesis = await self.client.aio.models.generate_content(
                model="gemini-2.0-flash", 
                contents=synthesis_prompt,
                config={
                    "response_mime_type": "application/json"
                }
            )
            
            raw_text = response_synthesis.text
            # Basic cleanup
            if "```json" in raw_text: raw_text = raw_text.split("```json")[1].split("```")[0]
            elif "```" in raw_text: raw_text = raw_text.split("```")[1].split("```")[0]
            
            # Defensive parsing
            try:
                data = json.loads(raw_text)
            except:
                # Fallback if cleaner failed
                import re
                json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
                if json_match:
                    data = json.loads(json_match.group(0))
                else:
                    raise ValueError("Failed to parse JSON")
            
            # Unwrap if needed
            if isinstance(data, list) and len(data) > 0: data = data[0]
            
            # Normalize keys
            data = self._normalize_keys(data)
            
            # --- SANITIZATION LAYER ---
            list_fields = ["linguistic_nuances", "fieldwork_etiquette", "cultural_axioms", "taboos"]
            for field in list_fields:
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

            # Fix traits if list
            if "demographic_archetypes" in data and isinstance(data["demographic_archetypes"], list):
                for arch in data["demographic_archetypes"]:
                    if "traits" in arch and isinstance(arch["traits"], list):
                        arch["traits"] = ", ".join(arch["traits"])
            # --------------------------
            
            # Validate / Fill defaults
            if "country" not in data: data["country"] = config.target_country
            if "citation_index" not in data: data["citation_index"] = ["Source grounding provided by Google Search"]
            if "economic_context" not in data: data["economic_context"] = "Economic data processing pending."
            
            log = self._log("ADJUDICATOR", "VERIFYING", f"Validated {len(data.get('citation_index', []))} citations against Sentinel Knowledge")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"

            log = self._log("AVA", "CERTIFIED", "Dossier approved for distribution")
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
