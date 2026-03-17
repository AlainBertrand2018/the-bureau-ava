"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    Target,
    Zap,
    ShieldCheck,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    LayoutDashboard,
    Cpu,
    Languages,
    TrendingUp,
    Shield,
    Users,
    MapPin,
    Wifi,
    Fingerprint,
    FileText,
    Lock,
    Rocket,
    Activity,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useMission, AudienceTargeting } from "@/context/MissionContext";
import { useClearance } from "@/context/ClearanceContext";
import AudienceConfigurator from "@/components/shared/AudienceConfigurator";
import LaboratoryEntryProtocol from "@/components/shared/LaboratoryEntryProtocol";
import { COUNTRIES } from "@/constants/marketData";
import PaywallModal from "@/components/shared/PaywallModal";

import { useCurrency } from "@/context/CurrencyContext";

const getServiceConfigs = (currency: any) => ({
    genesis: {
        id: 'genesis',
        title: 'Genesis Protocol',
        description: 'Generative design of statistically rigorous research instruments (Questionnaire Generator), calibrated to institutional requirements.',
        credits: '100,000',
        price: `${currency.symbol}${currency.tiers.genesis.price.toLocaleString()} / Run`,
        features: ['Instrument Synthesis', 'Bias-Free Scripting', 'Audit Trail', 'Field Manual'],
        accent: 'text-emerald-500',
        icon: <Zap size={24} />
    },
    lab: {
        id: 'lab',
        title: 'The Lab',
        description: 'Rigorous neural auditing (Questionnaire Stress Test) of existing instruments using targeted synthetic respondent populations.',
        credits: '450,000',
        price: `${currency.symbol}${currency.tiers.lab.price.toLocaleString()} / Simulation`,
        features: ['Adversarial Simulation', 'Persona Generation', 'Cognitive Load Audit', 'Bias Detection'],
        accent: 'text-blue-500',
        icon: <Rocket size={24} />
    },
    interpreter: {
        id: 'interpreter',
        title: 'Interpreter',
        description: 'Deep result analysis and psychographic insight synthesis from raw field data.',
        credits: '300,000',
        price: `${currency.symbol}${currency.tiers.interpreter.price.toLocaleString()} / Report`,
        features: ['Results Processing', 'Narrative Synthesis', 'Psychological Deep-Dive', 'Executive Briefing'],
        accent: 'text-purple-500',
        icon: <Activity size={24} />
    },
    enterprise: {
        id: 'enterprise',
        title: 'Enterprise Subscription',
        description: 'Unlimited Access to All Tools for institutional research teams. Continuous validation and priority support.',
        credits: '1,000,000',
        price: `${currency.symbol}${currency.tiers.enterprise.price.toLocaleString()} / Month`,
        features: ['Unlimited Priority Access', 'Priority Token Allowance', 'White-Glove Support', 'Institutional Grid Access'],
        accent: 'text-amber-500',
        icon: <ShieldCheck size={24} />
    }
});

const DEFAULT_TARGETING: AudienceTargeting = {
    country: "",
    region: "",
    language: "",
    gender: 'Mixed',
    age_group: 'Any',
    marital_status: 'Regardless',
    revenue_group: 'Regardless',
    education_level: 'Regardless',
    employment_status: 'Regardless',
    urbanization: 'Regardless'
};


