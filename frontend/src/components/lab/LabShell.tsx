"use client";
import React, { useState, useCallback, useEffect } from "react";
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
import { useLanguage } from "@/context/LanguageContext";
import { useMission } from "@/context/MissionContext";


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

const getSteps = (t: any) => [
    {
        id: "context",
        label: t.lab_ui.steps.context.label,
        icon: <Target size={16} />,
        description: t.lab_ui.steps.context.desc,
    },
    {
        id: "questions",
        label: t.lab_ui.steps.questions.label,
        icon: <FileQuestion size={16} />,
        description: t.lab_ui.steps.questions.desc,
    },
    {
        id: "personas",
        label: t.lab_ui.steps.personas.label,
        icon: <Users size={16} />,
        description: t.lab_ui.steps.personas.desc,
    },
    {
        id: "simulate",
        label: t.lab_ui.steps.simulate.label,
        icon: <Zap size={16} />,
        description: t.lab_ui.steps.simulate.desc,
    },
    {
        id: "results",
        label: t.lab_ui.steps.results.label,
        icon: <BarChart3 size={16} />,
        description: t.lab_ui.steps.results.desc,
    },
    {
        id: "report",
        label: t.lab_ui.steps.report.label,
        icon: <FileText size={16} />,
        description: t.lab_ui.steps.report.desc,
    },
];

export default function LabShell() {
    const { t } = useLanguage();
    const { currentMission } = useMission();
    const STEPS = getSteps(t);
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

    if (!currentMission) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Loading Mission Protocol...</h1>
                    <p className="text-slate-400">If this persists, please return to Mission Control.</p>
                    <Link href="/mission-control" className="mt-8 inline-block px-6 py-3 bg-emerald-600 rounded-lg">
                        Return to Base
                    </Link>
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
        <div className="min-h-screen bg-white text-slate-900">
            {/* Lab Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            <ArrowLeft size={14} />
                            {t.lab_ui.back_to_bureau}
                        </Link>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <FlaskConical size={14} className="text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black tracking-tight">
                                    {t.lab_ui.header_title}
                                    {currentMission && (
                                        <span className="ml-2 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[9px] uppercase tracking-tighter">
                                            {currentMission.config.target_country} Research
                                        </span>
                                    )}
                                </h1>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    {currentMission ? currentMission.config.target_audience : t.lab_ui.header_sub}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        {t.lab_ui.header_shield}
                    </div>
                </div>
            </header>

            {/* Step Progress Bar */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-slate-50/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
                    {STEPS.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => {
                                    if (i < currentStep) setCurrentStep(i);
                                }}
                                disabled={i > currentStep}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${i === currentStep
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                                    : i < currentStep
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-pointer hover:bg-emerald-100"
                                        : "bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed"
                                    }`}
                            >
                                <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${i === currentStep
                                        ? "bg-white/20"
                                        : i < currentStep
                                            ? "bg-emerald-100"
                                            : "bg-slate-100"
                                        }`}
                                >
                                    {i < currentStep ? "✓" : i + 1}
                                </span>
                                {step.label}
                            </button>
                            {i < STEPS.length - 1 && (
                                <ChevronRight
                                    size={12}
                                    className={`shrink-0 ${i < currentStep ? "text-emerald-500/30" : "text-slate-200"
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
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${currentStep === 0
                            ? "text-slate-200 cursor-not-allowed"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                            }`}
                    >
                        <ChevronLeft size={14} />
                        {t.lab_ui.back}
                    </button>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {t.lab_ui.step_label} {currentStep + 1} {t.lab_ui.of} {STEPS.length} •{" "}
                        {STEPS[currentStep].description}
                    </div>

                    {currentStep < STEPS.length - 1 && currentStep !== 3 ? (
                        <button
                            onClick={goNext}
                            disabled={!canProceed()}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${canProceed()
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl"
                                : "bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed"
                                }`}
                        >
                            {t.lab_ui.continue}
                            <ChevronRight size={14} />
                        </button>
                    ) : currentStep === 3 ? (
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            {isSimulating
                                ? t.lab_ui.sim_in_progress
                                : results.length > 0
                                    ? t.lab_ui.sim_complete
                                    : t.lab_ui.sim_launch}
                        </div>
                    ) : (
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
                        >
                            {t.lab_ui.back_to_bureau}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
