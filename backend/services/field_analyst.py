import pandas as pd
from typing import Dict, Any, List, Optional
from services.sentinel.sentinel_service import sentinel
from services.analytics.analytics_service import analytics
from services.synthesis.synthesis_service import synthesis
from logger import bureau_logger

class FieldAnalyst:
    """
    ORCHESTRATOR: FIELD ANALYST
    Role: The Tool Controller for Product 4 (Field Data Interpreter).
    Responsibilities:
    1. Coordinating the Sentinel, Analytics, and Synthesis entities.
    2. Managing the end-to-end flow from CSV upload to Bureau Verdict.
    3. Ensuring agentic transparency throughout the process.
    """

    async def process_field_data(self, file_path: str, context: str) -> Dict[str, Any]:
        """
        The Master Workflow:
        Sentinel (Intake) -> Analytics (Quant) -> Synthesis (Qual) -> Final Verdict.
        """
        bureau_logger.info(f"FieldAnalyst: Starting processing for {file_path}")

        # 1. SENTINEL: Data Intake & Inference
        df = await sentinel.ingest_file(file_path)
        schema = await sentinel.infer_schema(df)
        bureau_logger.info(f"FieldAnalyst: Sentinel Inference Complete. Confidence: {schema.get('confidence_scores')}")

        # 2. ANALYTICS: Quantitative Crunching
        # Identify numeric question columns from mapping
        question_cols = [v for k, v in schema.get('mapping', {}).items() if "QUESTION" in k]
        demographic_cols = [v for k, v in schema.get('mapping', {}).items() if "DEMOGRAPHIC" in k]
        
        quant_results = analytics.calculate_descriptive(df, question_cols)
        
        # Deep dive into significance if segments exist
        segment_analysis = {}
        if demographic_cols and question_cols:
            primary_segment = demographic_cols[0]
            for col in question_cols[:3]: # Limit deep dive to top 3 for speed
                 segment_analysis[col] = analytics.analyze_segments(df, col, primary_segment)

        # 3. SYNTHESIS: Qualitative Coding & Narrative
        # Extract open-ended text answers if any
        text_cols = [df.columns[i] for i, t in enumerate(schema.get('type_detection', {}).values()) if t == "text"]
        
        qual_results = {}
        if text_cols:
            all_text = df[text_cols[0]].dropna().astype(str).tolist()
            qual_results = await synthesis.code_qualitative_responses(all_text)

        # 4. FINAL VERDICT: The Council Consensus
        final_verdict = await synthesis.generate_executive_verdict(
            quant_data={"stats": quant_results, "segments": segment_analysis},
            qual_data=qual_results,
            context=context
        )

        # 5. ASSEMBLE BUREAU PACKAGE
        package = {
            "metadata": {
                "agents_involved": ["Sentinel", "Analytics", "Synthesis"],
                "total_rows": len(df),
                "schema_used": schema
            },
            "findings": {
                "quantitative": quant_results,
                "segmentation": segment_analysis
            },
            "synthesis": qual_results,
            "verdict": final_verdict,
            "agentic_brags": {
                "sentinel": sentinel.brag(),
                "analytics": analytics.brag(),
                "synthesis": synthesis.brag()
            }
        }

        bureau_logger.info("FieldAnalyst: Full Package Assembled.")
        return package

# Singleton
field_analyst = FieldAnalyst()
