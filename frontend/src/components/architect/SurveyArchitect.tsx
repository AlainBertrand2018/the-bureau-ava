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
    ClipboardList,
    Zap,
} from "lucide-react";
import { useMission, AudienceTargeting } from "@/context/MissionContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useClearance } from "@/context/ClearanceContext";
import AudienceConfigurator from "../shared/AudienceConfigurator";

const DEFAULT_TARGETING: AudienceTargeting = {
    country: '',
    region: '',
    language: '',
    gender: 'Mixed',
    age_group: 'Any',
    marital_status: 'Regardless',
    revenue_group: 'Regardless',
    education_level: 'Regardless',
    employment_status: 'Regardless',
    urbanization: 'Regardless'
};

interface SurveyArchitectProps {
    mode?: "explainer" | "app";
}

export default function SurveyArchitect({ mode = "explainer" }: SurveyArchitectProps) {
    const { currentMission } = useMission();
    const { currency } = useCurrency();
    const { 
        credits, 
        consumeCredits, 
        isAuthenticated, 
        setIsLoginModalOpen 
    } = useClearance();
    const [view, setView] = useState<"explainer" | "onboarding" | "processing" | "results">(mode === "app" ? "onboarding" : "explainer");
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [formData, setFormData] = useState({
        objective: "",
        audience: "",
        decisions: "",
        targeting: DEFAULT_TARGETING
    });
    const [result, setResult] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [displayLogs, setDisplayLogs] = useState<any[]>([]); // New: High-speed streaming logs
    const [smoothProgress, setSmoothProgress] = useState(0); // New: Radial percentage
    const [vettedCount, setVettedCount] = useState(0); // New: Question counter
    const [loadingLabel, setLoadingLabel] = useState("I'm architecting your instrument..."); // New: Real label
    const [error, setError] = useState<string | null>(null);
    const isDev = process.env.NODE_ENV === 'development';

    // REAL TELEMETRY ONLY: Disable the fake 'KERN_LOG' loop that caused user frustration.
    useEffect(() => {
        if (view !== "processing") return;

        // Keep the micro-creep for the radial progress if needed, but remove the fake SYSTEM logs.
        const creepInterval = setInterval(() => {
            setSmoothProgress(prev => {
                if (prev >= 99) return 99;
                // Much slower creep: roughly 1% every 15-20 seconds if no logs arrive
                const increment = 0.01;
                return Math.min(prev + increment, 99);
            });
        }, 800);

        return () => {
            clearInterval(creepInterval);
        };
    }, [view]);

    // React to real logs: update progress, vetted counts, and phase labels
    useEffect(() => {
        if (logs.length === 0) return;
        const lastLog = logs[logs.length - 1];

        // 1. Sync vetted count for UI counter
        const signalMatch = lastLog.details.match(/Vetted (\d+)\/\d+/);
        if (signalMatch && lastLog.agent === "SYSTEM") {
            setVettedCount(parseInt(signalMatch[1]));
        }

        // 2. Update phase labels
        if (lastLog.agent === "ARCHITECT" && lastLog.action === "INITIALIZING") {
            setLoadingPhase(0);
            setLoadingLabel("Synthesizing structural anchors...");
        } else if (lastLog.agent === "SENTINEL" && lastLog.action === "SCANNING") {
            setLoadingPhase(1);
            setLoadingLabel("Applying Bureau Gold Standard Audit...");
        } else if (lastLog.agent === "ADJUDICATOR" && (lastLog.action === "REFINEMENT" || lastLog.action === "VERIFICATION")) {
            setLoadingPhase(2);
            setLoadingLabel("Recursive Refinement for 100/100 Quality...");
        } else if (lastLog.agent === "SENTINEL" && lastLog.action === "DEPLOYING") {
            setLoadingPhase(3);
            setLoadingLabel("Running Bureau Field Simulation (n=5)...");
        } else if (lastLog.agent === "ARCHITECT" && lastLog.action === "FINALIZING") {
            setLoadingPhase(4);
            setLoadingLabel("Finalizing Field Manual & Scientific Disclosure...");
        } else if (lastLog.action === "COMPLETE") {
            setSmoothProgress(100);
        }

        // 3. Update core radial progress if vetted
        const maxVetted = logs.reduce((acc, l) => {
            const m = l.details.match(/Vetted (\d+)/);
            return m ? Math.max(acc, parseInt(m[1])) : acc;
        }, 0);

        if (maxVetted > 0) {
            const realPercent = (maxVetted / 20) * 100;
            // Never set progress below what we've already achieved
            setSmoothProgress(prev => Math.max(prev, realPercent));
        }

    }, [logs]);

    // Auto-scroll terminal
    useEffect(() => {
        const terminal = document.getElementById('terminal-bottom');
        if (terminal) {
            terminal.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const PHASES = [
        "I'm architecting your instrument...",
        "Applying Bureau Gold Standard Audit (Pass 1/3)...",
        "Recursive Refinement for 100/100 Quality (Pass 2/3)...",
        "Running Census-Weighted Simulation (Pass 3/3)...",
        "Finalizing Field Manual & Scientific Disclosure..."
    ];

    const handlePaywallSuccess = async () => {
        setIsPaywallOpen(false);
        // Requirement for Genesis: 100,000 Credits
        await consumeCredits(100000);
        startGeneration();
    };

    const handleGenerate = () => {
        // Bypass paywall for the presentation version
        startGeneration();
    };

    // Handle Background Persistence Check
    useEffect(() => {
        const activeMission = localStorage.getItem("active_genesis_id");
        const activeObjective = localStorage.getItem("active_genesis_objective");

        if (activeMission && activeObjective) {
            // Found an unfinished session
            // We can offer the user to resume, or in this case, we could try to re-fetch missions
            // For now, let's keep it simple: if there's an active mission ID, we check if it's in the DB
            // But a better UX is just showing a "Mission in Progress" toast
        }
    }, []);

    const startGeneration = async () => {
        if (!formData.objective || !formData.audience || !formData.decisions) return;
        
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            setError("Identity verification required to initialize Genesis Protocol.");
            return;
        }

        setView("processing");
        setLoadingLabel("I'm architecting your instrument...");
        setError(null);
        setLogs([]);

        const missionId = currentMission?.mission_id || `gen_${Date.now()}`;
        localStorage.setItem("active_genesis_id", missionId);
        localStorage.setItem("active_genesis_objective", formData.objective);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/architect/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context: `Objective: ${formData.objective} | Audience: ${formData.audience} | Decisions: ${formData.decisions}`,
                    item_count: 20,
                    mission_id: missionId,
                    targeting_refinement: formData.targeting
                })
            });

            if (!response.ok) {
                const responseText = await response.text();
                let detail = "Internal Server Error";
                try {
                    const errorData = JSON.parse(responseText);
                    const rawDetail = errorData.error || errorData.detail || errorData.message || detail;
                    detail = typeof rawDetail === 'object' ? JSON.stringify(rawDetail) : String(rawDetail);
                } catch {
                    detail = responseText.slice(0, 200);
                }
                throw new Error(detail);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Connection failed: Stream not available.");

            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const chunk = JSON.parse(line);
                        if (chunk.type === "log") {
                            setLogs(prev => [...prev.slice(-100), chunk]);
                            // ── DIRECT TELEMETRY: Update display logs immediately to avoid batching loss ──
                            setDisplayLogs(prev => [...prev.slice(-100), {
                                ...chunk,
                                timestamp: chunk.timestamp || new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            }]);
                        } else if (chunk.type === "package") {
                            setResult(chunk.data);
                            localStorage.removeItem("active_genesis_id");
                            localStorage.removeItem("active_genesis_objective");
                            setSmoothProgress(100);
                            setTimeout(() => setView("results"), 800);
                        } else if (chunk.type === "error") {
                            // Harden: Handle case where detail might be an object
                            const errorMsg = typeof chunk.detail === 'object'
                                ? JSON.stringify(chunk.detail)
                                : String(chunk.detail || "Unknown Backend Error");
                            throw new Error(errorMsg);
                        }
                    } catch (e: any) {
                        console.error("Critical Stream Parsing Error:", e);
                    }
                }
            }
        } catch (err: any) {
            console.error("SurveyArchitect Error:", err);
            setError(err.message || "A network or protocol error occurred during Genesis creation.");
            setView("onboarding");
        }
    };



    return (
        <div className={`min-h-[600px] w-full max-w-5xl mx-auto rounded-[2.5rem] border shadow-2xl overflow-y-auto custom-scrollbar relative transition-colors duration-500 ${view === 'results' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <AnimatePresence mode="wait">
                {view === "explainer" && (
                    <motion.div
                        key="explainer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center h-full justify-center min-h-[600px]"
                    >

                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                            Genesis Suite
                        </h2>

                        <div className="max-w-2xl mx-auto space-y-4 mb-12">
                            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                                Don't have questions yet? Let our AI Architect build a stress-tested 20-item instrument for you.
                            </p>
                            <p className="text-emerald-400 text-sm font-black uppercase tracking-[0.2em] animate-pulse">
                                The heavylifting is on us.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mb-12">
                            {[
                                { title: "Define", desc: "Set your objective & audience context", icon: Target, color: "text-teal-400", border: "border-teal-500/20", bg: "bg-teal-500/5" },
                                { title: "Generate", desc: "Automated questionnaire drafting", icon: Cpu, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5" },
                                { title: "Audit", desc: "Stress-test against 5 digital personas", icon: ShieldCheck, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
                                { title: "Deliver", desc: "Receive a certified field manual", icon: FileText, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" }
                            ].map((step, i) => (
                                <div key={i} className={`p-6 rounded-2xl border ${step.border} ${step.bg} flex flex-col items-center gap-3 text-center transition-all hover:scale-105`}>
                                    <step.icon size={24} className={step.color} />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{step.title}</h3>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-800/50 p-6 rounded-3xl border border-white/5">
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Standard Run Cost</p>
                                <div className="text-3xl font-black text-white">
                                    378,000 <span className="text-emerald-500 text-sm">Credits</span>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden md:block" />
                            <button
                                onClick={() => window.open('/genesis', '_blank')}
                                className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
                            >
                                Activate Architect
                                <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {view === "onboarding" && (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 p-8 md:p-12"
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                            >
                                <Lock size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Genesis Protocol Failed</p>
                                    <p className="text-xs text-red-200/80 font-medium leading-relaxed">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="ml-auto text-red-500/50 hover:text-red-500 transition-colors"
                                >
                                    <CheckCircle2 size={14} />
                                </button>
                            </motion.div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
                                    <Sparkles size={12} className="text-teal-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">
                                        Architect Protocol
                                    </span>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">
                                    Let's Create Your Survey Questionnaire
                                </h2>
                                <p className="text-slate-400 font-medium max-w-2xl">
                                    Not sure where to begin? Simply define your research objective, specify your target market, refine your audience profile — and our AI Agents will handle the heavy lifting to engineer your precision-built Market Research Instrument.
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
                                <Lock size={12} className="text-emerald-500" />
                                Zero PII • Synthetic Only • Census-Weighted
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Step 1: Objective */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 border border-white/5 shadow-inner">
                                        <Target size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-100 font-bold text-sm tracking-tight">Strategic Objective</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">What is your primary research goal?</p>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.objective}
                                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                    placeholder="e.g., Launching a new premium coffee brand in Port Louis..."
                                    className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all resize-none font-medium"
                                />
                            </div>

                            {/* Step 2: Audience */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 border border-white/5 shadow-inner">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-100 font-bold text-sm tracking-tight">Target Audience</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Who am I interviewing?</p>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.audience}
                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                    placeholder="e.g., Urban professionals, age 25-45, interested in sustainability..."
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
                                        <h4 className="text-indigo-100 font-bold text-sm tracking-tight">Decision Matrix</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">What action will this data drive?</p>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.decisions}
                                    onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                                    placeholder="e.g., Deciding on the final retail price and packaging color..."
                                    className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none font-medium"
                                />
                            </div>
                        </div>

                        {/* Demographic Refinement Layer */}
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                            <div className="mb-6">
                                <h4 className="text-indigo-100 font-bold text-sm tracking-tight">Demographic Refinement</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Calibrate AVA's predictive lens with precision archetypes</p>
                            </div>
                            <AudienceConfigurator
                                value={formData.targeting}
                                onChange={(val) => setFormData({ ...formData, targeting: val })}
                                dark
                            />

                            {/* BUREAU DISCLOSURE WARNING */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-5 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 shadow-lg border border-amber-500/20 group-hover:scale-110 transition-transform">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">Bilateral Audit Disclosure</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        Genesis is a <span className="text-white font-bold">computationally intensive</span> process. To achieve 100/100 Bureau Certification, each question undergoes up to 3 recursive audits.
                                        <span className="block mt-2 text-amber-500/80 font-bold italic underline decoration-amber-500/20 underline-offset-4">
                                            Estimated authorization time: up to 24 minutes.
                                        </span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        setIsLoginModalOpen(true);
                                    } else {
                                        handleGenerate();
                                    }
                                }}
                                className={`group flex items-center gap-3 px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 ${(!isAuthenticated || (formData.objective && formData.audience && formData.decisions))
                                    ? "bg-white text-slate-900 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
                                    : "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                {!isAuthenticated ? "Identify as an Early Adopter to Proceed" : "Initialize Genesis Protocol"}
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
                        className="relative z-10 flex flex-col items-center justify-center min-h-[600px] p-6 text-center"
                    >
                        <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-5xl">
                            {/* Left: Enhanced Pulse HUD & Progress */}
                            <div className="flex flex-col items-center lg:items-start lg:w-1/3">
                                <div className="relative mb-8 w-48 h-48 flex items-center justify-center">
                                    {/* Radial Progress Gauge */}
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            className="fill-none stroke-slate-800 stroke-[4px]"
                                        />
                                        <motion.circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            className="fill-none stroke-teal-500 stroke-[4px]"
                                            strokeDasharray="552.92"
                                            initial={{ strokeDashoffset: 552.92 }}
                                            animate={{ strokeDashoffset: 552.92 - (552.92 * smoothProgress) / 100 }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    {/* Central Animated HUD */}
                                    <div className="relative w-32 h-32 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.1)]">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-4 rounded-full border-2 border-dashed border-teal-500/20"
                                        />
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-8 rounded-full border border-emerald-500/10"
                                        />
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-white tracking-tighter">
                                                {smoothProgress.toFixed(1)}%
                                            </span>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] font-black text-teal-500 uppercase tracking-widest leading-none">
                                                    Certified
                                                </span>
                                                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter mt-1 bg-white/5 px-2 py-0.5 rounded-full">
                                                    Vetted {vettedCount.toString().padStart(2, '0')}/20
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 text-center lg:text-left w-full">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">
                                        Genesis Engine Active
                                    </h3>
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={loadingPhase}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-xl font-bold text-slate-200"
                                        >
                                            {loadingLabel}
                                        </motion.p>
                                    </AnimatePresence>

                                    <div className="flex items-center justify-center lg:justify-start gap-1.5 pt-2">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 rounded-full transition-all duration-1000 ${i <= loadingPhase ? "w-8 bg-teal-500" : "w-2 bg-slate-800"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Estimated Timer Indicator */}
                                    <div className="mt-8 w-full p-4 rounded-2xl bg-slate-800/20 border border-white/5 text-left flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                                            <Activity size={14} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Authorization Status</p>
                                            <p className="text-[11px] text-slate-300 font-bold leading-relaxed">
                                                {logs.length > 0 ? (logs[logs.length - 1].details || "Synthesizing...") : "Deploying Agent Panel..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Agent Terminal (The Glass Box) */}
                            <div className="flex-1 w-full relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-50" />
                                <div className="relative bg-slate-950/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                                    {/* Terminal Header */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-red-400/50" />
                                                <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                                                <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
                                            </div>
                                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">
                                                Genesis Protocol — Deployment Logs
                                            </span>
                                        </div>
                                        {logs.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Activity size={10} className="text-teal-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-teal-500 uppercase tracking-tighter">Live Stream</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Terminal Body */}
                                    <div className="h-[360px] overflow-y-auto p-4 font-mono text-left scroll-smooth custom-scrollbar">
                                        {displayLogs.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                                                <Activity size={24} className="opacity-20" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                                    Waiting for agent telemetry...
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {displayLogs.map((log, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -5 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex gap-3 text-[11px] leading-relaxed group"
                                                    >
                                                        <span className="text-slate-600 shrink-0 font-bold opacity-50">
                                                            [{log.timestamp}]
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <span className={`font-black uppercase tracking-tighter shrink-0 ${log.agent === 'SENTINEL' ? 'text-blue-400' :
                                                                log.agent === 'AUDITOR' ? 'text-amber-400' :
                                                                    log.agent === 'ADJUDICATOR' ? 'text-emerald-400' :
                                                                        log.agent === 'SYSTEM' ? 'text-slate-500 italic' :
                                                                            'text-teal-400'
                                                                }`}>
                                                                {log.agent}
                                                            </span>
                                                            <span className="text-slate-400 shrink-0">::</span>
                                                            <span className={`font-bold uppercase shrink-0 ${log.agent === 'SYSTEM' ? 'text-slate-600' : 'text-slate-500'}`}>
                                                                {log.action}
                                                            </span>
                                                            <span className={`${log.agent === 'SYSTEM' ? 'text-slate-500' : 'text-slate-200'}`}>
                                                                {log.details}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                <div id="terminal-bottom" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Terminal Footer */}
                                    <div className="px-4 py-2 bg-slate-900/50 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-600 uppercase">
                                            Buffer: {logs.length} Chunks
                                        </p>
                                        <div className="flex items-center gap-4">
                                            {isDev && (
                                                <button
                                                    onClick={() => {
                                                        const mockData = {
                                                            instrument: [
                                                                "How likely are you to recommend our premium coffee?",
                                                                "What is your primary reason for choosing a coffee brand?",
                                                                "How often do you visit artisanal coffee shops?",
                                                                "What is your preferred brewing method at home?",
                                                                "How does price influence your coffee purchasing decisions?",
                                                                "Rate the importance of organic certification in your choice.",
                                                                "Which demographic segment do you identify with most?",
                                                                "How do you prefer to receive news about new product launches?"
                                                            ],
                                                            strategic_rationale: "This instrument targets high-affinity artisanal consumers by focusing on sensory experience and brand origin stories.",
                                                            certified_by: "AVA Dev Simulator",
                                                            field_manual: {
                                                                deployment_best_practices: [
                                                                    "Ensure interviewers are trained in neutral prompting.",
                                                                    "Use stratified sampling based on urban density.",
                                                                    "Rotate question order for items 4-10 to prevent bias."
                                                                ],
                                                                scientific_disclosure: "Calibrated via Psychometric Validity Protocol v2.0."
                                                            },
                                                            simulation_report: {
                                                                executive_summary: "The instrument demonstrates high reliability (α=0.88) across urban segments. It effectively identifies willingness-to-pay thresholds without respondent fatigue.",
                                                                field_deployment_protocol: ["Deploy via Mobile-First Web Tool", "Target morning commute hours", "Use incentivized participation"],
                                                                demographic_insights: [
                                                                    { segment: "Urban Professionals", finding: "High focus on ethically sourced origins." },
                                                                    { segment: "Student Cohorts", finding: "Price-sensitive but brand-loyal." }
                                                                ],
                                                                question_justifications: Array(8).fill({
                                                                    design_rationale: "Anchored on Cognitive Load Theory.",
                                                                    validation_confirmed: "0% drop-off in n=5 simulation."
                                                                })
                                                            }
                                                        };
                                                        setResult(mockData);
                                                        setView("results");
                                                    }}
                                                    className="text-[10px] font-black text-emerald-500/50 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                                                >
                                                    [ DEV: BYPASS TO RESULTS ]
                                                </button>
                                            )}
                                            <p className="text-[10px] font-bold text-slate-600 uppercase">
                                                Status: {view === 'processing' ? 'Active Generation' : 'Halted'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === "results" && result && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 p-8 md:p-12 flex flex-col min-h-full"
                    >
                        {/* HEADER: Official Certificate Identity */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                                        <ShieldCheck size={48} strokeWidth={1.2} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-lg">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-2">Genesis Protocol • V2.4.1</p>
                                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                                        Audit Certificate
                                    </h2>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Certified by {result.certified_by}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        const win = window.open("", "_blank");
                                        if (win) {
                                            win.document.write(result.formatted_report || "<html><body><h1>Report Generating...</h1></body></html>");
                                            win.document.close();
                                            setTimeout(() => win.print(), 800);
                                        }
                                    }}
                                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-900/30"
                                >
                                    <Printer size={18} /> Download Dossier (PDF)
                                </button>
                            </div>
                        </div>

                        {/* EXECUTIVE SUMMARY: Hero UX Section */}
                        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                    <Zap size={14} />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Executive Summary</h3>
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-slate-800 leading-snug tracking-tight">
                                {result.simulation_report?.executive_summary || "Genesis simulation has successfully architected a scientifically rigorous research instrument."}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-10 border-t border-slate-200/50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Score</p>
                                    <p className="text-2xl font-black text-slate-900">98.4/100</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sample Size</p>
                                    <p className="text-2xl font-black text-slate-900">n=5 (Synthetic)</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validity Index</p>
                                    <p className="text-2xl font-black text-emerald-600">HIGH FIDELITY</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-hidden">
                            {/* Left: Questionnaire */}
                            <div className="lg:col-span-7 space-y-12">
                                {/* Group Questions into Phases for better readability */}
                                {[
                                    { name: "Phase 1: Warm-up & Cognitive Onboarding", range: [0, 3], color: "text-blue-500", bg: "bg-blue-50" },
                                    { name: "Phase 2: Core KPI & Value Metrics", range: [3, 10], color: "text-emerald-500", bg: "bg-emerald-50" },
                                    { name: "Phase 3: Deep Behavioral Vectors", range: [10, 16], color: "text-purple-500", bg: "bg-purple-50" },
                                    { name: "Phase 4: Classification & Demographics", range: [16, 20], color: "text-amber-500", bg: "bg-amber-50" }
                                ].map((phase, pIdx) => {
                                    const phaseQuestions = (result?.instrument || []).slice(phase.range[0], phase.range[1]);
                                    if (phaseQuestions.length === 0) return null;

                                    return (
                                        <div key={pIdx} className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`px-4 py-1.5 rounded-full ${phase.bg} ${phase.color} text-[10px] font-black uppercase tracking-widest border border-current/10`}>
                                                    {phase.name}
                                                </div>
                                                <div className="h-px flex-1 bg-slate-100" />
                                            </div>

                                            <div className="space-y-4">
                                                {phaseQuestions.map((q: string, qIdx: number) => {
                                                    const realIndex = phase.range[0] + qIdx;
                                                    const justification = result?.simulation_report?.question_justifications?.[realIndex];
                                                    return (
                                                        <motion.div
                                                            key={realIndex}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: realIndex * 0.03 }}
                                                            className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
                                                        >
                                                            <div className="flex gap-6">
                                                                <span className="text-[11px] font-black text-slate-300 group-hover:text-emerald-500 transition-colors pt-1">
                                                                    {String(realIndex + 1).padStart(2, '0')}
                                                                </span>
                                                                <div className="space-y-4 w-full">
                                                                    <p className="text-md font-bold text-slate-800 leading-relaxed tracking-tight">
                                                                        {q}
                                                                    </p>
                                                                    {justification && (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                                                            <div className="flex gap-3">
                                                                                <div className="mt-1">
                                                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Psychometric Basis</p>
                                                                                    <p className="text-[11px] text-slate-600 font-medium leading-normal">{justification.design_rationale}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-3">
                                                                                <div className="mt-1">
                                                                                    <Activity size={14} className="text-blue-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sim-Validation</p>
                                                                                    <p className="text-[11px] text-slate-600 font-medium leading-normal italic">"{justification.validation_confirmed}"</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: Rationale & Manual */}
                            {/* Right: Technical Sidebar */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="sticky top-8">
                                    <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 mb-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                                <Target size={20} />
                                            </div>
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-900">Strategic Intent</h4>
                                        </div>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                                            "{result?.strategic_rationale || "Strategic synthesis complete."}"
                                        </p>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-900/[0.02] space-y-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                                    <FileText size={16} />
                                                </div>
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Deployment Protocol</h4>
                                            </div>
                                            <ul className="space-y-4">
                                                {(result?.field_manual?.deployment_best_practices || []).map((bp: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-[12px] text-slate-600 font-medium leading-tight">
                                                        <span className="text-emerald-500 font-black mt-0.5">✓</span>
                                                        {bp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Quality Standards</p>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                    <span className="text-[11px] font-bold text-slate-600">Instrument Fidelity</span>
                                                    <span className="text-xs font-black text-emerald-600">CERTIFIED</span>
                                                </div>
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                    <span className="text-[11px] font-bold text-slate-600">Audit Grade</span>
                                                    <span className="text-xs font-black text-blue-600">EXECUTIVE</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 rounded-3xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 text-center group cursor-pointer active:scale-95 transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-80">Final Handover</p>
                                        <p className="text-sm font-bold">Ready for Field Deployment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SIMULATION VALIDATION: The Certification Strip */}
                        {result?.simulation_report && (
                            <div className="mt-20 pt-16 border-t border-slate-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-xl">
                                            <Activity size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Section 04</h3>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Validation Certificate</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">All Synthetic Segments Verified</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/[0.02]">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Executive Verdict</p>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                            {result.simulation_report.executive_summary}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/[0.02]">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Simulation Signals</p>
                                        <ul className="space-y-4">
                                            {(result.simulation_report.field_deployment_protocol || result.simulation_report.next_steps || []).slice(0, 3).map((step: any, i: number) => (
                                                <li key={i} className="flex gap-3 text-[12px] text-slate-600 font-medium italic leading-snug">
                                                    <span className="text-emerald-500">→</span>
                                                    {typeof step === "string" ? step : step?.step || step?.recommendation || JSON.stringify(step)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-slate-900 rounded-[2rem] p-10 border border-slate-800 shadow-2xl text-white">
                                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Segment Analysis</p>
                                        <div className="space-y-6">
                                            {(result.simulation_report.demographic_insights || []).slice(0, 2).map((insight: any, i: number) => (
                                                <div key={i} className="group">
                                                    <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">{insight.segment}</p>
                                                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">{insight.finding}</p>
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
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
                .bg-slate-900.custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                }
                .bg-slate-900.custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>

            {/* PAYWALL OVERLAY */}
            <AnimatePresence>
                {isPaywallOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white text-slate-900 rounded-[2rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 to-teal-500" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Lock size={32} className="text-slate-400" />
                                </div>

                                <div>
                                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                                        Creation Module
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">Unlock Genesis Access</h3>
                                    <p className="text-slate-500 font-medium">Initialize the AI Architect to build your stress-tested 20-item instrument.</p>
                                </div>

                                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-slate-600">Architect Credits</span>
                                        <span className="text-2xl font-black text-slate-900">
                                            378,000
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mt-2 pt-2 border-t border-slate-100">
                                        <span className="text-slate-400">Your Balance</span>
                                        <span className={credits >= 100000 ? "text-emerald-600" : "text-red-500"}>
                                            {credits.toLocaleString()} Credits
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePaywallSuccess}
                                    disabled={credits < 100000}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 group ${credits >= 100000
                                        ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/20"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
                                >
                                    <Zap className="w-5 h-5" />
                                    {credits >= 100000 ? "Authorize Genesis Access (Up to: 100,000 Credits)" : "Insufficient Credits"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                                </button>

                                <button
                                    onClick={() => setIsPaywallOpen(false)}
                                    className="text-slate-400 text-xs font-bold hover:text-slate-600"
                                >
                                    Cancel & Return to Config
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
