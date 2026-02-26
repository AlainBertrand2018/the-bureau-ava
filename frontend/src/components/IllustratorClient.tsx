'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Download, RefreshCw, Layers, ShieldCheck, Zap, DownloadCloud, PenTool } from 'lucide-react';
import { useClearance } from '@/context/ClearanceContext';
import { PaywallOverlay } from './os/PaywallOverlay';

export default function IllustratorClient() {
    const [prompt, setPrompt] = useState('A mission patch for Project Tokyo showing data streams connecting Shibuya to a central AI core.');
    const [isGenerating, setIsGenerating] = useState(false);
    const [tier, setTier] = useState<'FREE' | 'PREMIUM'>('FREE');
    const [svgCode, setSvgCode] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [facts, setFacts] = useState<string[]>([]);
    const [decisionBrief, setDecisionBrief] = useState<string | null>(null);
    const [assetId, setAssetId] = useState<string | null>(null);
    const { userEmail, setUserEmail, clearanceLevel, updateClearance, isSyncing, credits } = useClearance();
    const [history, setHistory] = useState<{ id?: string, prompt: string, svg: string }[]>([]);


    const generateIllustration = async (targetTier?: 'FREE' | 'PREMIUM') => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        const activeTier = targetTier || tier;

        try {
            const response = await fetch('http://localhost:8000/ai/illustrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, tier: activeTier })
            });

            const data = await response.json();
            if (data.svg) {
                setSvgCode(data.svg);
                setFacts(data.facts || []);
                setDecisionBrief(data.decision_brief || null);
                setAssetId(data.id || null);
                setHistory(prev => [{ id: data.id, prompt, svg: data.svg }, ...prev]);
                if (targetTier) setTier(targetTier);

                // PAYWALL LOGIC: Premium illustrations are locked initially
                if (activeTier === 'PREMIUM') {
                    setIsLocked(true);
                } else {
                    setIsLocked(false);
                }
            }
        } catch (err) {
            console.error('Illustration failed:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadSVG = () => {
        if (!svgCode) return;
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bureau-illustration-${Date.now()}.svg`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Bureau Conductor Bar */}
            <div className="bg-slate-900 border-b border-white/5 py-2 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-black text-[10px]">OS</div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Bureau Conductor</span>
                        <div className="flex items-center gap-2">
                            <input
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="bg-transparent text-[9px] text-slate-400 focus:outline-none focus:text-blue-400 transition-colors"
                            />
                            <div className={`w-1 h-1 rounded-full ${clearanceLevel >= 10 ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : clearanceLevel > 0 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500'}`} />
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4 border-l border-white/5 pl-6 mr-auto">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Mission Credits</span>
                        <span className="text-xs font-black text-amber-500 italic">{credits}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateClearance(0)}
                        className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${clearanceLevel === 0 ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        Guest
                    </button>
                    <button
                        onClick={() => updateClearance(2)}
                        className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${clearanceLevel === 2 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-white'}`}
                    >
                        Executive
                    </button>
                    <button
                        onClick={() => updateClearance(10)}
                        className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${clearanceLevel === 10 ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'text-slate-500 hover:text-white border border-purple-500/30'}`}
                    >
                        Super Admin
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
                {/* Header */}
                <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                            <PenTool className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Illustrator <span className="text-emerald-500">v1.2</span></h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Neural Asset Generation Subsystem</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4 block">Visual Directive</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-slate-300 placeholder:text-slate-700 mb-6 resize-none"
                                placeholder="Describe the diagram or asset..."
                            />

                            <button
                                onClick={() => generateIllustration('FREE')}
                                disabled={isGenerating}
                                className="w-full py-4 bg-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group mb-4"
                            >
                                {isGenerating && tier === 'FREE' ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Generate Draft
                                        <PenTool className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => generateIllustration('PREMIUM')}
                                disabled={isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:opacity-90 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {isGenerating && tier === 'PREMIUM' ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Unlock Premium Intelligence
                                        <Sparkles className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Presets/Style Guide */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'mission', label: 'Mission Patch', icon: ShieldCheck },
                                { id: 'flow', label: 'Inquiry Flow', icon: Zap },
                                { id: 'neural', label: 'Neural Map', icon: Layers },
                                { id: 'blueprint', label: 'Blueprint', icon: Palette },
                            ].map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setPrompt(`A high-end ${style.label} for ${prompt.split('for')[1] || 'Bureau Operations'}`)}
                                    className="bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors flex flex-col items-center gap-2 group"
                                >
                                    <style.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{style.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stage */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="relative group min-h-[500px]">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <div className="relative bg-black border border-white/10 rounded-[2rem] h-full overflow-hidden flex flex-col shadow-2xl">
                                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={downloadSVG}
                                            disabled={!svgCode || isLocked}
                                            className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-20"
                                        >
                                            <DownloadCloud className="w-4 h-4" />
                                            Export SVG
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 relative flex items-center justify-center p-12 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
                                    {/* Velocity Ticker */}
                                    <div className="absolute top-6 left-6 flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Sync Velocity</span>
                                            <span className="text-[10px] font-mono text-emerald-500/80">
                                                {isGenerating ? "ACCELERATING..." : "STABLE | 4.2ms LATENCY"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Evidence Scanner Animation */}
                                    <AnimatePresence mode="wait">
                                        {svgCode ? (
                                            <div className="flex flex-col lg:flex-row w-full h-full gap-8">
                                                {/* SVG Stage */}
                                                <div className="flex-1 relative group/svg flex items-center justify-center">
                                                    <motion.div
                                                        key={svgCode}
                                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1,
                                                            y: 0,
                                                            filter: isLocked ? "blur(30px)" : "blur(0px)"
                                                        }}
                                                        exit={{ opacity: 0, scale: 1.1 }}
                                                        transition={{ duration: 0.8 }}
                                                        className="w-full h-full max-w-xl max-h-xl flex items-center justify-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] Illustrator-svg-container"
                                                        dangerouslySetInnerHTML={{ __html: svgCode }}
                                                    />

                                                    <AnimatePresence>
                                                        {isLocked && (
                                                            <PaywallOverlay
                                                                isLocked={isLocked}
                                                                onUnlock={() => setIsLocked(false)}
                                                                cost={25}
                                                                title="Intelligence Encrypted"
                                                                description="Premium neural assets are subject to Bureau data-extraction fees. Allocate 25 credits to decrypt this visual intelligence."
                                                            />
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Intelligence Briefing */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="w-full lg:w-72 bg-white/5 border-l border-white/5 p-6 flex flex-col gap-6 relative"
                                                >
                                                    {isSyncing && (
                                                        <div className="absolute top-2 right-2 flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                                                            <RefreshCw className="w-2 h-2 animate-spin text-blue-400" />
                                                            <span className="text-[7px] font-black uppercase tracking-widest text-blue-400">Vault Sync</span>
                                                        </div>
                                                    )}

                                                    {assetId && (
                                                        <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-2">
                                                            ID: {assetId}
                                                        </div>
                                                    )}

                                                    {(tier === 'FREE' && clearanceLevel < 2) && (
                                                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mb-4">
                                                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                                            </div>
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Facts Restricted</h4>
                                                            <p className="text-[9px] text-slate-400 leading-tight">Purchase Enterprise Credits to unlock deep intelligence points.</p>
                                                        </div>
                                                    )}

                                                    <div className={isLocked ? "blur-md pointer-events-none select-none" : ""}>
                                                        <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-4 flex items-center gap-2">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            Intelligence Facts
                                                        </h3>
                                                        <ul className="space-y-4">
                                                            {facts.map((fact, i) => (
                                                                <motion.li
                                                                    key={i}
                                                                    initial={{ opacity: 0, x: 10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.1 }}
                                                                    className="flex gap-3 items-start"
                                                                >
                                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                                    <span className="text-[11px] text-slate-400 leading-relaxed font-medium">{fact}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {decisionBrief && (
                                                        <div className={`mt-auto pt-6 border-t border-white/5 ${isLocked ? "blur-md pointer-events-none" : ""}`}>
                                                            <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3 flex items-center gap-2">
                                                                <Zap className="w-3 h-3" />
                                                                Decision Brief
                                                            </h3>
                                                            <p className="text-xs font-bold text-white leading-relaxed italic border-l-2 border-blue-500 pl-3">
                                                                {`"${decisionBrief}"`}
                                                            </p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        ) : (
                                            <div className="text-center opacity-20">
                                                <Palette className="w-20 h-20 mx-auto mb-4" />
                                                <p className="text-xs font-black uppercase tracking-[0.5em]">Stage Empty</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Facts & Motion Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-4">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Decision Lock</p>
                                    <p className="text-[10px] text-blue-400 font-bold">EXECUTIVE READY</p>
                                </div>
                            </div>
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Fact Integrity</p>
                                    <p className="text-[10px] text-emerald-400 font-bold">AUDITED BY AVA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .Illustrator-svg-container svg {
                    width: 100%;
                    height: 100%;
                    max-height: 400px;
                }
            `}</style>
        </div>
    );
}
