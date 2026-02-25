import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from report_generator import bureau_reports

# Mock data for the Demo
mock_data = {
    "timestamp": "2026-02-25T21:50:00Z",
    "certified_by": "AVA Lead Architect v2.0",
    "instrument": [
        "How satisfied are you with the quality of our services? (1=Very Dissatisfied, 5=Very Satisfied)",
        "How often do you use our product? (Daily, Weekly, Monthly, Rarely, Never)",
        "What is your primary reason for choosing our brand? (Open-ended)"
    ],
    "strategic_rationale": "This instrument is designed to measure core NPS metrics while identifying behavioral usage patterns in the EMEA market. The flow follows a cognitive retrieval pattern to minimize respondent fatigue.",
    "mission": {
        "dossier": {
            "economics": {
                "macro_indicators": "Stable GDP growth (2.4%), moderate inflation.",
                "salary_ranges": "€35k - €85k median range for target segment.",
                "gender_revenue_parity": "0.88 index.",
                "budgetary_decisions": "High discretionary spending in tech sector."
            },
            "education": {
                "literacy_levels": "99% adult literacy.",
                "educational_attainment": "45% Tertiary education in target hubs."
            },
            "technology": {
                "adoption_metrics": "88% Smartphone penetration.",
                "tech_literacy": "Advanced digital proficiency recorded."
            },
            "cultural_axioms": ["Long-term orientation", "High uncertainty avoidance"],
            "taboos": ["Political affiliation discussion", "Highly personal financial disclosure"]
        }
    },
    "simulation_report": {
        "executive_summary": "The simulation confirmed high comprehension levels across all segments. One question was flagged for minor ambiguity and corrected in the current version.",
        "overall_risk_level": "LOW",
        "quality_score": 98,
        "next_steps": [
            "Proceed to field deployment",
            "N=500 sample size recommended",
            "Multi-mode online/CATI sequence"
        ],
        "demographic_insights": [
            {"segment": "Urban Professional", "finding": "100% completion rate with zero friction."},
            {"segment": "Retirement Age", "finding": "Slightly longer retrieval time for Q2, but accurate response."}
        ],
        "question_justifications": [
            {"relevance_to_objective": "Captures the primary satisfaction metric for longitudinal tracking.", "psychometric_trustworthiness": "Likert Balance"},
            {"relevance_to_objective": "Identifies high-frequency proponents vs casual users.", "psychometric_trustworthiness": "Temporal Stability"},
            {"relevance_to_objective": "Captures raw qualitative drivers for sentiment analysis.", "psychometric_trustworthiness": "Cognitive Load Reduction"}
        ]
    },
    "field_manual": {
        "deployment_best_practices": [
            "Invite via email with Bureau-branded link.",
            "Offer 2-minute estimated completion time disclosure.",
            "Implement logic-branching for non-users."
        ],
        "potential_outcomes": "Expected 85% completion rate with high data fidelity across the primary KPIs.",
        "scientific_disclosure": "Built on Psychometric Measurement Theory (Dillman, Krosnick) and Agent-Based Modeling."
    }
}

# Generate HTML
html_output = bureau_reports.generate_dossier(mock_data)

# Save to file
demo_path = os.path.join(os.getcwd(), "BUREAU_CERTIFICATE_DEMO.html")
with open(demo_path, "w", encoding="utf-8") as f:
    f.write(html_output)

print(f"Demo generated at: {demo_path}")
