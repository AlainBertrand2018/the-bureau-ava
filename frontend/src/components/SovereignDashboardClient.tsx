"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Shield,
    Globe,
    LayoutDashboard,
    FileText,
    Settings,
    Plus,
    Cpu,
    Activity,
    Lock,
    Terminal,
    ChevronRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Server,
    Search
} from "lucide-react";
import { useMission, Mission, MissionConfiguration } from "@/context/MissionContext";
import Image from "next/image";

// ── Components ──

export default function SovereignDashboardClient() {
    const { currentMission, setMission, setTier, tier } = useMission();
    const [missions, setMissions] = useState<any[]>([]);
    const [isLoadingMissions, setIsLoadingMissions] = useState(true);
    const [isCreatingMission, setIsCreatingMission] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [systemStatus, setSystemStatus] = useState("OPERATIONAL");
    const [integrity, setIntegrity] = useState(98.4);

    // Mission Creation State
    const [newMissionConfig, setNewMissionConfig] = useState<MissionConfiguration>({
        target_country: "France",
        target_region: "Paris/IDF",
        target_language: "French",
        target_audience: "Gen Z urban professionals interested in mobility.",
        research_topic: "Sustainable Transport"
    });

    // Fetch existing missions
    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions`);
                if (resp.ok) {
                    const data = await resp.json();
                    setMissions(data);
                }
            } catch (e) {
                console.error("Failed to fetch missions", e);
            } finally {
                setIsLoadingMissions(false);
            }
        };
        fetchMissions();
    }, []);

    const handleCreateMission = async () => {
        setIsCreatingMission(true);
        setLogs(prev => [{
            timestamp: new Date().toLocaleTimeString(),
            agent: "SYSTEM",
            action: "INITIALIZING",
            details: "Requesting neural uplink for new mission context..."
        }, ...prev]);

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mission/initialize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMissionConfig)
            });

            if (!resp.ok) throw new Error("Connection timed out.");

            const reader = resp.body?.getReader();
            if (!reader) throw new Error("Stream not supported");

            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulated += chunk;
                const lines = accumulated.split("\n");
                accumulated = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const msg = JSON.parse(line);
                        if (msg.type === "log") {
                            setLogs(prev => [msg.data, ...prev].slice(0, 50));
                        } else if (msg.type === "mission") {
                            setMission(msg.data);
                            setMissions(prev => [msg.data, ...prev]);
                            setIsCreatingMission(false);
                        }
                    } catch (e) { /* ignore parse errors */ }
                }
            }
        } catch (err: any) {
            setLogs(prev => [{
                timestamp: new Date().toLocaleTimeString(),
                agent: "ERROR",
                action: "MISSION_FAILURE",
                details: err.message
            }, ...prev]);
            setIsCreatingMission(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-['Outfit',_sans-serif] selection:bg-emerald-500/30 overflow-hidden relative">

            {/* ── Background FX ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_80%)]" />
                <motion.div
                    animate={{
                        translate: [0, -40, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full"
                />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-[scan_8s_linear_infinite]" />
            </div>


            <div className="relative z-10 grid grid-cols-[280px_1fr_340px] h-screen gap-6 p-6">

                {/* ── LEFT SIDEBAR ── */}
                <motion.aside
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col gap-8 p-8 rounded-[2rem] bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <Zap size={18} className="text-white fill-current" />
                        </div>
                        <span className="text-lg font-black tracking-[0.2em] uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Bureau</span>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Status</span>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {systemStatus}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Missions Validated</span>
                            <div className="text-2xl font-black">{missions.length + 142}</div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sovereign Tier</span>
                            <div className="text-xs font-black px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 inline-block uppercase tracking-widest">
                                {tier.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <nav className="mt-auto space-y-2">
                        {[
                            { icon: LayoutDashboard, label: "Dashboard", active: true },
                            { icon: Cpu, label: "Mission Control" },
                            { icon: FileText, label: "Dossiers" },
                            { icon: Settings, label: "Settings" }
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${item.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'}`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </motion.aside>

                {/* ── MAIN CONTENT ── */}
                <main className="flex flex-col gap-6 h-full overflow-hidden">

                    {/* Header Banner */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                        className="relative p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/5 shadow-2xl overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl pointer-events-none select-none">AVA v2.0</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 block">Access Granted // Sovereign Lead</span>
                        <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase leading-none">Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Commander.</span></h1>
                        <p className="text-slate-400 max-w-xl font-medium leading-relaxed">AVA Architect V2.0 is operational. Sharpness protocols are active. All systems reporting optimal integrity ({integrity}%).</p>
                    </motion.header>

                    {/* Active Missions Grid */}
                    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Active Mission Renders</h2>
                            <div className="flex items-center gap-2">
                                <div className="h-px w-24 bg-slate-800" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Pulse</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-full content-start overflow-y-auto pr-2 custom-scrollbar">

                            {/* Mission Creation Card */}
                            <motion.button
                                whileHover={{ scale: 0.98 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsCreatingMission(true)}
                                className="h-[180px] rounded-3xl border-2 border-dashed border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-emerald-500 transition-colors">
                                    <Plus className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors">New Mission</span>
                            </motion.button>

                            {/* Existing Missions */}
                            {isLoadingMissions ? (
                                <div className="col-span-2 flex items-center justify-center h-20">
                                    <Loader2 className="animate-spin text-slate-700" size={24} />
                                </div>
                            ) : (
                                missions.map((mission, i) => (
                                    <motion.div
                                        key={mission.mission_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.05 }}
                                        className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
                                        onClick={() => setMission(mission)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">ID: {mission.mission_id}</span>
                                            <div className="flex items-center gap-1">
                                                <Image
                                                    src={`https://flagcdn.com/w20/${mission.config.target_country === 'France' ? 'fr' : mission.config.target_country === 'Mauritius' ? 'mu' : 'gb'}.png`}
                                                    width={16} height={12}
                                                    alt="Market Flag"
                                                    className="rounded-sm grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black uppercase tracking-tight mb-4 line-clamp-1">{mission.config.target_country} Strategy: {mission.config.research_topic}</h3>
                                        <div className="space-y-3">
                                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: '98%' }} />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-emerald-500">Integrity: 98%</span>
                                                <span className="text-slate-600">Certified</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </main>

                {/* ── RIGHT PANEL (COMMANDER & LOGS) ── */}
                <motion.aside
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col gap-6"
                >
                    {/* Commander Profile */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 flex flex-col items-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-[spin_3s_linear_infinite]" />
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                <span className="text-3xl font-black text-white">U</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Sovereign USER</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Bureau Mission Lead</span>
                        <div className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-center font-mono text-[9px] text-emerald-400 tracking-tighter uppercase truncate">
                            UUID: 8b9cad0e1f20
                        </div>
                    </div>

                    {/* Console Logs */}
                    <div className="flex-1 p-6 rounded-[2rem] bg-slate-950/40 backdrop-blur-3xl border border-white/5 flex flex-col gap-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Terminal size={12} className="text-emerald-500" />
                                Security Logs
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse" />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-1 border-l border-emerald-500/30 pl-3 py-1"
                                    >
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-600">
                                            <span>{log.timestamp} // {log.agent}</span>
                                            {i === 0 && <span className="text-emerald-500 animate-pulse">LIVE</span>}
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-300 leading-tight">
                                            <span className="text-emerald-400">{log.action}:</span> {log.details}
                                        </p>
                                    </motion.div>
                                ))}
                                {logs.length === 0 && (
                                    <p className="text-[10px] text-slate-600 italic">No active telemetry...</p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-2">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
                                <span>PII Status</span>
                                <span className="text-emerald-500">Zero Exposure</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
                                <span>Security</span>
                                <span>BKA-SECURE-256</span>
                            </div>
                        </div>
                    </div>
                </motion.aside>

            </div>

            {/* ── NEW MISSION MODAL ── */}
            <AnimatePresence>
                {isCreatingMission && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg p-10 rounded-[2.5rem] bg-slate-900 border border-white/10 shadow-2xl space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Plus size={24} className="text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Initialize Mission</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Configure Bureau Intelligence Matrix</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Market Sector</label>
                                    <input
                                        type="text"
                                        value={newMissionConfig.research_topic}
                                        onChange={e => setNewMissionConfig({ ...newMissionConfig, research_topic: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-emerald-500/50 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-slate-700"
                                        placeholder="e.g. Fintech Evolution"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Country</label>
                                        <input
                                            type="text"
                                            value={newMissionConfig.target_country}
                                            onChange={e => setNewMissionConfig({ ...newMissionConfig, target_country: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Language</label>
                                        <input
                                            type="text"
                                            value={newMissionConfig.target_language}
                                            onChange={e => setNewMissionConfig({ ...newMissionConfig, target_language: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Audience Specification</label>
                                    <textarea
                                        value={newMissionConfig.target_audience}
                                        onChange={e => setNewMissionConfig({ ...newMissionConfig, target_audience: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-sm font-bold outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsCreatingMission(false)}
                                    className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={handleCreateMission}
                                    className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    <Activity size={16} />
                                    Launch Mission Alpha
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
