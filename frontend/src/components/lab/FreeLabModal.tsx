"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    FlaskConical,
    Target,
    FileQuestion,
    Users,
    Zap,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Plus,
    Trash2,
    Search,
    Sparkles,
    ShieldCheck,
    AlertTriangle,
    ArrowRightLeft,
    TrendingUp,
    Briefcase,
    MapPin,
    UserCircle,
    Fingerprint
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Persona {
    name: string;
    age: number;
    location: string;
    occupation: string;
    traits: string;
}

interface SimulationResult {
    Agent: string;
    Demographic: string;
    [key: string]: string;
}

interface QuestionAnalysis {
    original_question: string;
    quality_score: number;
    risk_level: string;
    issues_identified: string[];
    diagnostic_evidence: string;
    rewritten_question: string;
    rewrite_rationale: string;
    predicted_improvement: string;
}

interface BureauReport {
    executive_summary: string;
    overall_risk_level: string;
    quality_score: number;
    question_analysis: QuestionAnalysis[];
    bureau_verdict: string;
}

interface FreeLabModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FreeLabModal({ isOpen, onClose }: FreeLabModalProps) {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [context, setContext] = useState("");
    const [questions, setQuestions] = useState<string[]>([""]);
    const [audience, setAudience] = useState({
        country: "Mauritius",
        gender: "All",
        ageRange: "18-65+"
    });
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
    const [results, setResults] = useState<SimulationResult[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [report, setReport] = useState<BureauReport | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Reset everything when closing
    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setContext("");
            setQuestions([""]);
            setPersonas([]);
            setResults([]);
            setReport(null);
        }
    }, [isOpen]);

    const handleAddQuestion = () => {
        if (questions.length < 3) {
            setQuestions([...questions, ""]);
        }
    };

    const handleRemoveQuestion = (index: number) => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const generatePersonas = async () => {
        setIsGeneratingPersonas(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("CRITICAL: NEXT_PUBLIC_API_URL is not defined in environment variables.");
        }
        try {
            const resp = await fetch(`${apiUrl}/generate_personas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    count: 10, // Tier 1 limit
                    context: `Topic: ${context}. Audience: ${audience.gender}, Age ${audience.ageRange} in ${audience.country}.`,
                }),
            });
            const data = await resp.json();
            if (Array.isArray(data)) setPersonas(data);
            setStep(3);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGeneratingPersonas(false);
        }
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const resp = await fetch(`${apiUrl}/simulate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    demographics: personas,
                    questions: questions.filter(q => q.trim()),
                }),
            });
            const data = await resp.json();
            const simResults = data.results || data;
            setResults(simResults);

            // Immediately start report generation
            generateReport(simResults);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSimulating(false);
        }
    };

    const generateReport = async (simResults: SimulationResult[]) => {
        setIsGeneratingReport(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const resp = await fetch(`${apiUrl}/analyze_results`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context,
                    questions: questions.filter(q => q.trim()),
                    results: simResults,
                }),
            });
            const data = await resp.json();
            setReport(data);
            setStep(4);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0: // Audience (NOW FIRST)
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Target Audience</h3>
                            <p className="text-sm text-slate-500 font-medium italic">Calibration for 10 diagnostic personas.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Target Market / Country</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={audience.country}
                                        onChange={(e) => setAudience({ ...audience, country: e.target.value })}
                                        placeholder="e.g., United Kingdom, Mauritius, USA..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                    />
                                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Gender Focus</label>
                                    <select
                                        value={audience.gender}
                                        onChange={(e) => setAudience({ ...audience, gender: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                                    >
                                        <option>All</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Age Group</label>
                                    <select
                                        value={audience.ageRange}
                                        onChange={(e) => setAudience({ ...audience, ageRange: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                                    >
                                        <option>18-65+</option>
                                        <option>18-24</option>
                                        <option>25-34</option>
                                        <option>35-44</option>
                                        <option>45-54</option>
                                        <option>55+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                <Fingerprint size={18} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Diagnostic Calibration</h4>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                                    I will calibrate 10 unique synthetic respondents grounded in the specific cultural and social context of your selected market.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            disabled={!audience.country.trim()}
                            className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${audience.country.trim()
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            Next: Research Context
                            <ChevronRight size={14} />
                        </button>
                    </div>
                );
            case 1: // Context (SECOND)
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">What are you researching?</h3>
                            <p className="text-sm text-slate-500 font-medium italic">Defined contexts yield sharper diagnostics.</p>
                        </div>
                        <div className="relative">
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="e.g., We are testing a new sustainability message for a beverage brand targeting young professionals..."
                                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                            />
                            <div className="absolute top-4 right-4 text-blue-600">
                                <Target size={20} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(0)}
                                className="px-6 py-4 rounded-full border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                disabled={context.trim().length < 10}
                                className={`flex-1 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${context.trim().length >= 10
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                Next: Define Questions
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                );
            case 2: // Questions (THIRD)
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-black text-slate-900">Your Survey Questions</h3>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">TIER 1: MAX 3</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium italic">Input up to 3 questions for a structural audit.</p>
                        </div>
                        <div className="space-y-3">
                            {questions.map((q, i) => (
                                <div key={i} className="group relative">
                                    <input
                                        value={q}
                                        onChange={(e) => handleQuestionChange(i, e.target.value)}
                                        placeholder={`Question ${i + 1}...`}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                        <FileQuestion size={18} />
                                    </div>
                                    {questions.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveQuestion(i)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {questions.length < 3 && (
                                <button
                                    onClick={handleAddQuestion}
                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs uppercase hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} /> Add Question
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-4 rounded-full border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={generatePersonas}
                                disabled={questions.some(q => !q.trim()) || isGeneratingPersonas}
                                className={`flex-1 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${questions.every(q => q.trim())
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                {isGeneratingPersonas ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} /> Deploy Agents</>}
                            </button>
                        </div>
                    </div>
                );
            case 3: // Simulation
                return (
                    <div className="space-y-6 text-center py-10">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 mx-auto bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 relative mb-8"
                        >
                            <Zap size={40} className="text-white" />
                        </motion.div>

                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Simulating Responses...</h3>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">10 Diagnostic Lenses Deploying in {audience.country}</p>
                        </div>

                        <div className="max-w-xs mx-auto space-y-2 pt-4">
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Agent Calibration</span>
                                <span className="text-blue-600">{isSimulating ? "deploying..." : "100%"}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                    className="h-full bg-blue-600 rounded-full"
                                />
                            </div>
                        </div>

                        {!isSimulating && results.length === 0 && (
                            <button
                                onClick={runSimulation}
                                className="mt-8 px-12 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all"
                            >
                                Start Simulation
                            </button>
                        )}

                        {(isSimulating || isGeneratingReport) && (
                            <div className="flex flex-col items-center gap-3 mt-8">
                                <div className="flex items-center gap-3">
                                    <Loader2 size={16} className="text-blue-600 animate-spin" />
                                    <span className="text-xs font-bold text-slate-500 italic">Processing high-fidelity responses...</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
                                    {personas.map((p, i) => (
                                        <div key={i} className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 4: // Results (FULL LAB LOOKALIKKE)
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-blue-600" />
                                    Intelligence Report
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">n=10 Respondents • {audience.country}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bureau Score</div>
                                <div className="text-2xl font-black text-blue-600">{report?.quality_score}/100</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp size={14} className="text-blue-600" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Executive Summary</h4>
                            </div>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                &quot;{report?.executive_summary}&quot;
                            </p>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Structural Analysis & Rewrites</h4>
                                <div className="space-y-3">
                                    {report?.question_analysis.map((qa, i) => (
                                        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                                    <span className="text-[10px] font-black text-slate-400">Q{i + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-900 leading-relaxed mb-2">{qa.original_question}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {qa.issues_identified.map((issue, j) => (
                                                            <span key={j} className="text-[9px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                                <AlertTriangle size={8} /> {issue}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mt-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2 text-emerald-600">
                                                        <CheckCircle2 size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">AVA's Rewrite</span>
                                                    </div>
                                                    <span className="text-emerald-600 text-[10px] font-black bg-emerald-100 px-2 py-0.5 rounded-full">+{qa.predicted_improvement}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 leading-relaxed mb-2">&quot;{qa.rewritten_question}&quot;</p>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{qa.rewrite_rationale}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                            <div className="relative z-10">
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">Bureau Verdict</h4>
                                <p className="text-sm font-bold text-slate-300">&quot;{report?.bureau_verdict}&quot;</p>
                            </div>
                            <button
                                onClick={() => window.location.href = '#pricing'}
                                className="relative z-10 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                            >
                                Upgrade for PDF Export
                            </button>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <FlaskConical size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black tracking-tight text-slate-900">FREE SIMULATION LAB</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <ShieldCheck size={10} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bureau Sandbox Protocol</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="px-8 pt-6">
                            <div className="flex items-center gap-1.5">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= i ? "bg-blue-600" : "bg-slate-100"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-8 overflow-y-auto flex-1 scrollbar-thin">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer Info */}
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Frictionless Trial Protocol v1.0</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-slate-400">Live Diagnostics</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-bold text-slate-400">AVA Grounded</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
