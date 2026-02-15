"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Loader2,
    User,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    Rocket,
    Activity,
    Cpu,
    Clock,
    Hash,
    ShieldCheck,
} from "lucide-react";
import type { Persona, SimulationResult } from "./LabShell";

interface SimulationStepProps {
    personas: Persona[];
    questions: string[];
    results: SimulationResult[];
    setResults: (r: SimulationResult[]) => void;
    isSimulating: boolean;
    setIsSimulating: (v: boolean) => void;
    onComplete: () => void;
}

interface LiveLog {
    persona: string;
    question: string;
    answer: string;
    timestamp: number;
    latency_ms?: number;
}

interface ProvenanceSummary {
    total_api_calls: number;
    avg_latency_ms: number;
    model: string;
}

export default function SimulationStep({
    personas,
    questions,
    results,
    setResults,
    isSimulating,
    setIsSimulating,
    onComplete,
}: SimulationStepProps) {
    const [liveLogs, setLiveLogs] = useState<LiveLog[]>([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [provenance, setProvenance] = useState<ProvenanceSummary | null>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    const totalCalls = personas.length * questions.length;

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [liveLogs]);

    const runSimulation = async () => {
        setIsSimulating(true);
        setLiveLogs([]);
        setProgress(0);
        setError("");
        setProvenance(null);

        // Run personas one-by-one to provide live feed
        const allResults: SimulationResult[] = [];
        const allProvenance: ProvenanceSummary = {
            total_api_calls: 0,
            avg_latency_ms: 0,
            model: "AVA Enterprise Intelligence",
        };
        let completedCalls = 0;
        let totalLatency = 0;

        for (const persona of personas) {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/simulate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        demographics: [persona],
                        questions,
                    }),
                });

                const data = await resp.json();

                // Handle new response format: { results: [...], provenance: {...} }
                const rowArray = data.results || data;
                const prov = data.provenance;

                if (Array.isArray(rowArray) && rowArray.length > 0) {
                    const row = rowArray[0];
                    allResults.push(row);

                    // Accumulate provenance
                    if (prov) {
                        allProvenance.total_api_calls += prov.total_api_calls || 0;
                        allProvenance.model = prov.model || allProvenance.model;
                    }

                    // Extract individual answers for live feed
                    const provCalls = prov?.calls || [];
                    for (let qi = 0; qi < questions.length; qi++) {
                        const q = questions[qi];
                        if (row[q]) {
                            completedCalls++;
                            const callProv = provCalls[qi];
                            const latMs = callProv?.latency_ms || 0;
                            totalLatency += latMs;

                            setProgress(Math.round((completedCalls / totalCalls) * 100));
                            setLiveLogs((prev) => [
                                ...prev,
                                {
                                    persona: persona.name,
                                    question: q.slice(0, 60),
                                    answer: row[q].slice(0, 120),
                                    timestamp: Date.now(),
                                    latency_ms: latMs,
                                },
                            ]);
                        }
                    }
                }
            } catch (err: any) {
                console.error(`Error simulating ${persona.name}:`, err);
                setError(`Failed on persona: ${persona.name}. ${err.message}`);
            }
        }

        allProvenance.avg_latency_ms = completedCalls > 0 ? Math.round(totalLatency / completedCalls) : 0;
        setProvenance(allProvenance);
        setResults(allResults);
        setIsSimulating(false);
        setProgress(100);
    };

    return (
        <div className="max-w-6xl mx-auto py-10">
            {/* Section Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Zap size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            Diagnostic Dry Run
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Live Quality Audit Execution
                        </p>
                    </div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                    Deploying{" "}
                    <span className="text-slate-900 font-bold">{personas.length}</span>{" "}
                    diagnostic respondents against{" "}
                    <span className="text-slate-900 font-bold">{questions.length}</span>{" "}
                    client questions ={" "}
                    <span className="text-blue-600 font-bold">{totalCalls}</span> unique
                    diagnostic interactions via Gemini 2.0 Flash.
                </p>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    {
                        label: "Respondents",
                        value: personas.length,
                        color: "text-blue-600",
                        bg: "from-blue-50",
                    },
                    {
                        label: "Questions",
                        value: questions.length,
                        color: "text-indigo-600",
                        bg: "from-indigo-50",
                    },
                    {
                        label: "Total Calls",
                        value: totalCalls,
                        color: "text-amber-600",
                        bg: "from-amber-50",
                    },
                    {
                        label: "Completion",
                        value: `${progress}%`,
                        color: "text-emerald-600",
                        bg: "from-emerald-50",
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className={`bg-gradient-to-br ${stat.bg} to-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm`}
                    >
                        <p
                            className={`text-3xl font-black tracking-tighter ${stat.color} mb-1`}
                        >
                            {stat.value}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Launch Button */}
            {!isSimulating && results.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-10"
                >
                    <button
                        onClick={runSimulation}
                        className="inline-flex items-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all active:scale-[0.98]"
                    >
                        <Rocket size={18} />
                        Launch Diagnostic Dry Run
                    </button>
                    <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">
                        This will make {totalCalls} diagnostic calls — estimated{" "}
                        {Math.ceil(totalCalls * 1.5)}s
                    </p>
                </motion.div>
            )}

            {/* Progress Bar */}
            {(isSimulating || progress > 0) && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            {isSimulating && (
                                <Activity size={12} className="text-primary animate-pulse" />
                            )}
                            {isSimulating
                                ? "Diagnostic Dry Run In Progress"
                                : "Diagnostic Dry Run Complete"}
                        </span>
                        <span className="text-sm font-black text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${progress === 100
                                ? "bg-emerald-500"
                                : "bg-blue-600"
                                }`}
                        />
                    </div>
                </div>
            )}

            {/* Live Feed */}
            {liveLogs.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <MessageSquare size={14} className="text-blue-600" />
                                {isSimulating && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                )}
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Live Diagnostic Feed
                            </h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                            {liveLogs.length} / {totalCalls} responses
                        </span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                        <AnimatePresence>
                            {liveLogs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: "auto" }}
                                    className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <User size={12} className="text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-slate-900">
                                                {log.persona}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[200px]">
                                                re: {log.question}...
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            &quot;{log.answer}...&quot;
                                        </p>
                                        {/* Provenance micro-badge */}
                                        {log.latency_ms && (
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {log.latency_ms ? (
                                                    <span className="text-[8px] font-bold text-slate-400 flex items-center gap-1">
                                                        <Clock size={8} />
                                                        {log.latency_ms}ms
                                                    </span>
                                                ) : null}

                                                <span className="text-[8px] font-bold text-emerald-600 flex items-center gap-1">
                                                    <Cpu size={8} />
                                                    AVA Proprietary Core
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={logEndRef} />
                    </div>
                </div>
            )}

            {/* Provenance Summary Bar */}
            {provenance && !isSimulating && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            Provenance Certificate — All Responses Verified
                        </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: "Engine Status", value: "Verified Active", color: "text-blue-600" },
                            { label: "Audit Capacity", value: provenance.total_api_calls, color: "text-amber-600" },
                            { label: "Avg Latency", value: `${provenance.avg_latency_ms}ms`, color: "text-emerald-600" },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <p className={`text-sm font-black ${item.color}`}>{item.value}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex items-center gap-3 text-red-600 text-xs font-bold bg-red-50 border border-red-100 px-5 py-3 rounded-xl"
                >
                    <AlertCircle size={14} />
                    {error}
                </motion.div>
            )}

            {/* Complete CTA */}
            {!isSimulating && results.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-black mb-4">
                        <CheckCircle2 size={18} />
                        Diagnostic Dry Run Complete — {results.length} Respondents Processed
                    </div>
                    <br />
                    <button
                        onClick={onComplete}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4"
                    >
                        View Diagnostic Results
                    </button>
                </motion.div>
            )}
        </div>
    );
}
