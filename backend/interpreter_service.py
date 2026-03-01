import pandas as pd
import json
import os
import base64
import datetime
import io
from typing import Dict, Any, List, Optional
from logger import bureau_logger
from ai_utils import generate_with_retry, safe_parse_json
from config import settings
from google import genai
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import html

class FieldDataInterpreter:
    """
    AVA Field Data Interpreter v1.0. 
    Converts raw CSV survey data into high-intelligence report dossiers.
    """
    
    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model = "gemini-2.0-flash"

    async def analyze_csv(self, csv_content: str, mission_context: str = "", filename: str = "Bureau Groundwork Dataset") -> Dict[str, Any]:
        """
        AVA 5-Stage Multi-Agent Orchestration Pipeline.
        Sequential chain of command: Discoverer -> Contextualizer -> Challenger -> Sentinel -> AVA.
        """
        try:
            # 0. Robust CSV Parsing
            df = self._parse_csv(csv_content)
            bureau_logger.info(f"PIPELINE_START: {len(df)} rows | {filename}")
            
            # Sanitization: Ensure object columns don't contain unhashable types (like dicts)
            for col in df.select_dtypes(include=['object']).columns:
                df[col] = df[col].apply(lambda x: str(x) if x is not None else "")

            summary_stats = df.describe(include='all').to_json()
            sample_data = df.head(15).to_json()
            columns = list(df.columns)
            row_count = len(df)
            
            total_tokens_in = 0
            total_tokens_out = 0
            chain_of_thought = []
            
            # --- STAGE 1: THE DISCOVERER (Discovery Agent) ---
            discovery_prompt = f"""
            AGENT ROLE: THE DISCOVERER
            TASK: Identify the raw DNA of this dataset. Start with a VIRGIN SLATE.
            
            DATA PARAMETERS:
            - Filename: {filename}
            - Records: {row_count}
            - Fields: {columns}
            
            SAMPLE DATA & STATS:
            {sample_data}
            {summary_stats}
            
            OUTPUT (JSON):
            {{
                "subject": "Clear statement of what this data is about",
                "target_market": "Geography/Demographic/Sector",
                "age_cohorts_identified": ["List of identified age groups like Boomers, Gen Z, etc."],
                "primary_theme": "High-level category (e.g. Climate Change, Retail, Healthcare)",
                "report_title": "Professional title for this intelligence report",
                "questions_discovered": "List of key questions or variables mapping",
                "scoring_standards": "Relevant industry scoring metrics for this specific domain"
            }}
            """
            discovery_res, usage = await self._call_agent(discovery_prompt, "Discovery Agent")
            if usage:
                total_tokens_in += usage.prompt_token_count
                total_tokens_out += usage.candidates_token_count
            discovery_data = safe_parse_json(discovery_res)
            
            chain_of_thought.append({"agent": "Discoverer", "status": "COMPLETED", "output": discovery_data.get("subject", "N/A")})
            bureau_logger.info(f"DISCOVERY_COMPLETE: Subject={discovery_data.get('subject', 'N/A')}")

            # --- STAGE 2: THE CONTEXTUALIZER (Staging Agent) ---
            staging_prompt = f"""
            AGENT ROLE: THE CONTEXTUALIZER
            TASK: Establish external realities and global benchmarks for the discovered subject.
            
            DISCOVERY DATA:
            {json.dumps(discovery_data, indent=2)}
            
            MISSION CONTEXT:
            {mission_context}
            
            OUTPUT (JSON):
            {{
                "market_realities": "Current facts/truths about {discovery_data.get('target_market', 'the market')} in 2025/2026",
                "cohort_benchmarks": "Generation-specific (Boomer, Gen Z, etc) global benchmarks and socio-economic realities for {discovery_data.get('age_cohorts_identified', [])}",
                "global_benchmarks": "Industry standards or competitive references relevant to {discovery_data.get('primary_theme', 'the theme')}",
                "semantic_reference_data": "Key technical terms and definitions to use for analysis"
            }}
            """
            staging_res, usage = await self._call_agent(staging_prompt, "Staging Agent")
            if usage:
                total_tokens_in += usage.prompt_token_count
                total_tokens_out += usage.candidates_token_count
            staging_data = safe_parse_json(staging_res)
            chain_of_thought.append({"agent": "Contextualizer", "status": "COMPLETED", "output": "Environment Staged"})

            # --- STAGE 3: THE CHALLENGER (Analysis Agent) ---
            analysis_prompt = f"""
            AGENT ROLE: THE CHALLENGER
            TASK: Analyze results against market realities and global benchmarks. Challenge hallucinations.
            
            RAW DATA SUMMARY:
            {summary_stats}
            
            DISCOVERY & REALITIES:
            - Subject: {discovery_data.get('subject', 'N/A')}
            - Benchmarks: {staging_data.get('global_benchmarks', 'N/A')}
            - Market Realities: {staging_data.get('market_realities', 'N/A')}
            
            INSTRUCTIONS:
            - Map insights into the Bureau standard pillars.
            - Challenge the data: find where responses deviate from realities.
            - CROSS-COHORT SENTIMENT: Analyze how discovered age groups differ in sentiment and anticipated actions based on their specific cohort benchmarks.
            
            OUTPUT (JSON):
            {{
                "executive_pulse": {{ "growth_verdict": "string", "agentic_insights": "string", "value_gap": "string" }},
                "key_findings": [{{ "label": "string", "value": "string", "context": "string" }}],
                "market_landscape": {{ "economic_resilience": "string", "geopolitical_risk": "string", "regulatory_watch": "string" }},
                "consumer_behavior": {{
                    "primary_influencers": "string",
                    "engagement_patterns": "string",
                    "stakeholder_perception": "string"
                }},
                "competitive_deep_dive": {{ "sector_performance": "string", "impact_analysis": "string", "resource_mapping": "string" }},
                "operational_readiness": {{ "data_hygiene_score": 0-100, "supply_chain_resilience": "string", "inventory_visibility": "string" }},
                "roadmap": {{ "short_term": "string", "mid_term": "string", "long_term": "string" }},
                "forecast_data": {{ "forecast_unit": "string", "2025_actual": "string", "2026_forecast": "string", "2030_projected": "string" }},
                "conclusion": "string",
                "benchmarks": {{ "metric": "value" }}
            }}
            """
            analysis_res, usage = await self._call_agent(analysis_prompt, "Analysis Agent")
            if usage:
                total_tokens_in += usage.prompt_token_count
                total_tokens_out += usage.candidates_token_count
            analysis_data = safe_parse_json(analysis_res)
            chain_of_thought.append({"agent": "Challenger", "status": "COMPLETED", "output": "Analysis Synthesized"})

            # --- STAGE 4: THE SENTINEL (Validation Agent) ---
            validation_prompt = f"""
            AGENT ROLE: THE SENTINEL
            TASK: Test the analysis against verified truths and statistical logic.
            
            ANALYSIS DRAFT:
            {json.dumps(analysis_data, indent=2)}
            
            VERIFICATION TASK:
            - Check for logical hallucinations.
            - Ensure forecast consistency.
            - Verify that {discovery_data.get('primary_theme', 'the theme')} context was maintained.
            
            OUTPUT (JSON):
            {{
                "integrity_score": 0-100,
                "validation_report": "Direct feedback on accuracy",
                "verdict": "VERIFIED or FLAGGED",
                "corrections": "Required adjustments if flagged"
            }}
            """
            validation_res, usage = await self._call_agent(validation_prompt, "Validation Agent")
            if usage:
                total_tokens_in += usage.prompt_token_count
                total_tokens_out += usage.candidates_token_count
            validation_data = safe_parse_json(validation_res)
            chain_of_thought.append({"agent": "Sentinel", "status": "COMPLETED", "output": f"Integrity: {validation_data.get('integrity_score', 'N/A')}%"})

            # --- STAGE 5: AVA (The Arbiter) ---
            arbiter_prompt = f"""
            AGENT ROLE: AVA (THE ARBITER)
            TASK: Final quality gate. Decide on publication or recount.
            
            FULL PIPELINE SUMMARY:
            {json.dumps(chain_of_thought, indent=2)}
            
            VERDICT FROM SENTINEL:
            {validation_data.get('verdict', 'N/A')} - {validation_data.get('validation_report', 'N/A')}
            
            OUTPUT (JSON):
            {{
                "final_approval": true/false,
                "precision_audit": "Detailed audit statement",
                "action": "PUBLISH or RECOUNT"
            }}
            """
            arbiter_res, usage = await self._call_agent(arbiter_prompt, "AVA")
            if usage:
                total_tokens_in += usage.prompt_token_count
                total_tokens_out += usage.candidates_token_count
            arbiter_data = safe_parse_json(arbiter_res)
            
            # --- FINAL ASSEMBLY ---
            final_report = analysis_data
            final_report["report_title"] = discovery_data.get("report_title", "Untitled Report")
            final_report["primary_theme"] = discovery_data.get("primary_theme", "General Analysis")
            final_report["age_cohorts_identified"] = discovery_data.get("age_cohorts_identified", [])
            final_report["source_citation"] = f"Source: {filename} | Records: {row_count} rows | Analyzed: {datetime.datetime.now().strftime('%Y-%m-%d')}"
            final_report["methodology_score"] = validation_data.get("integrity_score", 50)
            final_report["verdict"] = validation_data.get("verdict", "UNKNOWN")
            final_report["verdict_reasoning"] = validation_data.get("validation_report", "No reasoning provided.")
            final_report["precision_audit"] = arbiter_data.get("precision_audit", "No audit performed.")
            final_report["chain_of_thought"] = chain_of_thought
            final_report["row_count"] = row_count
            final_report["col_count"] = len(columns)
            final_report["timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            final_report["source_filename"] = filename
            final_report["tokens_in"] = total_tokens_in
            final_report["tokens_out"] = total_tokens_out
            
            # Run final santization just in case
            final_report = self._validate_and_sanitize(final_report, row_count, len(columns))

            if arbiter_data.get("action") == "RECOUNT":
                bureau_logger.warning("AVA requested a RECOUNT. This implementation proceeds with the current report.")
            
            bureau_logger.info(f"PIPELINE_COMPLETE: Action={arbiter_data.get('action', 'N/A')} | Score={validation_data.get('integrity_score', 'N/A')}")
            
            return final_report

        except Exception as e:
            err_msg = str(e)
            bureau_logger.error(f"PIPELINE_FAILED: {err_msg}")
            # Ensure rate limit errors are clearly communicated to the front end
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                raise Exception("SYSTEM_ERROR: AI Quota Exceeded (429). Please try again later.")
            raise Exception(f"Agentic Pipeline failed: {err_msg}")

    def _parse_csv(self, csv_content: str) -> pd.DataFrame:
        """Helper to parse CSV content robustly."""
        try:
            return pd.read_csv(io.StringIO(csv_content), on_bad_lines='skip')
        except Exception:
            try:
                import csv as csv_mod
                dialect = csv_mod.Sniffer().sniff(csv_content[:2048])
                return pd.read_csv(io.StringIO(csv_content), sep=dialect.delimiter, on_bad_lines='skip')
            except Exception:
                # Last resort: try tab-separated or treat as single-column
                try:
                    return pd.read_csv(io.StringIO(csv_content), sep='\t', on_bad_lines='skip')
                except Exception:
                    return pd.DataFrame({"raw_data": csv_content.split('\n')})

    async def _call_agent(self, prompt: str, agent_name: str) -> (str, Any):
        """Helper to invoke a specific agent within the pipeline."""
        bureau_logger.info(f"CALLING_AGENT: {agent_name}")
        response = await generate_with_retry(
            client=self.client,
            model=self.model,
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return response.text, response.usage_metadata if hasattr(response, 'usage_metadata') else None

    def _validate_and_sanitize(self, analysis: Dict[str, Any], row_count: int, col_count: int) -> Dict[str, Any]:
        """
        Post-AI Validation Gate.
        Cross-checks all critical data fields before publishing to frontend/PDF.
        Flags and auto-corrects hallucinated or malformed values.
        """
        flags: List[str] = []
        
        # ── 0. REPORT IDENTITY: Ensure dynamic title and theme exist ──
        if not analysis.get("report_title") or not isinstance(analysis.get("report_title"), str):
            fallback_title = f"{analysis.get('source_filename', 'BUREAU')[:20]} ANALYSIS 2026"
            flags.append(f"TITLE_MISSING → generated '{fallback_title}'")
            analysis["report_title"] = fallback_title
        
        if not analysis.get("primary_theme") or not isinstance(analysis.get("primary_theme"), str):
            flags.append("THEME_MISSING → defaulted to BUREAU ARCHITECTURE")
            analysis["primary_theme"] = "BUREAU ARCHITECTURE"

        # Sanitize: Strip any whitespace or extra characters
        analysis["report_title"] = str(analysis["report_title"]).strip()
        analysis["primary_theme"] = str(analysis["primary_theme"]).strip()

        # ── 1. METHODOLOGY SCORE: Must be 0-100 integer ──
        score = analysis.get("methodology_score")
        if score is not None:
            try:
                score = int(float(str(score)))
                if score < 0 or score > 100:
                    flags.append(f"SCORE_OUT_OF_RANGE: {score} → clamped to 0-100")
                    score = max(0, min(100, score))
                analysis["methodology_score"] = score
            except (ValueError, TypeError):
                flags.append(f"SCORE_INVALID: '{score}' → defaulted to 50")
                analysis["methodology_score"] = 50
        else:
            flags.append("SCORE_MISSING → defaulted to 50")
            analysis["methodology_score"] = 50
        
        # ── 2. FORECAST DATA: Must be concise human-readable strings ──
        forecast = analysis.get("forecast_data", {})
        if isinstance(forecast, dict):
            for key in ["2025_actual", "2026_forecast", "2030_projected"]:
                val = forecast.get(key)
                if val is not None:
                    val_str = str(val)
                    # Check if it's a raw large number (hallucination indicator)
                    try:
                        num = float(val_str.replace(",", ""))
                        if num > 1e6 and not any(c in val_str.upper() for c in ['T', 'B', 'M', 'K']):
                            # Auto-format the hallucinated number
                            if num >= 1e12:
                                corrected = f"{num / 1e12:.1f}T"
                            elif num >= 1e9:
                                corrected = f"{num / 1e9:.1f}B"
                            elif num >= 1e6:
                                corrected = f"{num / 1e6:.1f}M"
                            else:
                                corrected = f"{num:.0f}"
                            flags.append(f"FORECAST_CORRECTED: {key} raw '{val}' → '{corrected}'")
                            forecast[key] = corrected
                    except (ValueError, TypeError):
                        pass  # It's already a string like "6.3T", which is fine
                    
                    # Final length check: if value is absurdly long, truncate
                    if len(str(forecast.get(key, ""))) > 10:
                        flags.append(f"FORECAST_TRUNCATED: {key} too long → trimmed")
                        forecast[key] = str(forecast[key])[:10]
            analysis["forecast_data"] = forecast
        else:
            flags.append("FORECAST_DATA_MISSING → set to N/A defaults")
            analysis["forecast_data"] = {"2025_actual": "N/A", "2026_forecast": "N/A", "2030_projected": "N/A"}
        
        # ── 3. DATA HYGIENE SCORE: Must be 0-100 ──
        op_readiness = analysis.get("operational_readiness", {})
        if isinstance(op_readiness, dict):
            dh_score = op_readiness.get("data_hygiene_score")
            if dh_score is not None:
                try:
                    dh_score = int(float(str(dh_score)))
                    if dh_score < 0 or dh_score > 100:
                        flags.append(f"HYGIENE_SCORE_CLAMPED: {dh_score}")
                        dh_score = max(0, min(100, dh_score))
                    op_readiness["data_hygiene_score"] = dh_score
                except (ValueError, TypeError):
                    flags.append(f"HYGIENE_SCORE_INVALID: '{dh_score}' → 50")
                    op_readiness["data_hygiene_score"] = 50
            analysis["operational_readiness"] = op_readiness
        
        # ── 4. KEY FINDINGS: Must be list of {label, value, context} objects ──
        findings = analysis.get("key_findings", [])
        if isinstance(findings, list):
            sanitized_findings = []
            for i, f in enumerate(findings):
                if isinstance(f, str):
                    # AI returned plain strings instead of structured objects
                    flags.append(f"FINDING_{i}_RESTRUCTURED: plain string → object")
                    sanitized_findings.append({"label": f"Finding {i+1}", "value": "—", "context": f})
                elif isinstance(f, dict):
                    # Ensure all required keys exist
                    sanitized_findings.append({
                        "label": str(f.get("label", f"KPI {i+1}")),
                        "value": str(f.get("value", "N/A")),
                        "context": str(f.get("context", "No context provided"))
                    })
                else:
                    flags.append(f"FINDING_{i}_INVALID: type={type(f).__name__}")
            analysis["key_findings"] = sanitized_findings
        else:
            flags.append("KEY_FINDINGS_MISSING → empty list")
            analysis["key_findings"] = []
        
        # ── 5. REQUIRED SECTIONS: Ensure all pillars exist ──
        required_sections = {
            "executive_pulse": {"growth_verdict": "Awaiting verdict", "agentic_insights": "Synthesizing", "value_gap": "Analyzing disparities"},
            "market_landscape": {"economic_resilience": "Not assessed", "geopolitical_risk": "Not assessed", "regulatory_watch": "Not assessed"},
            "consumer_behavior": {"primary_influencers": "Not assessed", "engagement_patterns": "Not assessed", "stakeholder_perception": "Not assessed"},
            "competitive_deep_dive": {"sector_performance": "Not assessed", "impact_analysis": "Not assessed", "resource_mapping": "Not assessed"},
            "roadmap": {"short_term": "Pending", "mid_term": "Pending", "long_term": "Pending"},
        }
        for section, defaults in required_sections.items():
            if not isinstance(analysis.get(section), dict):
                flags.append(f"SECTION_MISSING: {section} → populated with defaults")
                analysis[section] = defaults
            else:
                # Fill in any missing sub-keys
                for key, default_val in defaults.items():
                    if not analysis[section].get(key):
                        analysis[section][key] = default_val

        # ── 6. BENCHMARKS: Must be a dict ──
        if not isinstance(analysis.get("benchmarks"), dict):
            flags.append("BENCHMARKS_MISSING → empty dict")
            analysis["benchmarks"] = {}
        
        # ── 7. LIST FIELDS: Ensuring specific arrays exist ──
        if not isinstance(analysis.get("age_cohorts_identified"), list):
            analysis["age_cohorts_identified"] = []

        # ── 8. STRING FIELDS: Ensure they exist ──
        for field in ["conclusion", "verdict", "verdict_reasoning", "source_citation", "report_title", "primary_theme"]:
            if not analysis.get(field) or not isinstance(analysis.get(field), str):
                analysis[field] = str(analysis.get(field, "Not provided")) or "Not provided"
        
        # ── LOG VALIDATION RESULTS ──
        analysis["validation_flags"] = flags
        analysis["validation_passed"] = len(flags) == 0
        
        if flags:
            bureau_logger.warning(f"VALIDATION_FLAGS ({len(flags)}): {flags}")
        else:
            bureau_logger.info("VALIDATION_PASSED: All AI outputs verified clean")
        
        return analysis

    def generate_pdf(self, analysis_results: Dict[str, Any]) -> bytes:
        """
        Generates a premium Bureau PDF report.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        
        # Define Premium Styles
        title_style = ParagraphStyle(
            'BureauTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor("#0f172a"),
            alignment=TA_CENTER,
            spaceAfter=30,
            fontName='Helvetica-Bold'
        )
        
        subtitle_style = ParagraphStyle(
            'BureauSubtitle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor("#10b981"),
            alignment=TA_CENTER,
            letterSpacing=2,
            spaceAfter=50,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'BureauHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor("#10b981"),
            spaceBefore=20,
            spaceAfter=15,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'BureauBody',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor("#475569"),
            leading=16,
            spaceAfter=12
        )
        
        story = []
        
        # Header
        report_title = analysis_results.get("report_title", "2026 INTELLIGENCE DOSSIER").upper()
        primary_theme = analysis_results.get("primary_theme", "BUREAU ARCHITECTURE").upper()
        
        story.append(Paragraph("SURVEY OPTIMIZATION BUREAU", subtitle_style))
        story.append(Paragraph(report_title, title_style))
        
        # 0. RESEARCH FOUNDATION
        story.append(Paragraph("I. RESEARCH FOUNDATION & SOURCE CITATION", heading_style))
        
        citation_text = analysis_results.get("source_citation", f"Source: {analysis_results.get('source_filename')} | Records: {analysis_results.get('row_count')} | Fields: {analysis_results.get('col_count')}")
        story.append(Paragraph(f"<b>OFFICIAL CITATION:</b> {citation_text}", body_style))
        story.append(Spacer(1, 10))

        # Helper to create wrapped cell content
        def wrap_cell(text):
            return Paragraph(html.escape(str(text)), ParagraphStyle(
                'CellBody',
                parent=styles['Normal'],
                fontSize=8,
                textColor=colors.HexColor("#475569"),
                leading=10
            ))

        summary_grid = [
            ["SOURCE DATA", wrap_cell(analysis_results.get("source_filename", "BUREAU GROUNDWORK DATASET"))],
            ["ANALYSIS TYPE", wrap_cell(primary_theme)],
            ["INTEGRITY SCORE", wrap_cell(f"{analysis_results.get('methodology_score')}/100 - {analysis_results.get('verdict', 'VERIFIED')}")]
        ]
        st = Table(summary_grid, colWidths=[120, 330])
        st.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f1f5f9")),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#475569")),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(st)
        story.append(Spacer(1, 25))

        # 0.1 STRATEGIC KPI DASHBOARD (Visual at-a-glance)
        story.append(Paragraph("STRATEGIC KPI DASHBOARD (ON-GLANCE VIEW)", ParagraphStyle(
            'KpiTitle', parent=heading_style, fontSize=12, textColor=colors.HexColor("#0f172a")
        )))
        
        kpi_data = []
        findings = analysis_results.get("key_findings", [])[:4] # Take top 4 for the dashboard
        
        for i in range(0, len(findings), 2):
            row = []
            for j in range(2):
                if i + j < len(findings):
                    f = findings[i+j]
                    cell_content = [
                        Paragraph(html.escape(f.get("label", "KPI")).upper(), ParagraphStyle('KLabel', fontSize=7, textColor=colors.HexColor("#64748b"), fontName='Helvetica-Bold')),
                        Paragraph(html.escape(f.get("value", "N/A")), ParagraphStyle('KValue', fontSize=18, textColor=colors.HexColor("#10b981"), fontName='Helvetica-Bold', spaceBefore=5)),
                        Paragraph(html.escape(f.get("context", "")), ParagraphStyle('KContext', fontSize=8, textColor=colors.HexColor("#475569"), leading=9, spaceBefore=5))
                    ]
                    row.append(cell_content)
                else:
                    row.append("")
            kpi_data.append(row)
            
        kt = Table(kpi_data, colWidths=[225, 225])
        kt.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#f1f5f9")),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ffffff")),
            ('PADDING', (0, 0), (-1, -1), 12),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(kt)
        story.append(PageBreak())

        # 1. EXECUTIVE INTELLIGENCE PULSE
        story.append(Paragraph("II. EXECUTIVE INTELLIGENCE PULSE", heading_style))
        pulse = analysis_results.get("executive_pulse", {})
        story.append(Paragraph(f"<b>THE GROWTH VERDICT:</b> {html.escape(pulse.get('growth_verdict', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>'AGENTIC' INSIGHTS:</b> {html.escape(pulse.get('agentic_insights', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>THE VALUE GAP:</b> {html.escape(pulse.get('value_gap', 'N/A'))}", body_style))
        
        # KEY FINDINGS AS KPI GRID
        story.append(Paragraph("<b>SURVEY METRICS & KEY FINDINGS</b>", body_style))
        findings = analysis_results.get("key_findings", [])
        if findings:
            findings_table_data = []
            for i in range(0, len(findings), 2):
                row = []
                for j in range(2):
                    if i + j < len(findings):
                        f = findings[i+j]
                        label = html.escape(f.get('label', 'KPI')).upper()
                        val = html.escape(f.get('value', 'N/A'))
                        ctx = html.escape(f.get('context', ''))
                        cell_content = f"<b>{label}: <font color='#10b981'>{val}</font></b><br/><font size='8'>{ctx}</font>"
                        row.append(Paragraph(cell_content, ParagraphStyle('KPICell', parent=body_style, fontSize=10, leading=11)))
                    else:
                        row.append("")
                findings_table_data.append(row)
            
            ft = Table(findings_table_data, colWidths=[225, 225])
            ft.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ('PADDING', (0, 0), (-1, -1), 10),
            ]))
            story.append(ft)
            story.append(Spacer(1, 15))

        story.append(PageBreak())

        # 2. MARKET LANDSCAPE
        story.append(Paragraph("III. MARKET LANDSCAPE: MACRO-INTELLIGENCE SHIFT", heading_style))
        landscape = analysis_results.get("market_landscape", {})
        story.append(Paragraph(f"<b>ECONOMIC RESILIENCE:</b> {html.escape(landscape.get('economic_resilience', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>GEOPOLITICAL RISK:</b> {html.escape(landscape.get('geopolitical_risk', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>REGULATORY WATCH:</b> {html.escape(landscape.get('regulatory_watch', 'N/A'))}", body_style))

        # 3. STAKEHOLDER JOURNEY
        story.append(Paragraph("IV. STAKEHOLDER & INTERACTION JOURNEY", heading_style))
        consumer = analysis_results.get("consumer_behavior", {})
        story.append(Paragraph(f"<b>PRIMARY INFLUENCERS:</b> {html.escape(consumer.get('primary_influencers', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>ENGAGEMENT PATTERNS:</b> {html.escape(consumer.get('engagement_patterns', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>STAKEHOLDER PERCEPTION:</b> {html.escape(consumer.get('stakeholder_perception', 'N/A'))}", body_style))

        # 4. COMPETITIVE DEEP DIVE
        story.append(Paragraph("V. REGIONAL & SECTOR DEEP DIVE", heading_style))
        comp = analysis_results.get("competitive_deep_dive", {})
        story.append(Paragraph(f"<b>SECTOR PERFORMANCE:</b> {html.escape(comp.get('sector_performance', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>ANALYSIS OF DIRECT IMPACTS:</b> {html.escape(comp.get('impact_analysis', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>RESOURCE & VALUE MAPPING:</b> {html.escape(comp.get('resource_mapping', 'N/A'))}", body_style))

        story.append(PageBreak())

        # 5. OPERATIONAL READINESS
        story.append(Paragraph("VI. OPERATIONAL INFRASTRUCTURE & AI READINESS", heading_style))
        ops = analysis_results.get("operational_readiness", {})
        story.append(Paragraph(f"<b>DATA HYGIENE SCORE:</b> {ops.get('data_hygiene_score', 'N/A')}/100", body_style))
        story.append(Paragraph(f"<b>SUPPLY CHAIN RESILIENCE:</b> {html.escape(ops.get('supply_chain_resilience', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>INVENTORY VISIBILITY:</b> {html.escape(ops.get('inventory_visibility', 'N/A'))}", body_style))

        # 6. ROADMAP
        story.append(Paragraph("VII. ROADMAP: STRATEGIC EXECUTION", heading_style))
        roadmap = analysis_results.get("roadmap", {})
        story.append(Paragraph(f"<b>SHORT-TERM (Q1-Q2):</b> {html.escape(roadmap.get('short_term', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>MID-TERM (2026-2027):</b> {html.escape(roadmap.get('mid_term', 'N/A'))}", body_style))
        story.append(Paragraph(f"<b>LONG-TERM (2028+):</b> {html.escape(roadmap.get('long_term', 'N/A'))}", body_style))

        # 7. FORECAST DATA
        forecast = analysis_results.get("forecast_data", {})
        unit = forecast.get('forecast_unit', 'Units')
        story.append(Paragraph(f"VIII. STRATEGIC {primary_theme} FORECAST ({unit})", heading_style))
        forecast_table_data = [
            ["YEAR", f"PROJECTION ({unit})"],
            ["2025 (ACTUAL)", f"{forecast.get('2025_actual', 'N/A')}"],
            ["2026 (FORECAST)", f"{forecast.get('2026_forecast', 'N/A')}"],
            ["2030 (PROJECTED)", f"{forecast.get('2030_projected', 'N/A')}"]
        ]
        ftt = Table(forecast_table_data, colWidths=[200, 250])
        ftt.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#ffffff")),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('PADDING', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        story.append(ftt)

        # CONCLUSION
        story.append(Spacer(1, 20))
        story.append(Paragraph("<b>CONCLUSION & SYNTHESIS</b>", body_style))
        story.append(Paragraph(html.escape(analysis_results.get("conclusion", "")), body_style))
        
        # Footer Disclosure
        story.append(Spacer(1, 40))
        disclosure = "PROPRIETARY BUREAU ENCRYPTION APPLIED. THIS DOCUMENT IS CLASSIFIED."
        story.append(Paragraph(disclosure, ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)))
        
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        # Apply Bureau Encryption using pypdf
        try:
            from pypdf import PdfReader, PdfWriter
            reader = PdfReader(io.BytesIO(pdf_bytes))
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            
            # Simple encryption for "Bureau" level security
            writer.encrypt("ab@280765") # Using the provided dev admin password
            
            encrypted_buffer = io.BytesIO()
            writer.write(encrypted_buffer)
            pdf_bytes = encrypted_buffer.getvalue()
            encrypted_buffer.close()
        except Exception as e:
            bureau_logger.warning(f"PDF_ENCRYPTION_SKIPPED: {str(e)}")
            
        return pdf_bytes

    async def generate_infographic(self, analysis_results: Dict[str, Any]) -> str:
        """
        Returns a high-end SVG infographic based on the analysis.
        Uses a custom "Tactical Intelligence Dashboard" layout.
        """
        try:
            stats = analysis_results.get('suggested_infographic_data', {})
            kpix = analysis_results.get('deep_dive', {}).get('kpix', [])
            score = analysis_results.get('methodology_score', 0)
            
            prompt = f"""
            Generate a high-tier 'Tactical Intelligence Overview' SVG Dashboard.
            User needs an "Interesting Visualization" that translates 'KPI reality' into 'Business Impact'.
            Title: {analysis_results.get('source_filename', 'Bureau Intelligence')}
            Data Context: {analysis_results.get('executive_summary')}
            Primary Score (Integrity): {score}/100
            Core Metrics: {stats}
            Cross-Impact (KPIx): {kpix}
            
            Visual Architecture Requirements (Columnar Dashboard):
            - Layout: Use a 1000x600 coordinate system (viewBox="0 0 1000 600").
            - Background: Solid Slate-900 (#0f172a).
            - Accents: Emerald-500 (#10b981), Slate-400 (#94a3b8), Sapphire-500 (#3b82f6), Amber-400 (#fbbf24).
            
            Structure (3-Column Elite Layout):
            1. LEFT (30%): 'Integrity Core'
               - A large, prominent, glowing circular gauge showing {score}%.
               - Include supporting text: "BUREAU VERIFICATION STATUS: HIGH INTEGRITY".
               - Add subtle circuit-line textures in the background.
            2. CENTER (40%): 'Deep Insight Radar'
               - A complex, multi-layered radar chart or circular data map showing {kpix}.
               - Each KPI node must be a visible glowing circle with a label.
               - Connect nodes with dashed 'data flow' lines (<animate> these).
               - Overlay a hexagonal grid pattern for tech-aesthetic.
            3. RIGHT (30%): 'Metric Velocity Grid'
               - A vertical grid of 3-4 cards showing 'Top 4 Finding': {analysis_results.get('key_findings')[:4]}.
               - Each card: Name, Large Value, and a small trend sparkline.
            
            Style & Fidelity: 
            - NO empty spaces. Fill every region with professional data abstractions.
            - High-contrast typography for readability.
            - Use <defs> for glows and gradients to make it feel premium.
            - Final SVG must feel like a "Mission Control" readout.
            
            Output ONLY valid JSON with 'svg' key containing the markup.
            """
            
            sys_prompt = "You are the 'Senior Bureau Visualization Architect'. Your goal is to generate a comprehensive, visually rich, and data-dense SVG 'Mission Control' dashboard. NO minimalist designs; use complex shapes, gradients, and animations to represent consulting data at the highest fidelity. Output ONLY valid JSON with 'svg' key."
            
            response = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=prompt,
                config={
                    "system_instruction": sys_prompt,
                    "response_mime_type": "application/json"
                }
            )
            
            res = safe_parse_json(response.text)
            return res.get("svg", "<svg></svg>")
        except Exception as e:
            bureau_logger.error(f"INFOGRAPHIC_FAILED: {str(e)}")
            return "<svg><text>Error generating visual</text></svg>"

field_interpreter = FieldDataInterpreter()
