"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    FlaskConical,
    ChevronRight,
    ChevronLeft,
    Zap,
    Users,
    FileQuestion,
    BarChart3,
    Globe,
    Target,
    ShieldCheck,
    FileText,
    Activity,
} from "lucide-react";
import ContextStep from "./ContextStep";
import QuestionsStep from "./QuestionsStep";
import PersonasStep from "./PersonasStep";
import SimulationStep from "./SimulationStep";
import ResultsStep from "./ResultsStep";
import ReportStep from "./ReportStep";
import { useMission } from "@/context/MissionContext";
import { COUNTRIES } from "@/constants/marketData";

export interface Persona {
    name: string;
    age: number;
    location: string;
    occupation: string;
    traits: string;
}

export interface SimulationResult {
    Agent: string;
    Demographic: string;
    [key: string]: string;
}

const STEPS = [
    {
        id: "context",
        label: "Mission Context",
        icon: <Target size={16} />,
        description: "Configure mission objectives and target market.",
    },
    {
        id: "questions",
        label: "Questionnaire",
        icon: <FileQuestion size={16} />,
        description: "Input or generate survey questions to be audited.",
    },
    {
        id: "personas",
        label: "Panel Personas",
        icon: <Users size={16} />,
        description: "Deploy AI diagnostic personas tailored to your context.",
    },
    {
        id: "simulate",
        label: "Field Simulation",
        icon: <Zap size={16} />,
        description: "Execute the mass-simulation across the target panel.",
    },
    {
        id: "results",
        label: "Dataset Analysis",
        icon: <BarChart3 size={16} />,
        description: "Qualitative and quantitative breakdown of the data.",
    },
    {
        id: "report",
        label: "Final Audit Report",
        icon: <FileText size={16} />,
        description: "Generate executive dashboard and quality certification.",
    },
];

