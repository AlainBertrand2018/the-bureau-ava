"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    FlaskConical,
    ChevronRight,
    ChevronLeft,
    Zap,
    Users,
    FileQuestion,
    BarChart3,
    Target,
    ShieldCheck,
    FileText,
} from "lucide-react";
import ContextStep from "./ContextStep";
import QuestionsStep from "./QuestionsStep";
import PersonasStep from "./PersonasStep";
import SimulationStep from "./SimulationStep";
import ResultsStep from "./ResultsStep";
import ReportStep from "./ReportStep";


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
        label: "Mission Brief",
        icon: <Target size={16} />,
        description: "Define your survey context",
    },
    {
        id: "questions",
        label: "Questionnaire",
        icon: <FileQuestion size={16} />,
        description: "Submit your questions for audit",
    },
    {
        id: "personas",
        label: "Sample (n)",
        icon: <Users size={16} />,
        description: "Set sample size & generate respondents",
    },
    {
        id: "simulate",
        label: "Dry Run",
        icon: <Zap size={16} />,
        description: "Run diagnostic simulation",
    },
    {
        id: "results",
        label: "Diagnostics",
        icon: <BarChart3 size={16} />,
        description: "Review diagnostic findings",
    },
    {
        id: "report",
        label: "Bureau Report",
        icon: <FileText size={16} />,
        description: "Mitigation & redressment",
    },
];

export default function LabShell() {
    const [currentStep, setCurrentStep] = useState(0);
    const [context, setContext] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [results, setResults] = useState<SimulationResult[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

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

    const goNext = () => {
        if (currentStep < STEPS.length - 1 && canProceed()) {
            setCurrentStep((s) => s + 1);
        }
    };
    const goBack = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Lab Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            <ArrowLeft size={14} />
                            Bureau
                        </Link>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <FlaskConical size={14} className="text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black tracking-tight">
                                    SIMULATION LAB
                                </h1>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    Pre-Flight Validation Engine
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Zero PII • Synthetic Only • Census-Weighted
                    </div>
                </div>
            </header>

            {/* Step Progress Bar */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
                    {STEPS.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => {
                                    if (i < currentStep) setCurrentStep(i);
                                }}
                                disabled={i > currentStep}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${i === currentStep
                                    ? "bg-primary text-white shadow-lg shadow-blue-500/30"
                                    : i < currentStep
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20"
                                        : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                                    }`}
                            >
                                <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${i === currentStep
                                        ? "bg-white/20"
                                        : i < currentStep
                                            ? "bg-emerald-500/20"
                                            : "bg-white/5"
                                        }`}
                                >
                                    {i < currentStep ? "✓" : i + 1}
                                </span>
                                {step.label}
                            </button>
                            {i < STEPS.length - 1 && (
                                <ChevronRight
                                    size={12}
                                    className={`shrink-0 ${i < currentStep ? "text-emerald-500/50" : "text-white/10"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-[136px] pb-24 min-h-screen">
                <div className="max-w-[1600px] mx-auto px-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
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

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${currentStep === 0
                            ? "text-slate-700 cursor-not-allowed"
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-white/10"
                            }`}
                    >
                        <ChevronLeft size={14} />
                        Back
                    </button>

                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        Step {currentStep + 1} of {STEPS.length} •{" "}
                        {STEPS[currentStep].description}
                    </div>

                    {currentStep < STEPS.length - 1 && currentStep !== 3 ? (
                        <button
                            onClick={goNext}
                            disabled={!canProceed()}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${canProceed()
                                ? "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl"
                                : "bg-white/5 text-slate-700 cursor-not-allowed"
                                }`}
                        >
                            Continue
                            <ChevronRight size={14} />
                        </button>
                    ) : currentStep === 3 ? (
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            {isSimulating
                                ? "Simulation in progress..."
                                : results.length > 0
                                    ? "Complete — Proceed ↑"
                                    : "Launch simulation above"}
                        </div>
                    ) : (
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
                        >
                            Back to Bureau
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
