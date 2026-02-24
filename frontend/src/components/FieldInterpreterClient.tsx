'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, BarChart3, Binary, ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AgentCard = ({ name, role, status, message }: { name: string, role: string, status: 'idle' | 'working' | 'done', message?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border ${status === 'working' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800'}`}
    >
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'done' ? 'bg-emerald-500' : status === 'working' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}>
                    {status === 'done' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Loader2 className={`w-5 h-5 ${status === 'working' ? 'animate-spin' : 'text-slate-500'}`} />}
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm">{name}</h4>
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">{role}</p>
                </div>
            </div>
            {status === 'done' && <span className="text-emerald-500 text-xs font-bold font-mono">ACTIVE</span>}
        </div>
        <AnimatePresence>
            {message && (
                <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="text-slate-400 text-sm mt-2 border-l-2 border-emerald-500/30 pl-3"
                >
                    "{message}"
                </motion.p>
            )}
        </AnimatePresence>
    </motion.div>
);

export default function FieldInterpreterClient() {
    const [step, setStep] = useState<'upload' | 'mapping' | 'processing' | 'results'>('upload');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [file, setFile] = useState<File | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isProcessing, setIsProcessing] = useState(false);

    const agents: { name: string; role: string; status: 'idle' | 'working' | 'done'; message: string }[] = [
        {
            name: 'Sentinel',
            role: 'Data Intake Agent',
            status: step === 'processing' ? 'working' : step === 'results' ? 'done' : 'idle',
            message: 'Normalizing row vectors and protecting data integrity.'
        },
        {
            name: 'Analytics',
            role: 'Quant Engine',
            status: step === 'results' ? 'done' : 'idle',
            message: 'Hunting for statistical anomalies and p-value outliers.'
        },
        {
            name: 'Synthesis',
            role: 'Narrative Coder',
            status: step === 'results' ? 'done' : 'idle',
            message: 'Transforming semantic clusters into a Bureau Verdict.'
        }
    ];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setTimeout(() => setStep('mapping'), 800);
        }
    };

    const startAnalysis = () => {
        setStep('processing');
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('results');
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                        <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">Agentic Council v2.0</span>
                    </div>
                    <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Global Research Protocol</span>
                    </div>
                </div>
                <h1 className="text-5xl font-black mb-4 tracking-tight">
                    Field Data <span className="text-emerald-500 underline decoration-emerald-500/30">Interpreter</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                    Upload your raw groundwork data. Our agentic collective will extract themes,
                    verify statistical significance, and certify your findings in real-time.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative h-[400px] rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center p-12 cursor-pointer overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Upload className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Drop your Survey CSV here</h3>
                                <p className="text-slate-400 mb-8 text-center max-w-sm">Accepted formats: .csv, .xlsx, .xls. No limits on row count.</p>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleUpload}
                                />
                                <button className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-3">
                                    Browse Files <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {step === 'mapping' && (
                            <motion.div
                                key="mapping"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Sentinel Inference</h3>
                                        <p className="text-slate-400 text-sm">Sentinel has analyzed your headers and proposed a mapping.</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-emerald-500 text-xs font-bold">94% Confidence</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { from: 'Col_A (Numeric)', to: 'Respondent_Age', type: 'DEMOGRAPHIC' },
                                        { from: 'Col_D (Text)', to: 'Satisfaction_Reason', type: 'QUALITATIVE' },
                                        { from: 'Col_G (Scale 1-5)', to: 'Pricing_Sensitivity', type: 'QUANTITATIVE' }
                                    ].map((m, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-slate-800/50">
                                            <div className="flex-1">
                                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Source Column</span>
                                                <code className="text-emerald-400 text-sm font-mono">{m.from}</code>
                                            </div>
                                            <ArrowRight className="text-slate-700" />
                                            <div className="flex-1">
                                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Bureau Variable</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold">{m.to}</span>
                                                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[11px] rounded font-bold uppercase">{m.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]" onClick={startAnalysis}>
                                        AUTHORIZE ANALYSIS <ShieldCheck className="w-5 h-5" />
                                    </button>
                                    <button className="px-8 py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 transition-colors" onClick={() => setStep('upload')}>
                                        RESET
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {(step === 'processing' || step === 'results') && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <AnimatePresence>
                                    {step === 'results' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="p-8 bg-emerald-500 text-black rounded-3xl flex items-center justify-between"
                                        >
                                            <div>
                                                <h2 className="text-3xl font-black leading-tight">VERDICT: PASS (A+)</h2>
                                                <p className="font-bold opacity-80">Data exceeds methodology standards for reliability.</p>
                                            </div>
                                            <CheckCircle2 className="w-16 h-16 opacity-50" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[200px] flex flex-col justify-between">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <BarChart3 className="w-5 h-5" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Pricing Sentiment</span>
                                        </div>
                                        {step === 'results' ? (
                                            <div>
                                                <span className="text-4xl font-black">7.2/10</span>
                                                <p className="text-emerald-500 text-xs font-bold mt-1">+12% vs. Last Month</p>
                                            </div>
                                        ) : (
                                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-emerald-500"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[200px] flex flex-col justify-between">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Binary className="w-5 h-5" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Data Integrity</span>
                                        </div>
                                        {step === 'results' ? (
                                            <div>
                                                <span className="text-4xl font-black">HIGH</span>
                                                <p className="text-slate-500 text-xs font-bold mt-1">Normalized Row Count: 1,240</p>
                                            </div>
                                        ) : (
                                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-emerald-500"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 min-h-[150px]">
                                    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Bureau Executive Summary</h4>
                                    {step === 'results' ? (
                                        <p className="text-lg leading-relaxed text-slate-200 font-medium">
                                            The fieldwork confirms a strong positive correlation between urban residency and price
                                            acceptance. However, a significant "Polarization Event" was detected in the coastal
                                            segments. We recommend pivoting marketing to the 18-35 age bracket where traction is highest.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
                                            <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
                                            <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4" /> Agentic Council
                        </h3>
                        <div className="space-y-4">
                            {agents.map((agent, i) => (
                                <AgentCard key={i} {...agent} />
                            ))}
                        </div>

                        {step === 'results' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full mt-6 py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                            >
                                EXPORT BUREAU DOSSIER <FileText className="w-5 h-5" />
                            </motion.button>
                        )}
                    </div>

                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <AlertCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-emerald-500 mb-1">Scientific Disclosure</h5>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Results final. All findings triangulated via the Bureau standard:
                                    Quant (Analytics) + Qual (Synthesis) + Synthetic Control (Twin Sim).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
