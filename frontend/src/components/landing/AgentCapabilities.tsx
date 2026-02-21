"use client";
import React from "react";
import { Reveal } from "./LandingUtils";
import { Cpu, ShieldPlus, Target, Microscope, FileCheck, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AGENT_DATA = [
    {
        name: "AVA — The Autonomous Survey Orchestrator",
        p1: "AVA is the first Agentic AI platform purpose-built for survey intelligence. She orchestrates a suite of specialized agents to automate the end-to-end development of market research instruments to ensure scientific rigor and data integrity — before, during, and after fieldwork.",
        p2: "AVA works by integrating Large Language Models with proprietary research methodologies and behavioral databases. Her system reasons through complex methodology constraints to provide researchers with an autonomous analyst that works with 98% accuracy and 100x the speed of traditional manual survey review.",
        output: "A centralized Survey OS environment providing autonomous control over the entire research design lifecycle, from market reconnaissance to final data validation.",
        icon: Sparkles
    },
    {
        name: "Sentinel — OSINT Market Reconnaissance",
        p1: "Sentinel is AVA's open-source intelligence agent. It scans real-time cultural, economic, and social data about your target market to build a contextual foundation for your Market Research instrument — before a single question is written.",
        p2: "Sentinel works by aggregating OSINT signals across your target geography and demographic segment, identifying survey-sensitive topics, cultural blind spots, linguistic codes, and contextual risk factors that generic survey design ignores. The result is a research-grade market brief delivered in minutes, not days.",
        output: "A real-time market context dossier covering cultural landscape, economic indicators, social sensitivities, and survey-design risk flags — specific to your target audience and geography.",
        icon: Target
    },
    {
        name: "Genesis — Autonomous Instrument Construction",
        p1: "Genesis is AVA's autonomous survey architect. It transforms raw research objectives into statistically rigorous, fieldwork-ready questionnaires to ensure every data point collected is actionable — before your fieldwork budget is even touched.",
        p2: "Genesis works by applying advanced psychometric principles and logical branching sequences to your project brief. It automatically constructs complex survey logic, skip-patterns, and randomized blocks while ensuring every item adheres to global data integrity standards for quantitative and qualitative inquiry.",
        output: "A publication-ready digital field instrument, including full survey logic maps, psychometrically optimized phrasing, and ready-to-deploy digital asset files.",
        icon: Cpu
    },
    {
        name: "The Lab — Behavioral Stress-Testing",
        p1: "The Lab is AVA's behavioral stress-testing environment. It simulates thousands of unique respondent journeys through your questionnaire to detect bias, ambiguity, and structural flaws — before a single real human respondent is contacted.",
        p2: "The Lab works by deploying thousands of synthetic personas, calibrated to your specific census-weighted target audience, to interact with your survey. It tracks cognitive load, response friction, and sentiment skew for every question variant, flagging exact points of potential data contamination or participant drop-off.",
        output: "A comprehensive stress-test diagnostic report featuring a Data Integrity score, bias heatmaps, ambiguity alerts, and prioritized question-rewrite suggestions.",
        icon: Microscope
    },
    {
        name: "Field Interpreter — Post-Field Data Audit",
        p1: "The Field Interpreter is AVA's post-fieldwork audit engine. It analyzes raw survey data to detect fraud, straight-lining, and inconsistent response patterns to protect the validity of your final insights — before you begin your statistical analysis.",
        p2: "The Interpreter works by applying behavioral pattern-matching algorithms to detect bot activity, non-serious responses, and logical contradictions within the dataset. It cleans and validates raw data batches in real-time, assigning a 'Trustworthiness Score' to every individual survey record to ensure your findings are defensible.",
        output: "A validated and cleaned data audit report, including fraud-detection maps, record-level trustworthiness scores, and a certificate of data integrity for your final stakeholder presentation.",
        icon: FileCheck
    }
];

const ModuleItem = ({ agent, index, activeIndex, setActiveIndex }: { agent: typeof AGENT_DATA[0], index: number, activeIndex: number | null, setActiveIndex: (i: number | null) => void }) => {
    const isOpen = activeIndex === index;

    return (
        <div className={`max-w-4xl border-l transition-all duration-500 pl-8 md:pl-16 relative ${isOpen ? 'border-blue-500 bg-blue-50/20 py-8 md:py-12' : 'border-slate-100 hover:border-slate-300'}`}>
            {/* Functional Icon Side-Indicator */}
            <div className={`absolute -left-[21px] top-6 md:top-10 w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm transition-all duration-500 ${isOpen ? 'border-blue-500 rotate-[360deg] shadow-blue-500/20' : 'border-slate-100'}`}>
                <agent.icon size={18} className={isOpen ? 'text-blue-600' : 'text-slate-400'} />
            </div>

            <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full text-left focus:outline-none cursor-pointer group"
            >
                <Reveal delay={0.1}>
                    <div className="flex items-start justify-between gap-6">
                        <h3 className={`text-xl md:text-3xl font-black tracking-tight leading-tight uppercase transition-colors duration-400 ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                            {agent.name}
                        </h3>
                        <div className={`mt-1 md:mt-2 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                            <ChevronDown size={28} />
                        </div>
                    </div>
                </Reveal>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-10 pt-10">
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                {agent.p1}
                            </p>

                            <p className="text-base md:text-lg text-slate-500 leading-relaxed">
                                {agent.p2}
                            </p>

                            <div className="p-6 md:p-8 bg-white/80 rounded-2xl border border-blue-100 shadow-sm">
                                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-bold uppercase tracking-tight">
                                    <span className="text-blue-600 mr-2">Output:</span>
                                    {agent.output}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function AgentCapabilities() {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(0); // Default open the first one
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="agents" className="section-full relative overflow-hidden bg-white py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="badge-blue inline-flex items-center gap-2 mb-8">
                        <ShieldPlus size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            The Agentic Stack
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-20 md:mb-24">
                        Technical <span className="text-blue-600">Specifications.</span>
                    </h2>
                </Reveal>

                <div className="space-y-4 md:space-y-6">
                    {AGENT_DATA.map((agent, i) => (
                        <ModuleItem
                            key={i}
                            agent={agent}
                            index={i}
                            activeIndex={mounted ? activeIndex : null}
                            setActiveIndex={setActiveIndex}
                        />
                    ))}
                </div>
            </div>

            {/* AEO Backdrop Elements */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/30 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
        </section>
    );
}
