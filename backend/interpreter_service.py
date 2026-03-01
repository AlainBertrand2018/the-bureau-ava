"""
AVA Field Data Interpreter v2.0
===============================
Industry-standard survey analysis pipeline (Kantar/McKinsey/Qualtrics grade).
5-Phase Intelligent Grid: Clean at Source → Intelligent Cell → Intelligent Row → Intelligent Column → Intelligent Grid.
"""

import pandas as pd
import json
import os
import base64
import datetime
import io
import re
import html
from typing import Dict, Any, List, Optional, AsyncGenerator
from logger import bureau_logger
from ai_utils import generate_with_retry, safe_parse_json
from config import settings
from google import genai


class FieldDataInterpreter:
    """
    AVA Field Data Interpreter v2.0.
    Converts raw CSV survey data into Kantar/McKinsey-grade intelligence dossiers
    via a 5-phase Intelligent Grid pipeline.
    """

    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model = settings.DEFAULT_MODEL

    # ══════════════════════════════════════════════════════════════════
    # PUBLIC API: Streaming Analysis
    # ══════════════════════════════════════════════════════════════════

    async def analyze_csv_stream(self, csv_content: str, mission_context: str = "", filename: str = "Bureau Groundwork Dataset", research_meta: Dict = None) -> AsyncGenerator[str, None]:
        """
        Main entry point. Async generator yielding NDJSON events per phase.
        Event types: phase_start, phase_complete, report, error
        """
        total_tokens_in = 0
        total_tokens_out = 0
        chain_of_thought = []

        try:
            # ── PHASE 0: LOCAL INGESTION ──
            yield self._event("phase_start", "ingestion", {"message": "Parsing and structuring raw data..."})

            df = self._parse_csv(csv_content)
            row_count = len(df)
            col_count = len(df.columns)
            columns = list(df.columns)

            if row_count == 0:
                yield self._event("error", "ingestion", {"message": "CSV contains no data rows."})
                return

            # Sanitize object columns
            for col in df.select_dtypes(include=['object']).columns:
                df[col] = df[col].apply(lambda x: str(x) if x is not None else "")

            # Build data context for agents
            stats_json = df.describe(include='all').to_json()
            sample_head = df.head(15).to_json()
            sample_tail = df.tail(5).to_json()
            null_counts = df.isnull().sum().to_dict()
            unique_counts = {col: int(df[col].nunique()) for col in columns}
            dtypes = {col: str(df[col].dtype) for col in columns}

            data_context = {
                "filename": filename,
                "row_count": row_count,
                "col_count": col_count,
                "columns": columns,
                "dtypes": dtypes,
                "null_counts": null_counts,
                "unique_counts": unique_counts,
                "stats": stats_json,
                "sample_head": sample_head,
                "sample_tail": sample_tail,
            }

            yield self._event("phase_complete", "ingestion", {
                "message": f"Ingested {row_count} records across {col_count} fields.",
                "row_count": row_count,
                "col_count": col_count,
                "columns": columns
            })
            chain_of_thought.append({"agent": "Ingestion", "status": "COMPLETED", "output": f"{row_count} rows, {col_count} fields parsed"})

            bureau_logger.info(f"PIPELINE_START: {row_count} rows | {col_count} cols | {filename}")

            # ── PHASE 1: CLEAN AT SOURCE (Discoverer) ──
            yield self._event("phase_start", "discoverer", {"message": "Identifying data DNA and structural classification..."})

            discovery_data, tokens = await self._phase_discoverer(data_context)
            total_tokens_in += tokens[0]
            total_tokens_out += tokens[1]

            chain_of_thought.append({"agent": "Discoverer", "status": "COMPLETED", "output": discovery_data.get("subject", "Subject identified")})
            yield self._event("phase_complete", "discoverer", {
                "message": discovery_data.get("subject", "Data DNA extracted"),
                "subject": discovery_data.get("subject"),
                "scoring_standard": discovery_data.get("scoring_standard"),
                "report_title": discovery_data.get("report_title"),
            })

            # ── PHASE 2: INTELLIGENT CELL (Contextualizer) ──
            yield self._event("phase_start", "contextualizer", {"message": "Enriching cells with sentiment, themes, and benchmarks..."})

            context_data, tokens = await self._phase_contextualizer(data_context, discovery_data, mission_context)
            total_tokens_in += tokens[0]
            total_tokens_out += tokens[1]

            chain_of_thought.append({"agent": "Contextualizer", "status": "COMPLETED", "output": "Benchmarks and thematic context established"})
            yield self._event("phase_complete", "contextualizer", {
                "message": "Industry benchmarks, sentiment themes, and cohort context established.",
            })

            # ── PHASE 3: INTELLIGENT ROW (Challenger) ──
            yield self._event("phase_start", "challenger", {"message": "Cross-tabulating respondent journeys and regression modelling..."})

            analysis_data, tokens = await self._phase_challenger(data_context, discovery_data, context_data)
            total_tokens_in += tokens[0]
            total_tokens_out += tokens[1]

            findings_count = len(analysis_data.get("key_findings", []))
            chain_of_thought.append({"agent": "Challenger", "status": "COMPLETED", "output": f"{findings_count} key findings synthesized"})
            yield self._event("phase_complete", "challenger", {
                "message": f"{findings_count} key findings with cross-tabulation and regression analysis complete.",
                "findings_count": findings_count,
            })

            # ── PHASE 4: INTELLIGENT COLUMN (Sentinel) ──
            yield self._event("phase_start", "sentinel", {"message": "Validating findings against raw data and checking for hallucinations..."})

            validation_data, tokens = await self._phase_sentinel(data_context, analysis_data, context_data)
            total_tokens_in += tokens[0]
            total_tokens_out += tokens[1]

            integrity_score = validation_data.get("integrity_score", 0)
            chain_of_thought.append({"agent": "Sentinel", "status": "COMPLETED", "output": f"Integrity: {integrity_score}% — {validation_data.get('verdict', 'N/A')}"})
            yield self._event("phase_complete", "sentinel", {
                "message": f"Integrity Score: {integrity_score}/100 — Verdict: {validation_data.get('verdict', 'PENDING')}",
                "integrity_score": integrity_score,
                "verdict": validation_data.get("verdict"),
            })

            # ── PHASE 5: INTELLIGENT GRID (AVA) ──
            yield self._event("phase_start", "ava", {"message": "Final arbitration and consultant-grade report composition..."})

            arbiter_data, tokens = await self._phase_ava(chain_of_thought, analysis_data, validation_data, discovery_data)
            total_tokens_in += tokens[0]
            total_tokens_out += tokens[1]

            chain_of_thought.append({"agent": "AVA", "status": "COMPLETED", "output": f"Action: {arbiter_data.get('action', 'PUBLISH')} | Grade: {arbiter_data.get('report_grade', 'A')}"})
            yield self._event("phase_complete", "ava", {
                "message": f"Report Grade: {arbiter_data.get('report_grade', 'A')} — Action: {arbiter_data.get('action', 'PUBLISH')}",
                "action": arbiter_data.get("action"),
                "report_grade": arbiter_data.get("report_grade"),
            })

            # ── FINAL ASSEMBLY ──
            final_report = self._assemble_report(
                discovery_data, context_data, analysis_data, validation_data, arbiter_data,
                chain_of_thought, filename, row_count, col_count, total_tokens_in, total_tokens_out,
                research_meta=research_meta
            )

            # Generate outputs
            report_html = self.generate_report_html(final_report)
            pdf_base64 = base64.b64encode(report_html.encode('utf-8')).decode('utf-8')

            bureau_logger.info(f"PIPELINE_COMPLETE: Grade={arbiter_data.get('report_grade', 'N/A')} | Score={integrity_score}")

            yield self._event("report", "complete", {
                "analysis": final_report,
                "pdf_base64": pdf_base64,
                "tokens_in": total_tokens_in,
                "tokens_out": total_tokens_out,
            })

        except Exception as e:
            err_msg = str(e)
            bureau_logger.error(f"PIPELINE_FAILED: {err_msg}")
            yield self._event("error", "pipeline", {
                "message": err_msg,
                "is_quota": "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg
            })

    # ══════════════════════════════════════════════════════════════════
    # PHASE IMPLEMENTATIONS
    # ══════════════════════════════════════════════════════════════════

    async def _phase_discoverer(self, data_ctx: Dict) -> tuple:
        """Phase 1: Clean at Source — Data DNA & Structural Audit."""
        prompt = f"""
AGENT ROLE: THE DISCOVERER (Phase 1 — Clean at Source)
STANDARD: Kantar/Qualtrics Survey Analysis Protocol

TASK: Perform a structural audit of this dataset. Classify every column and identify the survey's DNA.

DATA PARAMETERS:
- Filename: {data_ctx['filename']}
- Records: {data_ctx['row_count']} rows, {data_ctx['col_count']} columns
- Columns: {json.dumps(data_ctx['columns'])}
- Data Types: {json.dumps(data_ctx['dtypes'])}
- Null Counts: {json.dumps(data_ctx['null_counts'])}
- Unique Values Per Column: {json.dumps(data_ctx['unique_counts'])}

SAMPLE DATA (first 15 rows):
{data_ctx['sample_head']}

STATISTICAL SUMMARY:
{data_ctx['stats']}

OUTPUT (strict JSON):
{{
    "subject": "Clear 1-sentence statement of what this survey measures",
    "target_market": "Geography / Demographic / Sector identified from the data",
    "primary_theme": "High-level industry category (e.g., Financial Services, Healthcare, Retail, Education)",
    "report_title": "Professional consultant-grade title for the intelligence report",
    "age_cohorts_identified": ["List of age groups or generational cohorts found in the data"],
    "scoring_standard": "Detected scoring methodology: NPS / CSAT / CES / Likert-5 / Likert-7 / Custom / Mixed",
    "column_classification": {{
        "column_name": "demographic | likert_scale | open_ended | multiple_choice | numeric | timestamp | identifier | weight"
    }},
    "data_quality_notes": "Assessment of data completeness, null rates, and structural issues",
    "respondent_segments": ["Identified respondent segments or subgroups"]
}}
"""
        return await self._call_agent_with_tokens(prompt, "Discoverer")

    async def _phase_contextualizer(self, data_ctx: Dict, discovery: Dict, mission_context: str) -> tuple:
        """Phase 2: Intelligent Cell — Per-cell enrichment, benchmarks, sentiment themes."""
        prompt = f"""
AGENT ROLE: THE CONTEXTUALIZER (Phase 2 — Intelligent Cell)
STANDARD: McKinsey Benchmarking & Qualtrics XM Protocol

TASK: Enrich the analysis with industry benchmarks, thematic coding for qualitative responses,
and cohort-specific context. This is the "intelligent cell" where every data point gets meaning.

CRITICAL INSTRUCTION: If EXISTING BENCHMARKS (GROUND TRUTH) are provided in the MISSION CONTEXT,
YOU MUST use those specific values (demographics, economic indicators, socio-metrics) as your
primary vetting standard. Comparison against these benchmarks is mandatory.

DISCOVERY DATA:
{json.dumps(discovery, indent=2)}

MISSION CONTEXT:
{mission_context or 'No specific mission context provided.'}

RAW DATA SUMMARY:
{data_ctx['stats']}

SAMPLE DATA:
{data_ctx['sample_head']}

OUTPUT (strict JSON):
{{
    "industry_benchmarks": {{
        "benchmark_name": "value with source",
        "global_average": "relevant global average for the scoring standard",
        "sector_average": "sector-specific benchmark"
    }},
    "market_realities": "2025/2026 market conditions relevant to this survey's subject and target market",
    "thematic_codes": [
        {{"theme": "Theme Name", "description": "What this theme captures", "sentiment": "positive/negative/neutral"}}
    ],
    "cohort_context": {{
        "cohort_name": "Behavioral and socio-economic context specific to this cohort"
    }},
    "sentiment_framework": "How sentiment should be interpreted for this specific survey type",
    "weighting_notes": "Whether sample weights are needed and why",
    "scoring_interpretation": {{
        "scale": "The scoring scale detected",
        "excellent_threshold": "Score range considered excellent",
        "poor_threshold": "Score range considered poor",
        "benchmark_comparison": "How this survey's scores compare to benchmarks"
    }}
}}
"""
        return await self._call_agent_with_tokens(prompt, "Contextualizer")

    async def _phase_challenger(self, data_ctx: Dict, discovery: Dict, context: Dict) -> tuple:
        """Phase 3: Intelligent Row — Respondent journey analysis, cross-tab, regression."""
        prompt = f"""
AGENT ROLE: THE CHALLENGER (Phase 3 — Intelligent Row)
STANDARD: Full Kantar/McKinsey analytical methodology

TASK: Perform the CORE ANALYSIS. Cross-tabulate subgroups, identify statistical relationships,
summarize respondent journeys, and produce key findings with evidence-impact-recommendation format.

DATA CONTEXT:
- Rows: {data_ctx['row_count']}, Columns: {data_ctx['col_count']}
- Column Classification: {json.dumps(discovery.get('column_classification', {}))}
- Scoring Standard: {discovery.get('scoring_standard', 'Unknown')}
- Respondent Segments: {json.dumps(discovery.get('respondent_segments', []))}

STATISTICAL SUMMARY:
{data_ctx['stats']}

SAMPLE DATA:
{data_ctx['sample_head']}

INDUSTRY BENCHMARKS:
{json.dumps(context.get('industry_benchmarks', {}), indent=2)}

THEMATIC CODES:
{json.dumps(context.get('thematic_codes', []), indent=2)}

INSTRUCTIONS:
- Produce an executive summary suitable for a C-suite presentation
- Each key finding MUST include: the finding, supporting evidence from the data, business impact, and a recommendation
- Cross-tabulate at least 3 subgroup comparisons (e.g., age × satisfaction, gender × loyalty)
- Identify regression-style insights (which variables drive key outcomes)
- Analyze sentiment from open-ended responses if present
- Flag any statistical risks (low sample sizes, response bias, outliers)

OUTPUT (strict JSON):
{{
    "executive_summary": "2-3 paragraph C-suite briefing summarizing the most critical findings and their strategic implications",
    "key_findings": [
        {{
            "finding": "Clear statement of the finding",
            "evidence": "Specific data points or statistics supporting this",
            "impact": "Business impact or strategic implication",
            "recommendation": "Actionable next step",
            "priority": "HIGH / MEDIUM / LOW"
        }}
    ],
    "cross_tabulations": [
        {{
            "variables": "Variable A × Variable B",
            "insight": "What the cross-tabulation reveals",
            "significance": "Statistical or practical significance"
        }}
    ],
    "respondent_profile": {{
        "total_respondents": {data_ctx['row_count']},
        "segments": {json.dumps(discovery.get('respondent_segments', []))},
        "demographic_breakdown": "Summary of demographic distribution across segments",
        "completion_rate": "Estimated completion rate and data quality"
    }},
    "sentiment_analysis": {{
        "overall_sentiment": "positive / negative / mixed / neutral",
        "sentiment_distribution": "Approximate % breakdown",
        "top_positive_themes": ["Theme driving positive sentiment"],
        "top_negative_themes": ["Theme driving negative sentiment"],
        "by_segment": {{"segment": "sentiment summary"}}
    }},
    "statistical_deep_dive": {{
        "descriptive_statistics": "Key means, medians, standard deviations for core metrics",
        "regression_insights": [
            {{
                "predictor": "Variable name",
                "outcome": "What it predicts",
                "relationship": "Direction and strength description",
                "interpretation": "What this means for decision-making"
            }}
        ],
        "outlier_analysis": "Notable outliers or anomalies in the data"
    }},
    "strategic_recommendations": {{
        "short_term": ["Immediate actions (0-3 months)"],
        "mid_term": ["Medium-term initiatives (3-12 months)"],
        "long_term": ["Long-term strategic shifts (12+ months)"]
    }},
    "risk_flags": [
        {{
            "flag": "Description of the risk or limitation",
            "severity": "HIGH / MEDIUM / LOW",
            "mitigation": "How to address it"
        }}
    ]
}}
"""
        return await self._call_agent_with_tokens(prompt, "Challenger")

    async def _phase_sentinel(self, data_ctx: Dict, analysis: Dict, context: Dict) -> tuple:
        """Phase 4: Intelligent Column — Statistical validation and quant↔qual fusion."""
        prompt = f"""
AGENT ROLE: THE SENTINEL (Phase 4 — Intelligent Column)
STANDARD: Statistical Validation & Quant↔Qual Correlation Protocol

TASK: You are the statistical integrity gate. Verify EVERY finding from the Challenger against
the raw data statistics AND industry benchmarks. Catch hallucinated percentages, invented correlations,
or claims unsupported by the ground truth or sample size.

RAW DATA STATISTICS (ground truth):
- Rows: {data_ctx['row_count']}, Columns: {data_ctx['col_count']}
{data_ctx['stats']}

INDUSTRY BENCHMARKS & CONTEXT (ground truth):
{json.dumps(context.get('industry_benchmarks', {}), indent=2)}
{context.get('market_realities', 'N/A')}

ANALYSIS TO VALIDATE:
{json.dumps(analysis, indent=2)}

VALIDATION RULES:
1. Percentages MUST sum correctly (≤ 100% for distributions)
2. Claims about "significant" trends MUST be plausible given the sample size ({data_ctx['row_count']} rows)
3. Comparisons to benchmarks MUST be accurate based on the provided ground truth context above
4. Cross-tabulation claims MUST reference variables that actually exist in the data
5. Sentiment claims MUST be grounded in the actual thematic content
6. Regression claims MUST be plausible given the variable types and distributions

OUTPUT (strict JSON):
{{
    "integrity_score": 0-100,
    "verdict": "VERIFIED | FLAGGED",
    "verified_findings": [
        {{
            "finding_index": 0,
            "finding_summary": "Brief summary of the finding",
            "verdict": "CONFIRMED | ADJUSTED | FLAGGED",
            "reason": "Why this verdict was given"
        }}
    ],
    "corrections": [
        {{
            "original": "The original claim",
            "corrected": "The corrected version",
            "reason": "Why the correction was needed"
        }}
    ],
    "quant_qual_correlations": [
        {{
            "quantitative_metric": "The numeric variable",
            "qualitative_theme": "The thematic finding it correlates with",
            "correlation_insight": "How they relate"
        }}
    ],
    "validation_report": "2-3 sentence summary of overall data integrity and analytical quality",
    "confidence_level": "HIGH / MEDIUM / LOW — based on sample size, data quality, and analytical rigour"
}}
"""
        return await self._call_agent_with_tokens(prompt, "Sentinel")

    async def _phase_ava(self, chain: List, analysis: Dict, validation: Dict, discovery: Dict) -> tuple:
        """Phase 5: Intelligent Grid — Final arbiter and report composer."""
        prompt = f"""
AGENT ROLE: AVA — THE ARBITER (Phase 5 — Intelligent Grid)
STANDARD: Executive Decision Protocol

TASK: You are the final quality gate. Review the entire pipeline, make a PUBLISH or RECOUNT
decision, assign a report grade, and write the precision audit statement.

FULL PIPELINE CHAIN OF THOUGHT:
{json.dumps(chain, indent=2)}

SENTINEL VERDICT:
{validation.get('verdict', 'N/A')} — Integrity Score: {validation.get('integrity_score', 0)}/100
{validation.get('validation_report', 'No report available.')}

CORRECTIONS APPLIED:
{json.dumps(validation.get('corrections', []), indent=2)}

CONFIDENCE LEVEL: {validation.get('confidence_level', 'MEDIUM')}

REPORT TITLE: {discovery.get('report_title', 'Bureau Intelligence Report')}

OUTPUT (strict JSON):
{{
    "action": "PUBLISH | RECOUNT",
    "report_grade": "A+ | A | A- | B+ | B | B- | C",
    "precision_audit": "3-5 sentence executive audit statement summarizing data quality, analytical rigour, and confidence in findings",
    "executive_addendum": "Any additional context AVA wants to add to the executive summary",
    "final_approval": true
}}
"""
        return await self._call_agent_with_tokens(prompt, "AVA")

    # ══════════════════════════════════════════════════════════════════
    # REPORT ASSEMBLY & HTML GENERATION
    # ══════════════════════════════════════════════════════════════════

    def _assemble_report(self, discovery, context, analysis, validation, arbiter,
                         chain, filename, rows, cols, tokens_in, tokens_out, research_meta=None) -> Dict:
        """Assembles the final report object from all pipeline outputs."""
        report = {
            # Identity
            "report_title": research_meta.get("survey_title") if research_meta and research_meta.get("survey_title") else discovery.get("report_title", "Bureau Intelligence Report"),
            "research_meta": research_meta,
            "primary_theme": discovery.get("primary_theme", "General Analysis"),
            "subject": discovery.get("subject", ""),
            "target_market": discovery.get("target_market", ""),
            "scoring_standard": discovery.get("scoring_standard", ""),
            "age_cohorts_identified": discovery.get("age_cohorts_identified", []),
            "respondent_segments": discovery.get("respondent_segments", []),
            "column_classification": discovery.get("column_classification", {}),
            "data_quality_notes": discovery.get("data_quality_notes", ""),

            # Context
            "industry_benchmarks": context.get("industry_benchmarks", {}),
            "market_realities": context.get("market_realities", ""),
            "thematic_codes": context.get("thematic_codes", []),
            "cohort_context": context.get("cohort_context", {}),
            "scoring_interpretation": context.get("scoring_interpretation", {}),

            # Core Analysis
            "executive_summary": analysis.get("executive_summary", ""),
            "key_findings": analysis.get("key_findings", []),
            "cross_tabulations": analysis.get("cross_tabulations", []),
            "respondent_profile": analysis.get("respondent_profile", {}),
            "sentiment_analysis": analysis.get("sentiment_analysis", {}),
            "statistical_deep_dive": analysis.get("statistical_deep_dive", {}),
            "strategic_recommendations": analysis.get("strategic_recommendations", {}),
            "risk_flags": analysis.get("risk_flags", []),

            # Validation
            "integrity_score": validation.get("integrity_score", 0),
            "verdict": validation.get("verdict", "PENDING"),
            "validation_report": validation.get("validation_report", ""),
            "confidence_level": validation.get("confidence_level", "MEDIUM"),
            "corrections": validation.get("corrections", []),
            "quant_qual_correlations": validation.get("quant_qual_correlations", []),

            # Arbiter
            "report_grade": arbiter.get("report_grade", "B"),
            "precision_audit": arbiter.get("precision_audit", ""),
            "executive_addendum": arbiter.get("executive_addendum", ""),

            # Metadata
            "source_filename": filename,
            "row_count": rows,
            "col_count": cols,
            "chain_of_thought": chain,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
        }
        return report

    def generate_report_html(self, report: Dict) -> str:
        """Generates a consultant-grade HTML dossier in the Bureau report_generator.py pattern."""
        timestamp = report.get("timestamp", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        doc_id = f"FDI-{abs(hash(timestamp)) % 100000000:08d}"
        title = html.escape(report.get("report_title", "Bureau Intelligence Report"))
        theme = html.escape(report.get("primary_theme", "Survey Analysis"))
        exec_summary = html.escape(report.get("executive_summary", ""))
        precision_audit = html.escape(report.get("precision_audit", ""))
        addendum = html.escape(report.get("executive_addendum", ""))

        # Build findings rows
        findings_html = ""
        for i, f in enumerate(report.get("key_findings", [])):
            if isinstance(f, dict):
                priority_colors = {"HIGH": "#ef4444", "MEDIUM": "#f59e0b", "LOW": "#10b981"}
                p = f.get("priority", "MEDIUM")
                color = priority_colors.get(p, "#64748b")
                findings_html += f"""
                <tr>
                    <td class="find-num" style="color: {color};">{i+1:02d}</td>
                    <td class="find-body">
                        <div class="find-title">{html.escape(str(f.get('finding', '')))}</div>
                        <div class="find-row"><strong>EVIDENCE:</strong> {html.escape(str(f.get('evidence', '')))}</div>
                        <div class="find-row"><strong>IMPACT:</strong> {html.escape(str(f.get('impact', '')))}</div>
                        <div class="find-row"><strong>RECOMMENDATION:</strong> {html.escape(str(f.get('recommendation', '')))}</div>
                        <span class="priority-badge" style="background: {color}20; color: {color}; border: 1px solid {color}40;">{p}</span>
                    </td>
                </tr>"""

        # Build cross-tabulation section
        crosstab_html = ""
        for ct in report.get("cross_tabulations", []):
            if isinstance(ct, dict):
                crosstab_html += f"""
                <div class="crosstab-card">
                    <strong>{html.escape(str(ct.get('variables', '')))}</strong>
                    <p>{html.escape(str(ct.get('insight', '')))}</p>
                    <span class="sig-badge">{html.escape(str(ct.get('significance', '')))}</span>
                </div>"""

        # Build recommendations
        recs = report.get("strategic_recommendations", {})
        recs_html = ""
        for period, label, color in [("short_term", "SHORT-TERM (0-3 Months)", "#10b981"), ("mid_term", "MID-TERM (3-12 Months)", "#3b82f6"), ("long_term", "LONG-TERM (12+ Months)", "#8b5cf6")]:
            items = recs.get(period, [])
            if isinstance(items, list):
                items_html = "".join([f"<li>{html.escape(str(item))}</li>" for item in items])
            else:
                items_html = f"<li>{html.escape(str(items))}</li>"
            recs_html += f"""
            <div class="rec-card" style="border-left: 4px solid {color};">
                <span class="rec-label" style="color: {color};">{label}</span>
                <ul>{items_html}</ul>
            </div>"""

        # Build risk flags
        risk_html = ""
        for rf in report.get("risk_flags", []):
            if isinstance(rf, dict):
                sev = rf.get("severity", "LOW")
                sev_color = {"HIGH": "#ef4444", "MEDIUM": "#f59e0b", "LOW": "#10b981"}.get(sev, "#64748b")
                risk_html += f"""
                <div class="risk-item">
                    <div class="risk-header">
                        <span class="risk-badge" style="background: {sev_color}20; color: {sev_color};">{sev}</span>
                        <span class="risk-flag">{html.escape(str(rf.get('flag', '')))}</span>
                    </div>
                    <p class="risk-mitigation">Mitigation: {html.escape(str(rf.get('mitigation', '')))}</p>
                </div>"""

        # Sentiment
        sentiment = report.get("sentiment_analysis", {})
        sentiment_html = ""
        if sentiment:
            pos_themes = ", ".join(sentiment.get("top_positive_themes", [])) or "N/A"
            neg_themes = ", ".join(sentiment.get("top_negative_themes", [])) or "N/A"
            sentiment_html = f"""
            <div class="sentiment-grid">
                <div class="sentiment-card">
                    <label>Overall Sentiment</label>
                    <div class="value">{html.escape(str(sentiment.get('overall_sentiment', 'N/A')).upper())}</div>
                </div>
                <div class="sentiment-card">
                    <label>Distribution</label>
                    <div class="value small">{html.escape(str(sentiment.get('sentiment_distribution', 'N/A')))}</div>
                </div>
                <div class="sentiment-card positive">
                    <label>Top Positive Themes</label>
                    <div class="value small">{html.escape(pos_themes)}</div>
                </div>
                <div class="sentiment-card negative">
                    <label>Top Negative Themes</label>
                    <div class="value small">{html.escape(neg_themes)}</div>
                </div>
            </div>"""

        # Benchmarks
        benchmarks = report.get("industry_benchmarks", {})
        bench_html = ""
        if benchmarks:
            for k, v in benchmarks.items():
                bench_html += f"""
                <div class="bench-card">
                    <label>{html.escape(str(k).replace('_', ' ').title())}</label>
                    <div class="value">{html.escape(str(v))}</div>
                </div>"""

        # Statistical deep dive
        stats_dive = report.get("statistical_deep_dive", {})
        stats_html = ""
        if stats_dive:
            desc_stats = html.escape(str(stats_dive.get("descriptive_statistics", "")))
            outliers = html.escape(str(stats_dive.get("outlier_analysis", "")))
            regression_items = ""
            for ri in stats_dive.get("regression_insights", []):
                if isinstance(ri, dict):
                    regression_items += f"""
                    <div class="regression-card">
                        <strong>{html.escape(str(ri.get('predictor', '')))} → {html.escape(str(ri.get('outcome', '')))}</strong>
                        <p>{html.escape(str(ri.get('relationship', '')))}</p>
                        <p class="interp">{html.escape(str(ri.get('interpretation', '')))}</p>
                    </div>"""
            stats_html = f"""
            <p class="body-text">{desc_stats}</p>
            {regression_items}
            <div class="outlier-box">
                <label>Outlier Analysis</label>
                <p>{outliers}</p>
            </div>"""

        doc_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — Bureau Dossier {doc_id}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; line-height: 1.7; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
        .container {{ max-width: 900px; margin: 0 auto; padding: 60px; }}

        /* Header */
        .header {{ text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 40px; margin-bottom: 48px; }}
        .header .org {{ font-size: 14px; font-weight: 900; letter-spacing: 0.35em; text-transform: uppercase; color: #10b981; margin-bottom: 12px; }}
        .header h1 {{ font-size: 36px; font-weight: 900; letter-spacing: -0.02em; color: #0f172a; margin-bottom: 8px; }}
        .header .theme {{ font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 24px; }}
        .meta-row {{ display: flex; justify-content: center; gap: 40px; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }}

        /* Grade Badge */
        .grade-card {{ display: flex; align-items: center; justify-content: center; gap: 32px; padding: 24px; margin-bottom: 48px; border: 2px solid #10b981; border-radius: 16px; background: #f0fdf4; }}
        .grade-card .grade {{ font-size: 48px; font-weight: 900; color: #10b981; }}
        .grade-card .details {{ text-align: left; }}
        .grade-card .details label {{ font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; display: block; }}
        .grade-card .details .score {{ font-size: 20px; font-weight: 800; color: #0f172a; }}

        /* Sections */
        .section {{ margin-bottom: 48px; }}
        .section h2 {{ font-size: 16px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #10b981; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }}
        .body-text {{ font-size: 15px; color: #334155; line-height: 1.8; margin-bottom: 16px; }}

        /* Findings Table */
        .findings-table {{ width: 100%; border-collapse: collapse; }}
        .findings-table tr {{ border-bottom: 1px solid #f1f5f9; }}
        .find-num {{ width: 50px; padding: 20px 12px; font-size: 20px; font-weight: 900; vertical-align: top; text-align: right; }}
        .find-body {{ padding: 20px; }}
        .find-title {{ font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }}
        .find-row {{ font-size: 13px; color: #475569; margin-bottom: 6px; line-height: 1.6; }}
        .find-row strong {{ font-size: 10px; color: #10b981; letter-spacing: 0.1em; display: block; margin-bottom: 2px; }}
        .priority-badge {{ display: inline-block; padding: 2px 10px; font-size: 9px; font-weight: 900; letter-spacing: 0.15em; border-radius: 100px; margin-top: 8px; }}

        /* Cross-tab */
        .crosstab-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
        .crosstab-card {{ padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }}
        .crosstab-card strong {{ font-size: 13px; color: #10b981; display: block; margin-bottom: 6px; }}
        .crosstab-card p {{ font-size: 13px; color: #475569; line-height: 1.6; }}
        .sig-badge {{ font-size: 10px; color: #64748b; font-weight: 700; margin-top: 8px; display: inline-block; }}

        /* Sentiment */
        .sentiment-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
        .sentiment-card {{ padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; }}
        .sentiment-card label {{ font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }}
        .sentiment-card .value {{ font-size: 18px; font-weight: 800; color: #0f172a; }}
        .sentiment-card .value.small {{ font-size: 13px; font-weight: 600; }}
        .sentiment-card.positive {{ border-color: #10b981; background: #f0fdf4; }}
        .sentiment-card.negative {{ border-color: #ef4444; background: #fef2f2; }}

        /* Recommendations */
        .rec-card {{ padding: 16px; margin-bottom: 16px; border-radius: 12px; background: #f8fafc; }}
        .rec-label {{ font-size: 11px; font-weight: 900; letter-spacing: 0.15em; display: block; margin-bottom: 8px; }}
        .rec-card ul {{ padding-left: 20px; }}
        .rec-card li {{ font-size: 14px; color: #334155; margin-bottom: 6px; line-height: 1.6; }}

        /* Risk */
        .risk-item {{ padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 10px; }}
        .risk-header {{ display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }}
        .risk-badge {{ font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.1em; }}
        .risk-flag {{ font-size: 13px; font-weight: 600; color: #0f172a; }}
        .risk-mitigation {{ font-size: 12px; color: #64748b; }}

        /* Benchmarks */
        .bench-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }}
        .bench-card {{ padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center; }}
        .bench-card label {{ font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px; }}
        .bench-card .value {{ font-size: 16px; font-weight: 700; color: #0f172a; }}

        /* Stats */
        .regression-card {{ padding: 16px; border-left: 3px solid #3b82f6; background: #f0f9ff; border-radius: 0 12px 12px 0; margin-bottom: 12px; }}
        .regression-card strong {{ font-size: 13px; color: #1e40af; }}
        .regression-card p {{ font-size: 13px; color: #475569; margin-top: 4px; }}
        .regression-card .interp {{ font-style: italic; color: #64748b; }}
        .outlier-box {{ padding: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; margin-top: 16px; }}
        .outlier-box label {{ font-size: 10px; font-weight: 800; color: #d97706; text-transform: uppercase; display: block; margin-bottom: 6px; }}
        .outlier-box p {{ font-size: 13px; color: #92400e; }}

        /* Footer */
        .footer {{ text-align: center; border-top: 1px solid #e2e8f0; padding-top: 32px; margin-top: 48px; }}
        .footer .seal {{ font-size: 12px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: #10b981; margin-bottom: 8px; }}
        .footer .org-footer {{ font-size: 12px; font-weight: 700; color: #475569; letter-spacing: 0.2em; text-transform: uppercase; }}
        .disclosure {{ margin-top: 24px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; }}
        .disclosure p {{ font-size: 11px; color: #166534; font-weight: 600; letter-spacing: 0.05em; line-height: 1.8; }}

        @media print {{
            .container {{ padding: 40px 32px; }}
            .grade-card {{ border-color: #10b981 !important; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <p class="org">Survey Optimization Bureau</p>
            <h1>{title}</h1>
            <p class="theme">{theme}</p>
            
            {f"""
            <div style="margin: 20px auto; max-width: 600px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: left;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11px;">
                    <div><strong style="color: #64748b; text-transform: uppercase; font-size: 9px;">Target Audience:</strong><br/>{html.escape(str(report['research_meta'].get('target_audience', 'N/A')))}</div>
                    <div><strong style="color: #64748b; text-transform: uppercase; font-size: 9px;">Sample Size:</strong><br/>{html.escape(str(report['research_meta'].get('sample_size', 'N/A')))}</div>
                    <div style="grid-column: span 2;"><strong style="color: #64748b; text-transform: uppercase; font-size: 9px;">Research Context:</strong><br/>{html.escape(str(report['research_meta'].get('context', 'N/A')))}</div>
                    <div><strong style="color: #64748b; text-transform: uppercase; font-size: 9px;">Started:</strong> {html.escape(str(report['research_meta'].get('date_started', 'N/A')))}</div>
                    <div><strong style="color: #64748b; text-transform: uppercase; font-size: 9px;">Finalized:</strong> {html.escape(str(report['research_meta'].get('date_generated', 'N/A')))}</div>
                </div>
            </div>
            """ if report.get('research_meta') else ""}

            <div class="meta-row">
                <div>Document <span>{doc_id}</span></div>
                <div>Certified by <span>AVA Lead Architect v2.0</span></div>
                <div>Generated <span>{timestamp}</span></div>
            </div>
        </header>

        <div class="grade-card">
            <div class="grade">{html.escape(str(report.get('report_grade', 'A')))}</div>
            <div class="details">
                <label>Report Grade</label>
                <div class="score">Integrity: {report.get('integrity_score', 0)}/100</div>
                <label style="margin-top:8px;">Verdict: {html.escape(str(report.get('verdict', 'VERIFIED')))}</label>
            </div>
        </div>

        <section class="section">
            <h2>I. Executive Summary</h2>
            <p class="body-text">{exec_summary}</p>
            {"<p class='body-text'><em>" + addendum + "</em></p>" if addendum else ""}
        </section>

        <section class="section">
            <h2>II. Methodology &amp; Data Quality</h2>
            <p class="body-text"><strong>Source:</strong> {html.escape(report.get('source_filename', 'N/A'))} | <strong>Records:</strong> {report.get('row_count', 0)} | <strong>Fields:</strong> {report.get('col_count', 0)}</p>
            <p class="body-text"><strong>Scoring Standard:</strong> {html.escape(str(report.get('scoring_standard', 'N/A')))}</p>
            <p class="body-text"><strong>Data Quality:</strong> {html.escape(str(report.get('data_quality_notes', 'N/A')))}</p>
            <p class="body-text"><strong>Confidence Level:</strong> {html.escape(str(report.get('confidence_level', 'MEDIUM')))}</p>
        </section>

        <section class="section">
            <h2>III. Respondent Profile</h2>
            <p class="body-text">{html.escape(str(report.get('respondent_profile', {}).get('demographic_breakdown', 'N/A')))}</p>
        </section>

        <section class="section">
            <h2>IV. Key Findings</h2>
            <table class="findings-table">{findings_html}</table>
        </section>

        <section class="section">
            <h2>V. Cross-Tabulation Analysis</h2>
            <div class="crosstab-grid">{crosstab_html}</div>
        </section>

        <section class="section">
            <h2>VI. Sentiment &amp; Thematic Analysis</h2>
            {sentiment_html}
        </section>

        <section class="section">
            <h2>VII. Statistical Deep Dive</h2>
            {stats_html}
        </section>

        <section class="section">
            <h2>VIII. Industry Benchmarking</h2>
            <p class="body-text">{html.escape(str(report.get('market_realities', '')))}</p>
            <div class="bench-grid">{bench_html}</div>
        </section>

        <section class="section">
            <h2>IX. Strategic Recommendations</h2>
            {recs_html}
        </section>

        <section class="section">
            <h2>X. Risk Assessment &amp; Limitations</h2>
            {risk_html}
        </section>

        <section class="section">
            <h2>Precision Audit Statement</h2>
            <div class="disclosure">
                <p>{precision_audit}</p>
            </div>
        </section>

        <footer class="footer">
            <p class="seal">AVA Certified — Bureau Gold Standard</p>
            <p class="org-footer">Survey Optimization Bureau — Field Data Interpreter v2.0</p>
            <div class="disclosure" style="margin-top: 16px;">
                <p><strong>PRIVACY:</strong> The Bureau operates on a zero-PII architecture. All data is anonymized or aggregated.</p>
                <p><strong>DISCLAIMER:</strong> While engineered for peak analytical integrity, The Bureau does not guarantee specific market outcomes.</p>
            </div>
        </footer>
    </div>
</body>
</html>"""
        return doc_html

    # ══════════════════════════════════════════════════════════════════
    # UTILITIES
    # ══════════════════════════════════════════════════════════════════

    def _parse_csv(self, csv_content: str) -> pd.DataFrame:
        """Robust CSV parsing with multiple fallback strategies."""
        try:
            return pd.read_csv(io.StringIO(csv_content), on_bad_lines='skip')
        except Exception:
            try:
                import csv as csv_mod
                dialect = csv_mod.Sniffer().sniff(csv_content[:2048])
                return pd.read_csv(io.StringIO(csv_content), sep=dialect.delimiter, on_bad_lines='skip')
            except Exception:
                try:
                    return pd.read_csv(io.StringIO(csv_content), sep='\t', on_bad_lines='skip')
                except Exception:
                    return pd.DataFrame({"raw_data": csv_content.split('\n')})

    async def _call_agent_with_tokens(self, prompt: str, agent_name: str) -> tuple:
        """Calls an agent and returns (parsed_data, (tokens_in, tokens_out))."""
        bureau_logger.info(f"CALLING_AGENT: {agent_name}")
        try:
            response = await generate_with_retry(
                client=self.client,
                model=self.model,
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            tokens_in = 0
            tokens_out = 0
            if hasattr(response, 'usage_metadata') and response.usage_metadata:
                tokens_in = getattr(response.usage_metadata, 'prompt_token_count', 0) or 0
                tokens_out = getattr(response.usage_metadata, 'candidates_token_count', 0) or 0

            data = safe_parse_json(response.text)
            return data, (tokens_in, tokens_out)
        except Exception as e:
            bureau_logger.error(f"AGENT_{agent_name}_FAILED: {str(e)}")
            raise

    def _event(self, event_type: str, agent: str, data: Dict) -> str:
        """Creates an NDJSON event string."""
        return json.dumps({"type": event_type, "agent": agent, "data": data, "ts": datetime.datetime.now().isoformat()}) + "\n"


# Singleton
field_interpreter = FieldDataInterpreter()