export default function LabShell() {
    const { currentMission } = useMission();
    const [currentStep, setCurrentStep] = useState(0);
    const [context, setContext] = useState("");

    const [questions, setQuestions] = useState<string[]>([]);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [results, setResults] = useState<SimulationResult[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    // DEBUG: Check if we are looping here
    useEffect(() => {
        console.log("LabShell mounted");
        if (!currentMission) console.log("LabShell: No current mission");
        else console.log("LabShell: Mission found", currentMission.mission_id);
    }, [currentMission]);

    const canProceed = useCallback(() => {
        switch (currentStep) {
            case 0:
                return context.trim().length > 10;
            case 1:
                return questions.length >= 2;
            case 2:
                return personas.length >= 3;
            case 3:
                return results.length > 0;
            case 4:
                return results.length > 0;
            default:
                return true;
        }
    }, [currentStep, context, questions, personas, results]);

    const router = useRouter();

    useEffect(() => {
        if (!currentMission && typeof window !== 'undefined') {
            const timer = setTimeout(() => {
                router.push("/mission-control");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentMission, router]);

    const getAudienceSummary = useCallback(() => {
        if (!currentMission) return "Simulation Environment";
        const ref = currentMission.config.targeting_refinement;
        if (!ref) return currentMission.config.target_audience;

        const tags = [
            ref.gender,
            ref.age_group,
            ref.urbanization,
            ref.revenue_group
        ].filter(t => t && t !== 'Any' && t !== 'Regardless' && t !== 'Mixed');

        return tags.length > 0 ? tags.join(' · ').toUpperCase() : currentMission.config.target_audience;
    }, [currentMission]);

    if (!currentMission) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-6">
                    <Activity className="w-12 h-12 text-emerald-500 animate-pulse" />
                    <div className="text-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.3em] mb-2">Protocol Interrupted</h1>
                        <p className="text-slate-500 text-sm font-medium">No active Mission Sentinel detected. Redirecting to initialization...</p>
                    </div>
                </div>
            </div>
        );
    }

    const goNext = () => {
        if (currentStep < STEPS.length - 1 && canProceed()) {
            setCurrentStep((s) => s + 1);
        }
    };
    const goBack = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-teal-500/30 font-sans">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Lab Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/os"
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to SURVEY OS
                        </Link>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                                <FlaskConical size={18} className="text-teal-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-lg font-black tracking-tight text-white uppercase italic">
                                        Survey Stress Test Lab
                                    </h1>
                                    {currentMission && (
                                        <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                                            {COUNTRIES.find(c => c.id === currentMission.config.target_country)?.code ? (
                                                <img
                                                    src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.id === currentMission.config.target_country)?.code}.png`}
                                                    alt=""
                                                    className="w-4 h-3 rounded-[2px] object-cover"
                                                />
                                            ) : (
                                                <Globe size={12} className="text-teal-400 opacity-60" />
                                            )}
                                            <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
                                                {currentMission.config.target_country}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-0.5">
                                    {currentMission ? getAudienceSummary() : "Simulation Environment"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5">
                        <Activity size={12} className="text-teal-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Bio-Digital Uplink</span>
                    </div>
                </div>
            </header>

            {/* Step Progress Bar - Redesigned for Premium Look */}
            <div className="fixed top-20 left-0 right-0 z-40 bg-slate-950/30 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-center gap-4 overflow-x-auto scrollbar-none">
                    {STEPS.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => {
                                    if (i < currentStep) setCurrentStep(i);
                                }}
                                disabled={i > currentStep}
                                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap group ${i === currentStep
                                    ? "bg-teal-500 text-white shadow-[0_0_30px_rgba(20,184,166,0.3)] scale-105"
                                    : i < currentStep
                                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20"
                                        : "bg-slate-900/50 text-slate-600 border border-white/5 cursor-not-allowed"
                                    }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black italic transition-colors ${i === currentStep
                                        ? "bg-white/20"
                                        : i < currentStep
                                            ? "bg-teal-400/20"
                                            : "bg-slate-800"
                                        }`}
                                >
                                    {i < currentStep ? "✓" : `0${i + 1}`}
                                </span>
                                {step.label}
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px w-8 ${i < currentStep ? "bg-teal-500/30" : "bg-white/5"}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-[160px] pb-32 min-h-screen relative z-10">
                <div className="max-w-[1600px] mx-auto px-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {currentStep === 0 && (
                                <ContextStep context={context} setContext={setContext} />
                            )}
                            {currentStep === 1 && (
                                <QuestionsStep
                                    context={context}
                                    questions={questions}
                                    setQuestions={setQuestions}
                                />
                            )}
                            {currentStep === 2 && (
                                <PersonasStep
                                    context={context}
                                    personas={personas}
                                    setPersonas={setPersonas}
                                />
                            )}
                            {currentStep === 3 && (
                                <SimulationStep
                                    personas={personas}
                                    questions={questions}
                                    results={results}
                                    setResults={setResults}
                                    isSimulating={isSimulating}
                                    setIsSimulating={setIsSimulating}
                                    onComplete={() => setCurrentStep(4)}
                                />
                            )}
                            {currentStep === 4 && (
                                <ResultsStep
                                    results={results}
                                    questions={questions}
                                    personas={personas}
                                />
                            )}
                            {currentStep === 5 && (
                                <ReportStep
                                    context={context}
                                    results={results}
                                    questions={questions}
                                    personas={personas}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Navigation - Premium Glass Box */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 py-6">
                <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group ${currentStep === 0
                            ? "text-slate-700 cursor-not-allowed"
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-white/10"
                            }`}
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            {[...Array(STEPS.length)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? "w-8 bg-teal-500" : i < currentStep ? "w-4 bg-teal-500/40" : "w-4 bg-slate-800"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
                            Phase {currentStep + 1} <span className="text-slate-800 mx-2">/</span> {STEPS[currentStep].description}
                        </div>
                    </div>

                    {currentStep < STEPS.length - 1 && currentStep !== 3 ? (
                        <button
                            onClick={goNext}
                            disabled={!canProceed()}
                            className={`flex items-center gap-3 px-12 py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all group ${canProceed()
                                ? "bg-teal-500 text-white hover:bg-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.4)]"
                                : "bg-slate-900 text-slate-700 border border-white/5 cursor-not-allowed"
                                }`}
                        >
                            Continue
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : currentStep === 3 ? (
                        <div className="flex items-center gap-3 px-8 py-4 rounded-[1.25rem] bg-teal-500/10 border border-teal-500/20">
                            <Activity size={14} className="text-teal-400 animate-pulse" />
                            <span className="text-[11px] font-black text-teal-400 uppercase tracking-[0.2em]">
                                {isSimulating
                                    ? "Simulation in Progress"
                                    : results.length > 0
                                        ? "Simulation Complete"
                                        : "Awaiting Launch"}
                            </span>
                        </div>
                    ) : (
                        <Link
                            href="/mission-control"
                            className="flex items-center gap-3 px-12 py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] bg-white text-slate-950 hover:bg-teal-50 transition-all shadow-xl shadow-white/5"
                        >
                            Back to Bureau
                            <ArrowLeft size={16} className="rotate-180" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
