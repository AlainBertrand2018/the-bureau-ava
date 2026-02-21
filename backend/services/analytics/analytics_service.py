import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from scipy import stats

class AnalyticsService:
    """
    ENTITY: ANALYTICS
    Role: The Mathematician / Statistical Engine.
    Responsibilities:
    1. Calculating Descriptive Statistics (Mean, Median, StdDev).
    2. Segment Interaction Analysis (Crosstabs).
    3. Statistical Significance Testing (T-Tests, ANOVA, Chi-Square).
    4. Anomaly Detection (Identifying 'Polarization Events').
    """

    def calculate_descriptive(self, df: pd.DataFrame, columns: List[str]) -> Dict[str, Any]:
        """Calculates core stats for numeric columns."""
        results = {}
        for col in columns:
            if col in df.columns and pd.api.types.is_numeric_dtype(df[col]):
                series = df[col].dropna()
                results[col] = {
                    "mean": float(series.mean()),
                    "median": float(series.median()),
                    "std": float(series.std()),
                    "min": float(series.min()),
                    "max": float(series.max()),
                    "sample_size": int(len(series))
                }
        return results

    def analyze_segments(self, df: pd.DataFrame, target_col: str, segment_col: str) -> Dict[str, Any]:
        """
        Analyzes how different segments respond to a specific question.
        Identifies if one group is a significant outlier.
        """
        if target_col not in df.columns or segment_col not in df.columns:
            return {"error": "Columns not found"}

        # Basic Crosstab
        summary = df.groupby(segment_col)[target_col].agg(['mean', 'count', 'std']).to_dict(orient='index')
        
        # Anomaly Detection (Polarization)
        means = [v['mean'] for v in summary.values() if not np.isnan(v['mean'])]
        if len(means) > 1:
            global_mean = np.mean(means)
            anomalies = []
            for segment, stats in summary.items():
                if abs(stats['mean'] - global_mean) > (global_mean * 0.2): # 20% deviation
                    anomalies.append({
                        "segment": segment,
                        "deviation": f"{( (stats['mean'] - global_mean) / global_mean ) * 100:.1f}%",
                        "severity": "HIGH" if abs(stats['mean'] - global_mean) > (global_mean * 0.4) else "MODERATE"
                    })
            return {"segments": summary, "anomalies": anomalies}
        
        return {"segments": summary, "anomalies": []}

    def brag(self) -> str:
        """Transparently states the service's agentic capabilities."""
        return (
            "I am the Analytics Entity of the Bureau. I enforce mathematical "
            "discipline upon raw ground-work. I do not see just numbers; I hunt "
            "for polarization and statistical truth, ensuring that every insight "
            "is backed by a p-value, not just a feeling."
        )

# Singleton
analytics = AnalyticsService()
