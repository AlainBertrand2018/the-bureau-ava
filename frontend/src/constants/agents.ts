import { Cpu, Target, Microscope, FileCheck, Sparkles, LucideIcon } from "lucide-react";

export interface AgentModule {
    name: string;
    slug: string;
    role: string;
    p1: string;
    p2: string;
    output: string;
    icon: LucideIcon;
    status: "Operational" | "Deep Learning" | "Optimizing";
    skills: string[];
    tools: string[];
    relatedGlossary: { name: string; slug: string }[];
}

export const agentData: AgentModule[] = [
    {
        name: "AVA",
        slug: "ava-orchestrator",
        role: "The Autonomous Survey Orchestrator",
        p1: "AVA is the first Agentic AI platform purpose-built for survey intelligence. She orchestrates a suite of specialized agents to automate the end-to-end development of market research instruments to ensure scientific rigor and data integrity — before, during, and after fieldwork.",
        p2: "AVA works by integrating Large Language Models with proprietary research methodologies and behavioral databases. Her system reasons through complex methodology constraints to provide researchers with an autonomous analyst that works with 98% accuracy and 100x the speed of traditional manual survey review.",
        output: "A centralized Survey OS environment providing autonomous control over the entire research design lifecycle, from market reconnaissance to final data validation.",
        icon: Sparkles,
        status: "Operational",
        skills: ["Agentic Orchestration", "Multi-model reasoning", "Strategic Planning", "Quality Gatekeeping"],
        tools: ["Vector Memory", "Bureau OS Kernel", "Reasoning Engines"],
        relatedGlossary: [
            { name: "Agentic AI", slug: "agentic-ai" },
            { name: "Data Integrity", slug: "data-integrity" }
        ]
    },
    {
        name: "Sentinel",
        slug: "sentinel-recon",
        role: "OSINT Market Reconnaissance",
        p1: "Sentinel is AVA's open-source intelligence agent. It scans real-time cultural, economic, and social data about your target market to build a contextual foundation for your Market Research instrument — before a single question is written.",
        p2: "Sentinel works by aggregating OSINT signals across your target geography and demographic segment, identifying survey-sensitive topics, cultural blind spots, linguistic codes, and contextual risk factors that generic survey design ignores. The result is a research-grade market brief delivered in minutes, not days.",
        output: "A real-time market context dossier covering cultural landscape, economic indicators, social sensitivities, and survey-design risk flags — specific to your target audience and geography.",
        icon: Target,
        status: "Operational",
        skills: ["OSINT Harvesting", "Cultural Sentiment Mapping", "Geographic Analysis", "Risk Flagging"],
        tools: ["Global News API", "Social Signal Monitor", "Economic Dossiers"],
        relatedGlossary: [
            { name: "Cultural Blind Spot", slug: "cultural-blind-spot" },
            { name: "Demographic Calibration", slug: "demographic-calibration" }
        ]
    },
    {
        name: "Genesis",
        slug: "genesis-architect",
        role: "Autonomous Instrument Construction",
        p1: "Genesis is AVA's autonomous survey architect. It transforms raw research objectives into statistically rigorous, fieldwork-ready questionnaires to ensure every data point collected is actionable — before your fieldwork budget is even touched.",
        p2: "Genesis works by applying advanced psychometric principles and logical branching sequences to your project brief. It automatically constructs complex survey logic, skip-patterns, and randomized blocks while ensuring every item adheres to global data integrity standards for quantitative and qualitative inquiry.",
        output: "A publication-ready digital field instrument, including full survey logic maps, psychometrically optimized phrasing, and ready-to-deploy digital asset files.",
        icon: Cpu,
        status: "Operational",
        skills: ["Psychometric Design", "Logical Path Construction", "Bias Mitigation", "Skip-logic Optimization"],
        tools: ["Logic Mapping Engine", "Question Bank V2", "A/B Phrase Generator"],
        relatedGlossary: [
            { name: "Double-Barreled Question", slug: "double-barreled-question" },
            { name: "Leading Question", slug: "leading-question" },
            { name: "Survey Logic Fork", slug: "survey-logic-fork" }
        ]
    },
    {
        name: "The Lab",
        slug: "the-lab-simulator",
        role: "Behavioral Stress-Testing",
        p1: "The Lab is AVA's behavioral stress-testing environment. It simulates thousands of unique respondent journeys through your questionnaire to detect bias, ambiguity, and structural flaws — before a single real human respondent is contacted.",
        p2: "The Lab works by deploying thousands of synthetic personas, calibrated to your specific census-weighted target audience, to interact with your survey. It tracks cognitive load, response friction, and sentiment skew for every question variant, flagging exact points of potential data contamination or participant drop-off.",
        output: "A comprehensive stress-test diagnostic report featuring a Data Integrity score, bias heatmaps, ambiguity alerts, and prioritized question-rewrite suggestions.",
        icon: Microscope,
        status: "Operational",
        skills: ["Synthetic Persona Modeling", "Cognitive Load Simulation", "Stress-Testing", "Predictive Analytics"],
        tools: ["Persona Factory", "Heatmap Generator", "Friction Monitor"],
        relatedGlossary: [
            { name: "Survey Stress-Testing", slug: "survey-stress-testing" },
            { name: "Synthetic Respondent", slug: "synthetic-respondent" },
            { name: "Cognitive Load", slug: "cognitive-load" },
            { name: "Response Fatigue", slug: "response-fatigue" }
        ]
    },
    {
        name: "Field Interpreter",
        slug: "field-interpreter-audit",
        role: "Post-Field Data Audit",
        p1: "The Field Interpreter is AVA's post-fieldwork audit engine. It analyzes raw survey data to detect fraud, straight-lining, and inconsistent response patterns to protect the validity of your final insights — before you begin your statistical analysis.",
        p2: "The Interpreter works by applying behavioral pattern-matching algorithms to detect bot activity, non-serious responses, and logical contradictions within the dataset. It cleans and validates raw data batches in real-time, assigning a 'Trustworthiness Score' to every individual survey record to ensure your findings are defensible.",
        output: "A validated and cleaned data audit report, including fraud-detection maps, record-level trustworthiness scores, and a certificate of data integrity for your final stakeholder presentation.",
        icon: FileCheck,
        status: "Operational",
        skills: ["Fraud Detection", "Pattern Recognition", "Data Cleaning", "Trust Scoring"],
        tools: ["Anomaly Detector", "Bot-trap Logic", "Validation Engine"],
        relatedGlossary: [
            { name: "Data Integrity", slug: "data-integrity" },
            { name: "Social Desirability Bias", slug: "social-desirability-bias" },
            { name: "Participant Dropout", slug: "participant-dropout" }
        ]
    }
];