export default function MissionControlClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setMission, setTier } = useMission();
    const { 
        credits, 
        userEmail, 
        isAuthenticated, 
        refreshClearance,
        isLoaded,
        setIsLoginModalOpen
    } = useClearance();

    const { currency } = useCurrency();
    const SERVICE_CONFIGS = getServiceConfigs(currency);

    useEffect(() => {
        const tierParam = searchParams.get('tier');
        if (tierParam === 'tier2' || tierParam === 'tier3') {
            setTier(tierParam);
        } else {
            setTier('tier1');
        }
    }, [searchParams, setTier]);

    const [step, setStep] = useState<"configure" | "calibrating" | "ready">("configure");
    const [config, setConfig] = useState({
        target_country: "",
        target_region: "",
        target_language: "",
        target_audience: "",
        research_topic: "Consumer Behavior",
        targeting_refinement: DEFAULT_TARGETING
    });

    const [error, setError] = useState<string | null>(null);
    const [calibText, setCalibText] = useState("Initializing Universalization Layer...");
    const [missionData, setMissionData] = useState<any>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showAuditLog, setShowAuditLog] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated && userEmail && step === "configure") {
            const fetchHistory = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions?email=${userEmail}`);
                    if (res.ok) {
                        const data = await res.json();
                        setHistory(data.slice(0, 3)); // Use only previous 3 runs as requested
                    }
                } catch (err) {
                    console.error("Failed to fetch mission history", err);
                }
            };
            fetchHistory();
        }
    }, [isAuthenticated, userEmail, step]);

    const calibSteps = [
        "Connecting to Bureau Intelligence Grid...",
        "Scanning Market Socio-Economics...",
        "Parsing Linguistic Registers...",
        "Establishing Cultural Axioms...",
        "Drafting Persona Seedlings...",
        "Finalizing Cultural Dossier..."
    ];

    const handleInitialize = async () => {
        if (!config.target_audience) {
            setError("Please define your target audience.");
            return;
        }

        if (!isAuthenticated) {
            setError("Identification required. Please register or login to continue.");
            setIsLoginModalOpen(true);
            return;
        }

        if (credits <= 0 && userEmail !== "bertrand.chagal@gmail.com") {
            setError("You have consumed all your free validation runs. Please upgrade your plan.");
            return;
        }

        setError(null);
        setStep("calibrating");

        // Cycle through text for effect
        let idx = 0;
        const interval = setInterval(() => {
            if (idx < calibSteps.length) {
                setCalibText(calibSteps[idx]);
                idx++;
            }
        }, 1500);

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mission/initialize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...config,
                    user_email: userEmail
                })
            });

            if (!resp.ok) {
                const errData = await resp.json().catch(() => null);
                if (resp.status === 402) {
                    throw new Error("CREDIT_EXHAUSTED: You have used your 3 free validation runs.");
                }
                throw new Error(errData?.detail || "Mission failed to launch.");
            }

            // Refresh credits after successful consumption start
            refreshClearance();

            // STREAMING RESPONSE HANDLER
            const reader = resp.body?.getReader();
            if (!reader) throw new Error("Stream not supported");

            // Clear previous data but keep structure for UI safety
            setMissionData({ audit_trail: [] } as any);
            // setShowAuditLog(true); // Disable auto-open full modal in favor of one-line ticker

            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    clearInterval(interval);
                    setStep("ready");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                accumulated += chunk;

                const lines = accumulated.split("\n");
                // Keep the last segment if it isn't a complete line (doesn't end in \n)
                // Actually split leaves empty string at end if text ends with \n
                // If it doesn't end with \n, the last element is the incomplete chunk.
                // We should check if the last char was \n before splitting, or pop the last element always if assume stream chunks might split lines.
                // Safer approach:
                const lastLine = lines.pop();
                accumulated = lastLine || "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const msg = JSON.parse(line);

                        if (msg.type === "log") {
                            setMissionData((prev: any) => ({
                                ...prev,
                                audit_trail: [...(prev?.audit_trail || []), msg.data]
                            }));
                        } else if (msg.type === "mission") {
                            setMissionData(msg.data);
                            setMission(msg.data);
                        } else if (msg.type === "status") {
                            // Optional: update calibration text?
                            // setCalibText(msg.data);
                        } else if (msg.type === "error") {
                            throw new Error(msg.detail);
                        }
                    } catch (e) {
                        console.error("Stream parse error", e);
                    }
                }
            }
        } catch (err: any) {
            clearInterval(interval);
            setError(err.message);
            setStep("configure");
        }
    };

    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    const openPaywall = (serviceId: string) => {
        setSelectedService(SERVICE_CONFIGS[serviceId as keyof typeof SERVICE_CONFIGS]);
        setIsPaywallOpen(true);
    };

    const handleConfirmAccess = (serviceId: string) => {
        setIsPaywallOpen(false);

        const service = SERVICE_CONFIGS[serviceId as keyof typeof SERVICE_CONFIGS];
        const creditsRequired = parseInt(service.credits.replace(/,/g, '')) || 0;
        const hasEnough = credits >= creditsRequired;

        // BYPASS CREDIT CHECK FOR TESTING - ALLOW ROAMING
        /* 
        if (!hasEnough || serviceId === 'enterprise') {
            window.open('/#pricing', '_blank');
            return;
        }
        */

        if (serviceId === 'lab') {
            setIsTransitioning(true);
        } else {
            window.open(`/os?app=${serviceId}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <LaboratoryEntryProtocol
                isOpen={isTransitioning}
                targetName={missionData?.config?.target_country || 'Unknown'}
                onComplete={() => window.location.href = "/lab"}
            />

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                onConfirm={handleConfirmAccess}
                service={selectedService}
                userCredits={credits}
            />
            {/* Background FX */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 hero-dot-grid opacity-20" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-24 pb-20 md:pb-32 flex-grow w-full">
                <AnimatePresence mode="wait">
                    {/* STEP 1: CONFIGURE */}
                    {step === "configure" && (
                        <motion.div
                            key="configure"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8 md:space-y-12"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 mb-8 md:mb-12">
                                {/* AVA PORTRAIT (Identical to Hero) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40, scale: 0.98 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                                    className="relative flex-shrink-0"
                                >
                                    <motion.div
                                        className="absolute inset-0 -m-4 rounded-full"
                                        style={{
                                            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                                        }}
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    <div className="relative w-[180px] h-[220px] md:w-[220px] md:h-[280px] lg:w-[260px] lg:h-[320px]">
                                        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-sm bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-white/5">
                                            <Image
                                                src="/images/AVA.webp"
                                                alt="AVA — Survey Intelligence Analyst"
                                                fill
                                                className="object-cover object-top"
                                                priority
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.8, duration: 0.5 }}
                                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-slate-900/90 border border-emerald-500/30"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Online</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <div className="flex-1 text-center lg:text-left space-y-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                                    >
                                        <Cpu size={12} />
                                        Mission Control Gateway
                                    </motion.div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-tight">
                                        Welcome to our <span className="text-emerald-500">Staging Zone.</span>
                                    </h1>
                                    <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                                        This is where you strategically configure how our AI Agents stage, stress test, design and validate your Market Research Instruments — ensuring optimal Data Integrity across every dimension of your surveys.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: General Settings */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="glass-card p-8 space-y-8">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Research Topic</label>
                                                <input
                                                    type="text"
                                                    value={config.research_topic}
                                                    onChange={(e) => setConfig({ ...config, research_topic: e.target.value })}
                                                    placeholder="e.g. FMCG, Fintech, Healthcare"
                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-colors outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Audience Segments</label>
                                            <textarea
                                                value={config.target_audience}
                                                onChange={(e) => setConfig({ ...config, target_audience: e.target.value })}
                                                placeholder="Who are you targeting? (e.g. Gen Z gamers in urban areas, SME owners...)"
                                                rows={3}
                                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-sm font-bold focus:border-emerald-500 transition-colors outline-none resize-none"
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-slate-800/50">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Fingerprint size={16} className="text-emerald-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Demographic Precision Calibrator</h4>
                                            </div>
                                            <AudienceConfigurator
                                                value={config.targeting_refinement}
                                                onChange={(val) => setConfig({
                                                    ...config,
                                                    targeting_refinement: val,
                                                    target_country: val.country || "",
                                                    target_region: val.region || "",
                                                    target_language: val.language || ""
                                                })}
                                                dark
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Summary / CTA */}
                                <div className="space-y-6">
                                    <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5 space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Mission Setup</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Globe size={16} className="text-slate-500 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Target Market</p>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.id === config.targeting_refinement.country)?.code || 'mu'}.png`}
                                                            alt=""
                                                            className="w-4 h-3 rounded-sm object-cover"
                                                        />
                                                        <p className="text-sm font-black">{config.targeting_refinement.country} ({config.targeting_refinement.region})</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Languages size={16} className="text-slate-500 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Local Linguistic Context</p>
                                                    <p className="text-sm font-black">{config.targeting_refinement.language}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Target size={16} className="text-slate-500 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Target Audience</p>
                                                    <p className="text-sm font-black line-clamp-2">{config.target_audience || "Waiting for audience..."}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Missions (Rule of 3 History) */}
                                        {history.length > 0 && (
                                            <div className="pt-6 border-t border-emerald-500/10 space-y-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#CC5833] flex items-center gap-2">
                                                        <Clock size={12} />
                                                        Recent Validation Runs
                                                    </h4>
                                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Rule of 3 History</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {history.map((h: any, i: number) => (
                                                        <motion.button 
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setMissionData(h);
                                                                setMission(h);
                                                                setStep("ready");
                                                            }}
                                                            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                                                        >
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <p className="text-[10px] font-black uppercase text-white group-hover:text-emerald-400 truncate max-w-[150px]">
                                                                    {h.config?.research_topic || "Untitled Mission"}
                                                                </p>
                                                            </div>
                                                            <p className="text-[9px] font-medium text-slate-500 line-clamp-1 group-hover:text-slate-400">
                                                                {h.config?.target_audience || "No audience defined"}
                                                            </p>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="flex flex-col gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <div className="flex items-center gap-2 text-red-400 text-[11px] font-bold">
                                                    <AlertCircle size={14} />
                                                    {error}
                                                </div>
                                                {!isAuthenticated && (
                                                    <button 
                                                        onClick={() => setIsLoginModalOpen(true)}
                                                        className="text-[10px] uppercase tracking-widest font-black text-emerald-400 hover:text-emerald-300 text-left ml-5"
                                                    >
                                                        Register as an Early Adopter Now »
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleInitialize}
                                            className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                                        >
                                            <Rocket size={16} />
                                            Initialize Mission (Up to: 50,000 CR)
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-slate-500 font-bold text-center">
                                        The Bureau utilizes proprietary AI for cultural calibration.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: CALIBRATING */}
                    {step === "calibrating" && (
                        <motion.div
                            key="calibrating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center min-h-[50vh] space-y-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                                <Loader2 size={64} className="text-emerald-500 animate-spin relative z-10" />
                            </div>
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-black uppercase tracking-[0.3em] animate-pulse">
                                    Calibrating <span className="text-emerald-500">Physics</span>
                                </h2>
                                <p className="text-slate-400 font-mono text-sm tracking-tighter">
                                    {calibText}
                                </p>
                            </div>

                            <div className="w-full max-w-md h-1 bg-slate-900 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 10, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400"
                                />
                            </div>

                            {/* LIVE AGENT TICKER (ONE-LINE MODAL) */}
                            <div className="h-16 flex items-center justify-center w-full px-4">
                                <AnimatePresence mode="wait">
                                    {missionData?.audit_trail && missionData.audit_trail.length > 0 ? (
                                        missionData.audit_trail.slice(-1).map((log: any, i: number) => (
                                            <motion.div
                                                key={log.timestamp + log.action + i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col md:flex-row items-center gap-2 md:gap-4 px-6 py-3 rounded-full bg-slate-900/90 border border-slate-700 backdrop-blur shadow-2xl shadow-emerald-500/10 max-w-2xl w-full justify-center"
                                            >
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px] ${log.agent === 'SENTINEL' ? 'bg-amber-500 shadow-amber-500/50' :
                                                        log.agent === 'PROFILER' ? 'bg-purple-500 shadow-purple-500/50' :
                                                            log.agent === 'ADJUDICATOR' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                                                'bg-teal-500 shadow-teal-500/50'
                                                        }`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${log.agent === 'SENTINEL' ? 'text-amber-400' :
                                                        log.agent === 'PROFILER' ? 'text-purple-400' :
                                                            log.agent === 'ADJUDICATOR' ? 'text-emerald-400' :
                                                                'text-teal-400'
                                                        }`}>
                                                        {log.agent}
                                                    </span>
                                                </div>

                                                <div className="hidden md:block w-px h-4 bg-slate-700 mx-1" />

                                                <div className="flex items-center gap-2 overflow-hidden w-full justify-center md:justify-start">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                                                        {log.action}
                                                    </span>
                                                    <span className="hidden sm:inline text-slate-600">»</span>
                                                    <span className="font-mono text-xs text-emerald-100 truncate w-full md:w-auto">
                                                        {log.details || "Processing..."}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            key="waiting"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-[10px] font-mono text-slate-500 animate-pulse tracking-widest"
                                        >
                                            ESTABLISHING NEURAL UPLINK...
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: READY */}
                    {step === "ready" && missionData && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 md:space-y-12"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 mb-8 md:mb-16">
                                {/* AVA PORTRAIT (Identical to Hero) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40, scale: 0.98 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                                    className="relative flex-shrink-0"
                                >
                                    <motion.div
                                        className="absolute inset-0 -m-4 rounded-full"
                                        style={{
                                            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                                        }}
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    <div className="relative w-[240px] h-[300px] md:w-[280px] md:h-[350px] lg:w-[320px] lg:h-[400px]">
                                        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-sm bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-white/5">
                                            <Image
                                                src="/images/AVA.webp"
                                                alt="AVA — Survey Intelligence Analyst"
                                                fill
                                                className="object-cover object-top"
                                                priority
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.8, duration: 0.5 }}
                                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-slate-900/90 border border-emerald-500/30"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Online</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <div className="flex-1 text-center lg:text-left space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                        <CheckCircle2 size={14} />
                                        Mission Established
                                    </div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <img
                                            src={`https://flagcdn.com/w80/${COUNTRIES.find(c => c.id === missionData?.config?.target_country)?.code || 'mu'}.png`}
                                            alt=""
                                            className="w-10 h-7 rounded-md object-cover shadow-lg border border-white/10"
                                        />
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
                                            Target <span className="text-emerald-500">Snapshot</span>
                                        </h1>
                                    </div>
                                    <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                        I have analyzed the cultural landscape of {missionData?.config?.target_country || 'your target market'}. Use these insights to build surveys that locals trust, understand, and answer honestly.
                                    </p>

                                    {/* Precision Refinement display */}
                                    {missionData.config.targeting_refinement && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                                <Fingerprint size={12} className="text-emerald-400" />
                                                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                                                    {missionData.config.targeting_refinement.gender} · {missionData.config.targeting_refinement.age_group} · {missionData.config.targeting_refinement.marital_status}
                                                </span>
                                            </div>
                                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                                <Globe size={12} className="text-emerald-400" />
                                                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                                                    {missionData.config.targeting_refinement.region} · {missionData.config.targeting_refinement.language}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* SAMPLING STRATEGY CARD */}
                                    {missionData.dossier.sampling_parameters && (
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Users size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Est. Segment Size</span>
                                                </div>
                                                <p className="text-lg font-bold text-white">{missionData.dossier.sampling_parameters.targeted_segment_size}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Target size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Ideal Sample</span>
                                                </div>
                                                <p className="text-lg font-bold text-emerald-400">{missionData.dossier.sampling_parameters.ideal_sample_size}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Wifi size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Distribution Mode</span>
                                                </div>
                                                <p className="text-lg font-bold text-emerald-400">{missionData.dossier.sampling_parameters.suggested_distribution_mode}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ECONOMIC REALITY (NEW) */}
                            <div className="glass-card p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp size={120} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <TrendingUp size={24} className="text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-widest">Economic Reality</h3>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <Shield size={12} className="text-emerald-400" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                                                Bureau Verifiable
                                            </span>
                                        </div>
                                    </div>

                                    {/* DEMOGRAPHIC CUT-OUTS (NEW) */}
                                    {missionData.dossier.demographics && (
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">Demographic Cut-Outs</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.entries(missionData.dossier.demographics).map(([key, val]: any) => (
                                                    <div key={key} className="bg-amber-950/20 border border-amber-500/10 rounded-lg p-3">
                                                        <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                        <div className="text-xs text-slate-300 font-medium space-y-1">
                                                            {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                <div key={i} className="flex items-start gap-2">
                                                                    <span className="text-amber-500/50 mt-0.5">•</span>
                                                                    <span>{part.trim()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="h-px bg-slate-800/50 w-full" />
                                        </div>
                                    )}

                                    {/* STRUCTURED ECONOMIC DATA */}
                                    <div className="space-y-8">
                                        {/* Macro Economics */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Macro-Economic Indicators</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {missionData.dossier.economics && Object.entries(missionData.dossier.economics).map(([key, val]: any) => (
                                                    <div key={key} className="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-3">
                                                        <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                        <div className="text-xs text-slate-300 font-medium space-y-1">
                                                            {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                <div key={i} className="flex items-start gap-2">
                                                                    <span className="text-emerald-500/50 mt-0.5">•</span>
                                                                    <span>{part.trim()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-slate-800/50 w-full" />

                                        {/* Tech & Education Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Education */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Education Landscape</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {missionData.dossier.education && Object.entries(missionData.dossier.education).map(([key, val]: any) => (
                                                        <div key={key} className="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-3">
                                                            <span className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                            <div className="text-xs text-slate-300 font-medium space-y-1">
                                                                {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-2">
                                                                        <span className="text-emerald-500/50 mt-0.5">•</span>
                                                                        <span>{part.trim()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Technology */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Technological Adoption</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {missionData.dossier.technology && Object.entries(missionData.dossier.technology).map(([key, val]: any) => (
                                                        <div key={key} className="bg-purple-950/20 border border-purple-500/10 rounded-lg p-3">
                                                            <span className="text-[10px] font-bold text-purple-400/70 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                            <div className="text-xs text-slate-300 font-medium space-y-1">
                                                                {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-2">
                                                                        <span className="text-purple-500/50 mt-0.5">•</span>
                                                                        <span>{part.trim()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Citations Snippet */}
                                    {missionData.dossier.citation_index && missionData.dossier.citation_index.length > 0 && (
                                        <div className="pt-4 border-t border-slate-800">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Primary Sources</p>
                                            <div className="flex flex-wrap gap-2">
                                                {missionData.dossier.citation_index.slice(0, 3).map((cite: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 truncate max-w-[200px]">
                                                        {cite.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                                                    </span>
                                                ))}
                                                {missionData.dossier.citation_index.length > 3 && (
                                                    <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                                                        +{missionData.dossier.citation_index.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Cultural Axioms */}
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">Cultural Axioms</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {missionData.dossier.cultural_axioms.map((axiom: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                                                <p className="text-xs text-slate-300 font-medium leading-relaxed">{axiom}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Linguistic Nuances */}
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Languages size={20} className="text-teal-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">Linguistic Context</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {missionData.dossier.linguistic_nuances.map((nuance: string, i: number) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                                                    {nuance}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Taboos & Sensitive Clusters</p>
                                            <ul className="space-y-2">
                                                {missionData.dossier.taboos.map((taboo: string, i: number) => (
                                                    <li key={i} className="text-xs text-red-400 font-bold flex items-center gap-2">
                                                        <AlertCircle size={10} />
                                                        {taboo}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Demographics Section */}
                            {missionData.dossier.demographic_archetypes && missionData.dossier.demographic_archetypes.length > 0 && (
                                <div className="glass-card p-8 space-y-6 mt-8">
                                    <div className="flex items-center gap-2">
                                        <Users size={20} className="text-amber-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">Demographic Archetypes (Generated Personas)</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {missionData.dossier.demographic_archetypes.map((persona: any, i: number) => (
                                            <div key={i} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl hover:border-amber-500/30 transition-colors group">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">
                                                        {persona.name.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-amber-500 transition-colors">{persona.role}</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-white mb-2">{persona.name}</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">{persona.background}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {persona.traits && persona.traits.split(',').slice(0, 2).map((t: string, k: number) => (
                                                        <span key={k} className="px-1.5 py-0.5 bg-slate-800 rounded text-[11px] text-slate-500 uppercase tracking-wide">{t.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STRATEGIC NEXT STEPS */}
                            <div className="mt-24 pt-16 border-t border-slate-800/50 pb-20">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                                        Strategic Next Steps
                                    </h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                                        What do you want to do next?
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                                    {/* Genesis */}
                                    <button
                                        onClick={() => openPaywall('genesis')}
                                        className="glass-card p-8 text-left group hover:border-emerald-500/50 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <Zap size={24} />
                                            </div>
                                            <ArrowRight size={20} className="text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-widest text-white mb-2">Genesis Protocol</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">Design a professional Survey Questionnaire from Scratch</p>
                                    </button>

                                    {/* The Lab */}
                                    <button
                                        onClick={() => openPaywall('lab')}
                                        className="glass-card p-8 text-left group hover:border-blue-500/50 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Rocket size={24} />
                                            </div>
                                            <ArrowRight size={20} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-widest text-white mb-2">The Lab</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">Stress Test your Questionnaire Before Going out in The Field</p>
                                    </button>

                                    {/* Interpreter */}
                                    <button
                                        onClick={() => openPaywall('interpreter')}
                                        className="glass-card p-8 text-left group hover:border-purple-500/50 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                <Activity size={24} />
                                            </div>
                                            <ArrowRight size={20} className="text-slate-700 group-hover:text-purple-500 group-hover:translate-x-2 transition-all" />
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-widest text-white mb-2">Interpreter</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">Get a Grounded Analysis of the Results From Your Survey</p>
                                    </button>

                                    {/* Subscription */}
                                    <button
                                        onClick={() => openPaywall('enterprise')}
                                        className="glass-card p-8 text-left border-amber-500/20 group hover:border-amber-500/50 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <ArrowRight size={20} className="text-slate-700 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-widest text-white mb-2">Subscribe</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">Use AVA in unlimited fashion</p>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
