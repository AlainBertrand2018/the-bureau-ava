import { Cpu, Target, Microscope, FileCheck, Sparkles, LucideIcon } from "lucide-react";

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
        role: "The Autonomous Survey Orchestrator",
        whatItIs: "AVA is the first Agentic AI platform purpose-built for survey intelligence. She is the central intelligence that governs the Bureau's research lifecycle.",
        purpose: "To automate the end-to-end development of market research instruments while ensuring scientific rigor and 100% data integrity.",
        whatItDoes: "She orchestrates a suite of specialized agents, integrating Large Language Models with proprietary research methodologies and reasoning engines to handle complex survey constraints.",
        output: "A centralized Survey OS environment providing autonomous control over reconnaissance, construction, simulation, and data validation.",
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
        whatItIs: "Sentinel is AVA's open-source intelligence specialist. It acts as the frontline scout for every research project.",
        purpose: "To build a real-time cultural, economic, and social foundation for survey instruments before a single question is drafted.",
        whatItDoes: "It scans global OSINT signals across target geographies and segments, identifying survey-sensitive topics, linguistic codes, and contextual risk factors.",
        output: "A real-time market context dossier covering cultural landscapes, social sensitivities, and specific survey-design risk flags.",
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
        whatItIs: "Genesis is AVA's autonomous survey architect. It is the engine responsible for the structural integrity of the field instrument.",
        purpose: "To transform raw research objectives into statistically rigorous, fieldwork-ready questionnaires that produce zero-bias data.",
        whatItDoes: "It applies advanced psychometric principles to construct complex logic, skip-patterns, and randomized blocks while optimizing phrasing for participant clarity.",
        output: "A publication-ready digital field instrument with full logic maps and psychometrically optimized question batteries.",
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
        whatItIs: "The Lab is AVA's behavioral simulation environment. It serves as the ultimate proving ground for survey instruments.",
        purpose: "To detect bias, ambiguity, and structural flaws by simulating human respondent behavior before actual fieldwork begins.",
        whatItDoes: "It deploys thousands of synthetic personas, calibrated to census-weighted audiences, to stress-test logical paths and measure cognitive friction.",
        output: "A comprehensive stress-test diagnostic report featuring Data Integrity scores, bias heatmaps, and priority rewrite alerts.",
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
        whatItIs: "The Field Interpreter is AVA's statistical security engine. it is the final gatekeeper of data veracity.",
        purpose: "To protect the validity of research insights by detecting fraud, bot activity, and participant straight-lining in raw data.",
        whatItDoes: "It applies behavioral pattern-matching and anomaly detection to real-time data batches, assigning individual trustworthiness scores to every record.",
        output: "A validated data audit report with fraud-detection maps and verified certificates of data integrity for stakeholders.",
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
