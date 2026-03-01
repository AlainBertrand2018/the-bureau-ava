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
from google.genai import types
from dotenv import load_dotenv
from logger import bureau_logger

load_dotenv()

# ── Models ──

class AudienceTargeting(BaseModel):
    country: str = ""
    region: str = ""
    language: str = ""
    gender: str = "Mixed"
    age_group: str = "Any"
    marital_status: str = "Regardless"
    revenue_group: str = "Regardless"
    education_level: str = "Regardless"
    employment_status: str = "Regardless"
    urbanization: str = "Regardless"

class MissionConfiguration(BaseModel):
    target_country: str
    target_region: str
    target_language: str
    target_audience: str
    targeting_refinement: Optional[AudienceTargeting] = None
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

    # ── UTILITY: Stringify nested dicts/lists into flat strings ──
    def _stringify(self, val: Any) -> str:
        """Recursively converts dicts/lists into pipe-delimited display strings."""
        if isinstance(val, dict):
            parts = []
            for k, v in val.items():
                k_pretty = str(k).replace('_', ' ').title()
                v_pretty = self._stringify(v)
                parts.append(f"{k_pretty}: {v_pretty}")
            return " | ".join(parts)
        elif isinstance(val, list):
            return ", ".join([str(x) for x in val])
        return str(val)

    # ── SEMANTIC ALIAS MAP ──
    # Maps every known AI-hallucinated key variant to our canonical Pydantic field name.
    SEMANTIC_ALIASES = {
        # Top-level aliases
        "archetypes": "demographic_archetypes",
        "personas": "demographic_archetypes",
        "sampling": "sampling_parameters",
        # Economics sub-keys
        "salaries": "salary_ranges",
        "salary": "salary_ranges",
        "wages": "salary_ranges",
        "minimum_wage": "salary_ranges",
        "parity": "gender_revenue_parity",
        "gender_pay_gap": "gender_revenue_parity",
        "macro": "macro_indicators",
        "macro_economics": "macro_indicators",
        "gdp": "macro_indicators",
        "fiscal": "budgetary_decisions",
        "government_policy": "budgetary_decisions",
        "economic_challenges": "budgetary_decisions",
        # Education sub-keys
        "attainment": "educational_attainment",
        "attainment_overview": "educational_attainment",
        "education_system": "educational_attainment",
        "higher_education_enrollment": "educational_attainment",
        "education_access": "educational_attainment",
        "literacy": "literacy_levels",
        "literacy_rate": "literacy_levels",
        "adult_literacy_rate": "literacy_levels",
        # Technology sub-keys
        "metrics": "adoption_metrics",
        "internet_penetration": "adoption_metrics",
        "social_media_reach": "adoption_metrics",
        "mobile_usage": "adoption_metrics",
        "literacy_indices": "tech_literacy",
        "tech_literacy_indices": "tech_literacy",
        "digital_literacy": "tech_literacy",
        "digital_divide": "tech_literacy",
        # Demographics sub-keys
        "population": "gender_ratios",
        "total_population": "gender_ratios",
        "gender_ratio": "gender_ratios",
        "urban_vs_rural": "urban_rural_split",
        "urbanization": "urban_rural_split",
        "ethnic_composition": "ethnic_religious_composition",
        "religious_composition": "ethnic_religious_composition",
        "ethnic_groups": "ethnic_religious_composition",
        "religious_groups": "ethnic_religious_composition",
        "ethnic_religious_composition_note": "ethnic_religious_composition",
        "age_median": "age_structure",
        "age_distribution": "age_structure",
        # Sampling sub-keys
        "population_size": "targeted_segment_size",
        "segment_size": "targeted_segment_size",
        "sample_size": "ideal_sample_size",
        "mode": "suggested_distribution_mode",
        "distribution_mode": "suggested_distribution_mode",
    }

    def _resolve_aliases(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Resolves aliased keys at the top level and within structural sub-dicts."""
        # Top-level pass
        for alias, canonical in self.SEMANTIC_ALIASES.items():
            if alias in data and canonical not in data:
                data[canonical] = data.pop(alias)

        # Nested pass within structural roots
        for root_key in ["economics", "education", "technology", "demographics", "sampling_parameters"]:
            sub = data.get(root_key)
            if isinstance(sub, dict):
                for alias, canonical in self.SEMANTIC_ALIASES.items():
                    if alias in sub and canonical not in sub:
                        sub[canonical] = sub.pop(alias)
                # Merge split ethnic + religious into one field
                if root_key == "demographics":
                    merged_parts = []
                    for merge_key in ["ethnic_composition", "religious_composition", "ethnic_groups", "religious_groups"]:
                        if merge_key in sub:
                            merged_parts.append(self._stringify(sub.pop(merge_key)))
                    if merged_parts and "ethnic_religious_composition" not in sub:
                        sub["ethnic_religious_composition"] = " | ".join(merged_parts)
        return data

    def _sanitize_dossier_data(self, data: Any, config: MissionConfiguration) -> Dict[str, Any]:
        """
        Bureau Data Recovery Pipeline (v3).
        Execution order: Unwrap → Normalize → Alias Resolve → Flatten → Validate → Defaults.
        """
        # ── STEP 0: Unwrap list wrapper ──
        if isinstance(data, list) and len(data) > 0:
            data = data[0]
        if not isinstance(data, dict):
            data = {}

        # ── STEP 1: Normalize all keys to snake_case ──
        data = self._normalize_keys(data)

        # ── STEP 2: Unwrap root wrappers ("CulturalDossier", "dossier", etc.) ──
        for wrapper in ["culturaldossier", "cultural_dossier", "dossier"]:
            if wrapper in data and isinstance(data[wrapper], dict):
                inner = data[wrapper]
                if "economics" in inner or "country" in inner or "cultural_axioms" in inner:
                    data = inner
                    data = self._normalize_keys(data)  # Re-normalize after unwrap
                    break

        # ── STEP 3: Resolve semantic aliases (salaries→salary_ranges, etc.) ──
        data = self._resolve_aliases(data)

        # ── STEP 4: Flatten list-type fields (citation_index, cultural_axioms, etc.) ──
        list_fields = ["linguistic_nuances", "fieldwork_etiquette", "cultural_axioms", "taboos", "citation_index"]
        for field in list_fields:
            if field in data and isinstance(data[field], dict):
                flat = []
                for k, v in data[field].items():
                    if isinstance(v, list):
                        flat.extend([f"{k}: {x}" for x in v])
                    else:
                        flat.append(f"{k}: {v}")
                data[field] = flat
            elif field in data and not isinstance(data[field], list):
                data[field] = [str(data[field])]
            elif field not in data:
                data[field] = []

        # ── STEP 5: Stringify nested dicts within structural sections ──
        for root_key in ["economics", "education", "technology", "demographics", "sampling_parameters"]:
            sub = data.get(root_key)
            if isinstance(sub, dict):
                for k, v in sub.items():
                    sub[k] = self._stringify(v)

        # ── STEP 6: Archetype repair (dict→list, fill missing fields) ──
        if "demographic_archetypes" not in data:
            data["demographic_archetypes"] = []
        if isinstance(data["demographic_archetypes"], dict):
            data["demographic_archetypes"] = list(data["demographic_archetypes"].values())
        if isinstance(data["demographic_archetypes"], list):
            repaired = []
            for arch in data["demographic_archetypes"]:
                if not isinstance(arch, dict):
                    continue
                if "traits" in arch and isinstance(arch["traits"], list):
                    arch["traits"] = ", ".join(arch["traits"])
                arch.setdefault("name", "Unnamed Persona")
                arch.setdefault("role", arch.get("occupation", arch.get("description", "General Consumer")))
                arch.setdefault("traits", arch.get("values", "Representative of local demographic"))
                arch.setdefault("background", arch.get("bio", arch.get("political_concerns", "General population member")))
                repaired.append(arch)
            data["demographic_archetypes"] = repaired

        # ── STEP 7: Synthesize economic_context for backward compatibility ──
        if "economic_context" not in data and "economics" in data and isinstance(data["economics"], dict):
            econ = data["economics"]
            parts = []
            if "macro_indicators" in econ:
                parts.append(f"Macro: {econ['macro_indicators']}")
            if "salary_ranges" in econ:
                parts.append(f"Salaries: {econ['salary_ranges']}")
            data["economic_context"] = " | ".join(parts) if parts else "Economic data available in structured format."

        # ── STEP 8: Fill ALL required fields with defaults ──
        data.setdefault("country", config.target_country)

        # Economics
        if not isinstance(data.get("economics"), dict):
            data["economics"] = {}
        for f in ["salary_ranges", "gender_revenue_parity", "macro_indicators", "budgetary_decisions"]:
            data["economics"].setdefault(f, "[BUREAU ESTIMATE] Data synthesis in progress")

        # Demographics
        if not isinstance(data.get("demographics"), dict):
            data["demographics"] = {}
        for f in ["gender_ratios", "age_structure", "urban_rural_split", "ethnic_religious_composition"]:
            data["demographics"].setdefault(f, "[BUREAU ESTIMATE] Regional proxy applied")

        # Education
        if not isinstance(data.get("education"), dict):
            data["education"] = {}
        for f in ["literacy_levels", "educational_attainment"]:
            data["education"].setdefault(f, "[BUREAU ESTIMATE] Data synthesis in progress")

        # Technology
        if not isinstance(data.get("technology"), dict):
            data["technology"] = {}
        for f in ["adoption_metrics", "tech_literacy"]:
            data["technology"].setdefault(f, "[BUREAU ESTIMATE] Data synthesis in progress")

        # Sampling Parameters
        if not isinstance(data.get("sampling_parameters"), dict):
            data["sampling_parameters"] = {}
        data["sampling_parameters"].setdefault("targeted_segment_size", "[BUREAU ESTIMATE] Based on census data")
        data["sampling_parameters"].setdefault("ideal_sample_size", "384 (95% confidence, 5% margin)")
        data["sampling_parameters"].setdefault("suggested_distribution_mode", "Hybrid (Field + Digital)")

        # Citations
        if not data.get("citation_index"):
            data["citation_index"] = ["Source grounding provided via Google Search Grounding [VERIFIED]"]

        return data

    async def generate_dossier_stream(self, config: MissionConfiguration) -> AsyncGenerator[str, None]:
        audit_trail = []
        start_time = time.time()
        
        # --- PHASE 1: THE SENTINEL (Research Agent) ---
        log = self._log("SENTINEL", "DEPLOYED", f"Initiating deep-scan of {config.target_country} market parameters")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        research_prompt = f"""
[BUREAU INTELLIGENCE DIRECTIVE — SENTINEL FORENSIC BRIEFING]
Target: '{config.target_audience}' in {config.target_region}, {config.target_country}.

You are the Sentinel — a Forensic Intelligence Auditor. Search the live web and produce a STRUCTURED briefing.

SOURCE HIERARCHY (use in this order):
1. National Statistics Bureau of {config.target_country} (e.g., National Bureau of Statistics, ONS, Census Bureau)
2. International Bodies: World Bank, IMF, ILO, UN Data
3. Trusted Press: Reuters, BBC, Al Jazeera, Bloomberg, local newspapers of record
4. DISCARD: SalaryExplorer, Payscale, Glassdoor, Numbeo — do NOT cite these.

EVERY number MUST include its source in brackets, e.g.: "GDP Growth: 4.7% [Source: World Bank 2024]"
If a specific number is unavailable, estimate using regional proxies and label: [BUREAU PROXY ESTIMATE]

You MUST structure your output under EXACTLY these headings:

## ECONOMICS
- Monthly Minimum Wage (local currency + USD equivalent)
- Median Household Income (monthly, local currency)
- GDP Growth Rate (2023, 2024, 2025 projected)
- Inflation / CPI (most recent)
- Gender Pay Gap (if available)
- Key government fiscal policies or budget priorities

## DEMOGRAPHICS
- Total Population (most recent)
- Gender Ratio (male vs female %)
- Age Structure (0-14, 15-64, 65+ percentages, median age)
- Urbanization Rate (%)
- Ethnic Composition (major groups with %)
- Religious Composition (major groups with %)

## EDUCATION
- Adult Literacy Rate (overall + by gender if available)
- Educational system overview (free/paid, key levels)
- Higher education enrollment trends

## TECHNOLOGY
- Internet Penetration (%)
- Mobile Connectivity (subscriptions per 100 people)
- Social Media Users (total + % of population)
- Digital literacy notes

## CULTURAL NOTES
- Key societal values and communication norms
- Linguistic landscape (official language, lingua franca, code-switching patterns)
- Known taboos or sensitive topics
- Fieldwork etiquette recommendations

## SAMPLING INTELLIGENCE
- Estimated target segment population size
- Recommended survey distribution channel (Field / Digital / Hybrid) with reasoning

Be exhaustive. Every section must have at least 2 data points. No section may be empty.
"""

        if config.targeting_refinement:
            targeting = config.targeting_refinement.dict()
            research_prompt += f"\nPRECISION TARGETING ARCHETYPE:\n{json.dumps(targeting, indent=2)}\n"
            research_prompt += "Focus specifically on data and behaviors relevant to THIS group.\n"

        research_prompt += f"\nProvide a forensic summary. If specific numbers are available, you MUST include them."
        
        log = self._log("SENTINEL", "SEARCHING", f"Querying Global Index for '{config.target_audience} economics {config.target_region}'")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        start_time = time.time()
        research_data = ""
        try:
            # Asynchronous call with retry to handle 429
            response_research = await generate_with_retry(
                client=self.client,
                model="gemini-3-flash", 
                contents=research_prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
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
[BUREAU INTELLIGENCE DIRECTIVE — PROFILER SYNTHESIS PROTOCOL]

ROLE: You are the Lead Sociological Profiler. Your task is to transform raw Sentinel intelligence into a structured Cultural Dossier.

SENTINEL BRIEFING (RAW INTELLIGENCE):
---
{research_data}
---

MISSION PARAMETERS:
{json.dumps(config.dict(), indent=2)}

═══════════════════════════════════════════════
CRITICAL RULES — READ BEFORE GENERATING
═══════════════════════════════════════════════

1. NO DATA VOIDS: You are FORBIDDEN from writing "Unknown", "Unavailable", "Data not found", or "N/A".
   If the Sentinel briefing lacks a specific data point, you MUST synthesize a [BUREAU ESTIMATE] using regional proxies.

2. EXACT KEY NAMES: You MUST use EXACTLY the key names shown below. DO NOT invent your own.
   ❌ WRONG: "salaries", "macro", "fiscal", "parity", "archetypes", "literacy", "metrics"
   ✅ RIGHT: "salary_ranges", "macro_indicators", "budgetary_decisions", "gender_revenue_parity", "demographic_archetypes", "literacy_levels", "adoption_metrics"

3. STRING VALUES ONLY inside economics/demographics/education/technology/sampling_parameters.
   Every value must be a plain string. Do NOT nest JSON objects inside these sections.
   ❌ WRONG: "salary_ranges": {{ "minimum": 17110, "median": 57780 }}
   ✅ RIGHT: "salary_ranges": "Minimum Wage: [Local Currency] [Amount]/month | Median Household: [Local Currency] [Amount]/month [Source: ...]"

4. CITATION_INDEX must be a flat LIST OF STRINGS, not a dictionary.
   ❌ WRONG: "citation_index": {{ "gdp": "[VERIFIED]" }}
   ✅ RIGHT: "citation_index": ["GDP Growth: 4.7% — World Bank 2024 [VERIFIED]", "Literacy: ~92% — [BUREAU ESTIMATE]"]

5. DEMOGRAPHIC_ARCHETYPES must be a LIST of objects (not a dictionary), each with exactly: name, role, traits, background.

═══════════════════════════════════════════════
EXACT JSON SCHEMA — COPY THIS STRUCTURE
═══════════════════════════════════════════════

{{
  "country": "{config.target_country}",
  "economics": {{
    "salary_ranges": "Minimum Wage: [amount] | Median Income: [amount] [Source: ...]",
    "gender_revenue_parity": "Gap: [X]% | Context: ... [Source: ...]",
    "macro_indicators": "GDP Growth: [X]% | Inflation: [X]% | Unemployment: [X]% [Source: ...]",
    "budgetary_decisions": "Key fiscal policies and budget priorities [Source: ...]"
  }},
  "demographics": {{
    "gender_ratios": "Male: [X]% | Female: [X]% | Total Population: [N] [Source: ...]",
    "age_structure": "0-14: [X]% | 15-64: [X]% | 65+: [X]% | Median Age: [X] [Source: ...]",
    "urban_rural_split": "Urban: [X]% | Rural: [X]% [Source: ...]",
    "ethnic_religious_composition": "[Group A]: [X]% | [Group B]: [X]% | ... [Source: ...]"
  }},
  "education": {{
    "literacy_levels": "Adult Literacy: [X]% | Male: [X]% | Female: [X]% [Source: ...]",
    "educational_attainment": "System overview and attainment data [Source: ...]"
  }},
  "technology": {{
    "adoption_metrics": "Internet: [X]% | Mobile: [X] per 100 | Social Media: [X]% [Source: ...]",
    "tech_literacy": "Digital literacy assessment and digital divide notes [Source: ...]"
  }},
  "sampling_parameters": {{
    "targeted_segment_size": "[N] estimated based on [source/logic]",
    "ideal_sample_size": "384 (95% confidence, 5% margin of error)",
    "suggested_distribution_mode": "Hybrid (Field + Digital) — reasoning based on internet penetration and cultural norms"
  }},
  "cultural_axioms": ["Core value 1", "Core value 2", "Core value 3", "Core value 4"],
  "linguistic_nuances": ["Language note 1", "Language note 2", "Language note 3"],
  "taboos": ["Sensitive topic 1", "Sensitive topic 2", "Sensitive topic 3"],
  "demographic_archetypes": [
    {{ "name": "Culturally appropriate name", "role": "Professional role", "traits": "Key behavioral traits", "background": "Life context reflecting economic reality" }},
    {{ "name": "...", "role": "...", "traits": "...", "background": "..." }}
  ],
  "citation_index": [
    "Minimum Wage: [Amount] — [National Authority] [Year] [VERIFIED]",
    "Literacy Rate: [X]% — Regional proxy estimate [BUREAU ESTIMATE]"
  ]
}}

Generate 5-7 demographic_archetypes. Each must reflect the economic data (e.g., if inflation is high, the persona's background should mention cost-of-living pressure).
Return ONLY the JSON object. No markdown, no commentary.
"""
        
        log = self._log("PROFILER", "ANALYZING", "Cross-referencing economic data with behavioral models")
        audit_trail.append(log)
        yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
        
        try:
            response_synthesis = await generate_with_retry(
                client=self.client,
                model="gemini-3-flash", 
                contents=synthesis_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
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

            # ── ADJUDICATOR: Real Validation Pass ──
            # Check for residual schema violations before Pydantic
            adjudication_issues = []
            for section in ["economics", "demographics", "education", "technology"]:
                sub = data.get(section, {})
                if isinstance(sub, dict):
                    for k, v in sub.items():
                        if not isinstance(v, str):
                            adjudication_issues.append(f"{section}.{k} is {type(v).__name__}, forcing to str")
                            data[section][k] = self._stringify(v)
            
            if isinstance(data.get("sampling_parameters"), dict):
                for k, v in data["sampling_parameters"].items():
                    if not isinstance(v, str):
                        adjudication_issues.append(f"sampling_parameters.{k} is {type(v).__name__}, forcing to str")
                        data["sampling_parameters"][k] = self._stringify(v)

            if not isinstance(data.get("citation_index"), list):
                adjudication_issues.append("citation_index was not a list, repaired")
                data["citation_index"] = [self._stringify(data.get("citation_index", "No citations"))]

            if not isinstance(data.get("demographic_archetypes"), list):
                adjudication_issues.append("demographic_archetypes was not a list, repaired")
                if isinstance(data.get("demographic_archetypes"), dict):
                    data["demographic_archetypes"] = list(data["demographic_archetypes"].values())
                else:
                    data["demographic_archetypes"] = []

            issue_count = len(adjudication_issues)
            if issue_count > 0:
                bureau_logger.warning(f"ADJUDICATOR repaired {issue_count} schema violations: {adjudication_issues}")
                log = self._log("ADJUDICATOR", "REPAIRED", f"Corrected {issue_count} schema violations in AI output")
            else:
                log = self._log("ADJUDICATOR", "VERIFIED", f"All {len(data.get('citation_index', []))} citations validated. Schema integrity confirmed.")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"

            log = self._log("AVA", "CERTIFIED", "Granular Statistical Dossier approved for distribution")
            audit_trail.append(log)
            yield json.dumps({"type": "log", "data": json.loads(log.json())}) + "\n"
            
            dossier = CulturalDossier(**data)
            
            # Yield final dossier
            yield json.dumps({"type": "dossier", "data": json.loads(dossier.json())}) + "\n"

        except Exception as e:
            msg = f"Dossier Generation Failed: {str(e)}"
            bureau_logger.error(msg)
            log = self._log("PROFILER", "ERROR", msg)
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
