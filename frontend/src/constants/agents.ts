import { Cpu, Target, Microscope, FileCheck, Sparkles, LucideIcon, Users } from "lucide-react";

export interface AgentModule {
    name: string;
    slug: string;
    role: string;
    whatItIs: string;
    purpose: string;
    whatItDoes: string;
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
        role: "The Autonomous Validation Analyst",
        whatItIs: "AVA is the presiding agentic intelligence for global survey governance. She is the proprietary orchestrator designed to manage complex research lifecycles with boardroom-level authority.",
        purpose: "To provide institutional oversight over the end-to-end development of research instruments, ensuring scientific rigor and 100% data integrity.",
        whatItDoes: "She presides over a specialized stack of agents, utilizing high-density reasoning engines to synthesize OSINT intelligence, generative architecture, and adversarial simulations into a unified data-integrity protocol.",
        output: "Executive control over the complete research pipeline, delivering autonomous reconnaissance, construction, simulation, and forensic data validation.",
        icon: Sparkles,
        status: "Operational",
        skills: ["Agentic Orchestration", "Sovereign Governance", "Multi-model reasoning", "Scientific Gatekeeping"],
        tools: ["Vector Memory", "Bureau OS Kernel", "Reasoning Engines"],
        relatedGlossary: [
            { name: "Agentic AI", slug: "agentic-ai" },
            { name: "Data Integrity", slug: "data-integrity" }
        ]
    },
    {
        name: "Sentinel",
        slug: "sentinel-recon",
        role: "Market Reconnaissance",
        whatItIs: "Sentinel is a specialized reconnaissance agent utilizing Open-Source Intelligence (OSINT) to synthesize foundational research contexts.",
        purpose: "To build a real-time cultural and socioeconomic framework for survey instruments, securing scientific relevance within target market landscapes.",
        whatItDoes: "It conducts deep-spectrum OSINT scanning across global signal networks to identify survey-sensitive linguistic codes, cultural taboos, and psychographic trends in real time.",
        output: "A comprehensive Market Intelligence Dossier covering the cultural landscape, social sensitivities, and specific survey-design risk flags.",
        icon: Target,
        status: "Operational",
        skills: ["OSINT Harvesting", "Cultural Sentiment Mapping", "Geographic Analysis", "Entity Extraction"],
        tools: ["Global News API", "Social Signal Monitor", "Economic Dossiers"],
        relatedGlossary: [
            { name: "Cultural Blind Spot", slug: "cultural-blind-spot" },
            { name: "Demographic Calibration", slug: "demographic-calibration" }
        ]
    },
    {
        name: "Profiler",
        slug: "profiler-calibration",
        role: "Cultural Calibration",
        whatItIs: "Profiler is a deep-spectrum behavioral engine designed to map the psychographic and cultural registers of target demographics.",
        purpose: "To ensure that survey instruments are calibrated to the specific linguistic and social norms of a population, preventing cultural contamination.",
        whatItDoes: "It performs granular analysis of local behavioral codes and taboos, providing the necessary calibration data for the Architect and Auditor modules.",
        output: "A Cultural Calibration Protocol that defines the exact register, tone, and logic required for high-veracity respondent engagement.",
        icon: Users,
        status: "Operational",
        skills: ["Psychographic Mapping", "Linguistic Registration", "Taboo Detection", "Bias Alignment"],
        tools: ["Behavioral Logic Engine", "Registry of Global Norms", "Tone Calibrator"],
        relatedGlossary: [
            { name: "Psychometrics", slug: "psychometrics" },
            { name: "Cognitive Load", slug: "cognitive-load" }
        ]
    },
    {
        name: "Architect",
        slug: "genesis-architect",
        role: "Instrument Design",
        whatItIs: "Architect is an autonomous generative engine responsible for the structural and statistical integrity of research instruments.",
        purpose: "To transform institutional research goals into publication-ready questionnaires that produce zero-bias data through the Genesis Protocol.",
        whatItDoes: "It applies psychometric logic to generate statistically rigorous questionnaires, optimizing phrase-weighting and skip-patterns to eliminate respondent fatigue.",
        output: "A Bureau-certified digital field instrument featuring advanced logic maps and psychometrically optimized question batteries.",
        icon: Cpu,
        status: "Operational",
        skills: ["Psychometric Design", "Logical Path Construction", "Bias Mitigation", "Generative Architecture"],
        tools: ["Logic Mapping Engine", "Question Bank V2", "A/B Phrase Generator"],
        relatedGlossary: [
            { name: "Double-Barreled Question", slug: "double-barreled-question" },
            { name: "Leading Question", slug: "leading-question" },
            { name: "Survey Logic Fork", slug: "survey-logic-fork" }
        ]
    },
    {
        name: "Auditor",
        slug: "the-lab-simulator",
        role: "Adversarial Stress Testing",
        whatItIs: "Auditor is an adversarial simulation environment designed to audit survey instruments against synthetic respondent populations.",
        purpose: "To identify structural flaws, cognitive bias, and drop-off risks by simulating genuine human interaction prior to real-world fieldwork.",
        whatItDoes: "It deploys census-weighted synthetic panels to engage in adversarial simulations with the survey instrument, measuring friction points and predicting data quality outcomes.",
        output: "A forensic stress-test diagnostic featuring Data Integrity scores, predictive bias heatmaps, and prioritize instrument rewrite directives.",
        icon: Microscope,
        status: "Operational",
        skills: ["Synthetic Persona Modeling", "Adversarial Simulation", "Stress-Testing", "Predictive Analytics"],
        tools: ["Persona Factory", "Heatmap Generator", "Friction Monitor"],
        relatedGlossary: [
            { name: "Survey Stress-Testing", slug: "survey-stress-testing" },
            { name: "Synthetic Respondent", slug: "synthetic-respondent" },
            { name: "Cognitive Load", slug: "cognitive-load" },
            { name: "Response Fatigue", slug: "response-fatigue" }
        ]
    },
    {
        name: "Interpreter",
        slug: "field-interpreter-audit",
        role: "Narrative Synthesis",
        whatItIs: "Interpreter is a forensic intelligence engine specialized in post-fieldwork data auditing and psychographic narrative reporting.",
        purpose: "To transform raw fieldwork data into courtroom-defensible intelligence by identifying non-obvious correlations and identifying data contamination.",
        whatItDoes: "It applies pattern-recognition and behavioral anomaly detection to assign trustworthiness scores to individual records and synthesize raw data into boardroom-ready briefings.",
        output: "Validated Data Integrity reports including psychographic narrative briefings and verified certificates of research veracity.",
        icon: FileCheck,
        status: "Operational",
        skills: ["Fraud Detection", "Narrative Synthesis", "Data Cleaning", "Trust Scoring"],
        tools: ["Anomaly Detector", "Bot-trap Logic", "Validation Engine"],
        relatedGlossary: [
            { name: "Data Integrity", slug: "data-integrity" },
            { name: "Social Desirability Bias", slug: "social-desirability-bias" },
            { name: "Participant Dropout", slug: "participant-dropout" }
        ]
    }
];
