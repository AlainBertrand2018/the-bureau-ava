"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Users,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    FileText,
    CheckCircle2,
    Activity,
    Lock,
    Compass,
    Cpu,
    FlaskConical,
    Eye,
    Printer,
    ClipboardList
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMission } from "@/context/MissionContext";

export default function SurveyArchitect() {
    const { t } = useLanguage();
    const { currentMission } = useMission();
    const [view, setView] = useState<"onboarding" | "processing" | "results">("onboarding");
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [formData, setFormData] = useState({
        objective: "",
        audience: "",
        decisions: ""
    });
    const [result, setResult] = useState<any>(null);

    const PHASES = [
        t.architect.pulse_generating,
        t.architect.pulse_auditing,
        t.architect.pulse_refining,
        t.architect.pulse_simulating,
        t.architect.pulse_finalizing
    ];

    const handleGenerate = async () => {
        if (!formData.objective || !formData.audience || !formData.decisions) return;

        setView("processing");
        setLoadingPhase(0);

        const phaseTimer = setInterval(() => {
            setLoadingPhase(prev => (prev < 4 ? prev + 1 : prev));
        }, 6000);

        try {
            const context = `Objective: ${formData.objective} | Audience: ${formData.audience} | Decisions: ${formData.decisions}`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 300000); // 5 min timeout

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/architect/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context,
                    item_count: 20,
                    mission_id: currentMission?.mission_id
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.detail || "Server error");
            }

            const data = await response.json();

            clearInterval(phaseTimer);
            setResult(data);
            setView("results");
        } catch (error) {
            console.error(error);
            setView("onboarding");
            clearInterval(phaseTimer);
        }
    };



    return (
        <div className="min-h-[600px] w-full max-w-5xl mx-auto rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <AnimatePresence mode="wait">
                {view === "onboarding" && (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 p-8 md:p-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                    <Sparkles size={12} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                        {t.architect.badge}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">
                                    {t.architect.title}
                                </h2>
                                <p className="text-slate-400 font-medium max-w-md">
                                    {t.architect.sub}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
                                <Lock size={12} className="text-emerald-500" />
                                {t.lab_ui.header_shield}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Step 1: Objective */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
                                        <Target size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-100 font-bold text-sm tracking-tight">{t.architect.onboarding.step1}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{t.architect.onboarding.step1_desc}</p>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.objective}
                                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                    placeholder={t.architect.onboarding.placeholder_obj}
                                    className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none font-medium"
                                />
                            </div>

                            {/* Step 2: Audience */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 border border-white/5 shadow-inner">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-100 font-bold text-sm tracking-tight">{t.architect.onboarding.step2}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{t.architect.onboarding.step2_desc}</p>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.audience}
                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                    placeholder={t.architect.onboarding.placeholder_aud}
                                    className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none font-medium"
                                />
                            </div>

                            {/* Step 3: Decisions */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 border border-white/5 shadow-inner">
                                        <Compass size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-100 font-bold text-sm tracking-tight">{t.architect.onboarding.step3}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{t.architect.onboarding.step3_desc}</p>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.decisions}
                                    onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                                    placeholder={t.architect.onboarding.placeholder_dec}
                                    className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none font-medium"
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={!formData.objective || !formData.audience || !formData.decisions}
                                className={`group flex items-center gap-3 px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 ${formData.objective && formData.audience && formData.decisions
                                    ? "bg-white text-slate-900 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
                                    : "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                {t.architect.cta_generate}
                                <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {view === "processing" && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-[600px] p-12 text-center"
                    >
                        <div className="relative mb-12">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="w-32 h-32 rounded-full border-t-2 border-r-2 border-blue-500 opacity-20"
                            />
                            <motion.div
                                animate={{
                                    rotate: -360,
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute inset-2 rounded-full border-b-2 border-emerald-500 opacity-20"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu size={40} className="text-white opacity-80" />
                            </div>
                        </div>

                        <div className="space-y-6 max-w-md">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                                {t.architect.cta_generating}
                            </h3>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={loadingPhase}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-xl font-bold text-slate-200"
                                >
                                    {PHASES[loadingPhase]}
                                </motion.p>
                            </AnimatePresence>

                            <div className="flex items-center justify-center gap-1.5 pt-4">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-1000 ${i <= loadingPhase ? "w-8 bg-blue-500" : "w-2 bg-slate-800"
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-[11px] text-slate-500 font-medium text-center leading-relaxed max-w-sm mx-auto mt-6">
                                I am stress-testing your research instrument across 5 diagnostic personas, recursively auditing and refining each item until it meets the Bureau&apos;s Gold Standards.
                            </p>
                        </div>

                    </motion.div>
                )}

                {view === "results" && result && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 p-8 md:p-12 flex flex-col h-full max-h-[800px]"
                    >
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">{t.architect.result.title}</h2>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                        <Activity size={10} className="text-emerald-500" />
                                        {t.architect.result.certified} • {result.certified_by}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const win = window.open("", "_blank");
                                        if (win) {
                                            win.document.write(result.formatted_report || "<html><body><h1>Report Generating...</h1></body></html>");
                                            win.document.close();
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-800 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors border border-blue-500/20 active:scale-95"
                                    title="View Full Certificate"
                                >
                                    <Eye size={14} /> View
                                </button>
                                <button
                                    onClick={() => {
                                        const win = window.open("", "_blank");
                                        if (win) {
                                            win.document.write(result.formatted_report || "<html><body><h1>Report Generating...</h1></body></html>");
                                            win.document.close();
                                            setTimeout(() => win.print(), 800);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors border border-white/5 active:scale-95 shadow-lg shadow-blue-500/20"
                                    title="Download as PDF"
                                >
                                    <Printer size={14} /> PDF
                                </button>
                                <button
                                    onClick={() => {
                                        const win = window.open("", "_blank");
                                        if (win) {
                                            win.document.write(result.field_instrument_html || "<html><body><h1>Field Instrument Unavailable</h1></body></html>");
                                            win.document.close();
                                            setTimeout(() => win.print(), 800);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors border border-emerald-500/20 active:scale-95"
                                    title="Download Field Tool"
                                >
                                    <ClipboardList size={14} /> Field Tool
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-hidden">
                            {/* Left: Questionnaire */}
                            <div className="lg:col-span-7 space-y-4 overflow-y-auto pr-4 custom-scrollbar max-h-[500px]">
                                {(result?.instrument || []).map((q: string, i: number) => {
                                    const justification = result?.simulation_report?.question_justifications?.[i];
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
                                        >
                                            <div className="flex gap-4">
                                                <span className="text-[10px] font-black text-blue-500/50 pt-1">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div className="space-y-3 w-full">
                                                    <p className="text-sm font-bold text-slate-200 leading-relaxed">
                                                        {q}
                                                    </p>
                                                    {justification && (
                                                        <div className="pt-3 border-t border-white/5 space-y-2">
                                                            <div className="flex items-start gap-2">
                                                                <ShieldCheck size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                                                    <span className="text-emerald-500 font-black uppercase tracking-wider mr-1">Methodology:</span>
                                                                    {justification.design_rationale}
                                                                </p>
                                                            </div>
                                                            {justification.validation_confirmed && (
                                                                <div className="flex items-start gap-2 pl-5">
                                                                    <span className="text-blue-500 text-[10px] mt-0.5">↳</span>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                                                        Verified: "{justification.validation_confirmed}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Right: Rationale & Manual */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                                        <FlaskConical size={14} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">{t.architect.result.rationale_title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        "{result?.strategic_rationale || "Strategic synthesis complete."}"
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-slate-800/30 border border-white/5">
                                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                                        <FileText size={14} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">{t.architect.result.manual_title}</h4>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">{t.architect.result.best_practices}</p>
                                            <ul className="space-y-2">
                                                {(result?.field_manual?.deployment_best_practices || []).map((bp: string, i: number) => (
                                                    <li key={i} className="flex gap-2 text-[11px] text-slate-300 font-medium">
                                                        <span className="text-blue-500">•</span>
                                                        {bp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t.architect.result.outcomes}</p>
                                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                                                {result?.field_manual?.potential_outcomes || "High-fidelity research data anticipated."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Scientific Disclosure Footer Card */}
                                <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-[0.2em] leading-relaxed">
                                        {result?.field_manual?.scientific_disclosure || "Bureau Certified Methodology Statement"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Simulation Report Strip */}
                        {result?.simulation_report && (
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity size={16} className="text-blue-500" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
                                        {t.architect.result.prediction_title}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Executive Summary</p>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {result.simulation_report.executive_summary}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Field Deployment Protocol</p>
                                        <ul className="space-y-2">
                                            {(result.simulation_report.field_deployment_protocol || result.simulation_report.next_steps || []).slice(0, 3).map((step: any, i: number) => (
                                                <li key={i} className="flex gap-2 text-[10px] text-slate-400 font-medium">
                                                    <span className="text-emerald-500">→</span>
                                                    {typeof step === "string" ? step : step?.step || step?.recommendation || JSON.stringify(step)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Demographic Validation</p>
                                        <div className="space-y-3">
                                            {(result.simulation_report.demographic_insights || []).slice(0, 2).map((insight: any, i: number) => (
                                                <div key={i}>
                                                    <p className="text-[10px] font-bold text-blue-400">{insight.segment}</p>
                                                    <p className="text-[9px] text-slate-500 mt-0.5">{insight.finding}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reset / New Creation */}
                        <div className="mt-auto pt-8 flex justify-center">
                            <button
                                onClick={() => setView("onboarding")}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                ← New Genesis Simulation
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
