'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Trash2, Cpu, Database, Activity, Terminal as TerminalIcon, ChevronRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HistoryItem {
    id: string;
    code: string;
    output: string;
    error: string | null;
    neuralInsight: string | null;
    timestamp: number;
}

export default function PythonInterpreterClient() {
    const [code, setCode] = useState('import pandas as pd\nimport json\n\n# AVA Kernel Test\ndata = {"metric": "Accuracy", "value": 98.4}\nprint(f"BUREAU SIGNAL: {json.dumps(data)}")\n\n# List files in backend\nimport os\nprint(f"Backend Directory Contents: {os.listdir(\'backend\')[:5]}")');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const bottomRef = useRef<HTMLDivElement>(null);

    const executeCode = async () => {
        if (!code.trim()) return;

        setIsExecuting(true);
        setStatus('running');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/python/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            if (!response.ok) throw new Error('Kernel Communication Failed');

            const result = await response.json();

            const newItem: HistoryItem = {
                id: Math.random().toString(36).substr(2, 9),
                code,
                output: result.stdout,
                error: result.error,
                neuralInsight: result.neural_insight,
                timestamp: Date.now()
            };

            setHistory(prev => [newItem, ...prev]);
            setStatus(result.error ? 'error' : 'success');
        } catch (err: any) {
            const newItem: HistoryItem = {
                id: Math.random().toString(36).substr(2, 9),
                code,
                output: '',
                error: err.message,
                neuralInsight: null,
                timestamp: Date.now()
            };
            setHistory(prev => [newItem, ...prev]);
            setStatus('error');
        } finally {
            setIsExecuting(false);
        }
    };

    const clearHistory = () => setHistory([]);

    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Python <span className="text-blue-500">Kernel</span></h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">AVA Intelligence Subsystem v2.4</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                            <span className="text-[10px] font-black uppercase text-slate-400">System Live</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Editor Section */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase ml-4">main.py</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={clearHistory}
                                            className="text-slate-500 hover:text-white transition-colors"
                                            title="Clear History"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-80 bg-transparent p-6 font-mono text-sm resize-none focus:outline-none text-emerald-100 placeholder:text-slate-700 leading-relaxed"
                                    spellCheck={false}
                                    placeholder="# Enter your Python code here..."
                                />
                                <div className="p-4 bg-white/5 flex justify-end gap-4 border-t border-white/5">
                                    <button
                                        onClick={executeCode}
                                        disabled={isExecuting}
                                        className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all
                                            ${isExecuting
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                            }
                                        `}
                                    >
                                        {isExecuting ? 'Kernel Busy...' : 'Run Module'}
                                        <Play className={`w-4 h-4 ${isExecuting ? 'animate-pulse' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Stats / Status */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Latency', value: '1.2ms', icon: Activity, color: 'text-blue-400' },
                                { label: 'Registry', value: 'Active', icon: Database, color: 'text-emerald-400' },
                                { label: 'Engine', value: '3.12.1', icon: TerminalIcon, color: 'text-amber-400' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-900/40 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    <div>
                                        <div className="text-[8px] font-black uppercase text-slate-500">{stat.label}</div>
                                        <div className="text-xs font-bold text-white">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Console Output Section */}
                    <div className="lg:col-span-5 flex flex-col h-[520px]">
                        <div className="bg-slate-900/20 border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl">
                            <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kernel Console</span>
                                <div className="p-1 px-2 rounded bg-black/40 text-[9px] font-black text-blue-400 border border-blue-500/20">STDOUT</div>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                                <AnimatePresence initial={false}>
                                    {history.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                                            <Terminal className="w-12 h-12 mb-4" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Command Input</p>
                                        </div>
                                    ) : (
                                        history.map((item, idx) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="border-b border-white/5 pb-4 last:border-0"
                                            >
                                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                    <ChevronRight className="w-3 h-3" />
                                                    <span className="text-[9px] font-mono">Run ID: {item.id}</span>
                                                </div>

                                                {item.output && (
                                                    <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/10 mb-2">
                                                        {item.output}
                                                    </pre>
                                                )}

                                                {item.error && (
                                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-3 text-red-400 mb-2">
                                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                        <pre className="font-mono text-xs whitespace-pre-wrap">{item.error}</pre>
                                                    </div>
                                                )}

                                                {item.neuralInsight && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl relative overflow-hidden group"
                                                    >
                                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                                            <ShieldCheck className="w-8 h-8 text-blue-500" />
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                            <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">AVA Neural Insight</span>
                                                        </div>
                                                        <p className="text-xs text-white font-medium leading-relaxed italic">
                                                            "{item.neuralInsight}"
                                                        </p>
                                                    </motion.div>
                                                )}

                                                {!item.output && !item.error && !item.neuralInsight && (
                                                    <div className="text-slate-600 text-xs italic">Executed with no output.</div>
                                                )}
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                                <div ref={bottomRef} />
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-3">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                <span className="text-blue-400 font-bold uppercase">Kernel Insight:</span> You have full access to the Bureau backend modules. Import <code className="text-blue-300">simulation_engine</code> or <code className="text-blue-300">architect_service</code> for direct testing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
