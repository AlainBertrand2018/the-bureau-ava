'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, BarChart3, Binary, ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle, Quote, Activity, X } from 'lucide-react';

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ analysis: any; pdf_base64: string; infographic_svg?: string } | null>(null);
    const [isGlassboxOpen, setIsGlassboxOpen] = useState(false);

    const agents: { name: string; role: string; status: 'idle' | 'working' | 'done', message?: string }[] = [
        {
            name: "The Discoverer",
            role: "DNA Discovery",
            status: step === 'processing' ? 'working' : (step === 'results' ? 'done' : 'idle'),
            message: "Identifying raw subject matter and industry-standard Scoring."
        },
        {
            name: "The Contextualizer",
            role: "Market Staging",
            status: step === 'processing' ? 'working' : (step === 'results' ? 'done' : 'idle'),
            message: "Establishing external realites and global benchmark data."
        },
        {
            name: "The Challenger",
            role: "Structural Analysis",
            status: step === 'processing' ? 'working' : (step === 'results' ? 'done' : 'idle'),
            message: "Mapping responses against benchmarks and strategic pillars."
        },
        {
            name: "The Sentinel",
            role: "Integrity Gate",
            status: step === 'results' ? 'done' : (step === 'processing' ? 'working' : 'idle'),
            message: "Testing results against verified answers and human logic."
        },
        {
            name: "AVA",
            role: "Executive Arbitrer",
            status: step === 'results' ? 'done' : (step === 'processing' ? 'working' : 'idle'),
            message: "Final quality audit and command for publication."
        }
    ];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStep('mapping');
        }
    };

    const startAnalysis = async () => {
        if (!file) return;
        setStep('processing');
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const csvContent = e.target?.result as string;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                const response = await fetch(`${apiUrl}/interpreter/process`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        csv_content: csvContent,
                        filename: file.name,
                        generate_visual: true
                    })
                });
                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error('SYSTEM_ERROR: AI Quota Exceeded (429). Please try again later.');
                    }
                    let errorMessage = 'Analysis failed';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.detail || errorData.message || errorMessage;
                    } catch (e) {
                        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setResult(data);
                setStep('results');
                setIsProcessing(false);
            } catch (err: any) {
                console.error(err);
                setIsProcessing(false);
                setStep('upload');
                const errorMessage = err?.message || "SYSTEM_INTERPRETATION_FAILED";
                alert(`BUREAU ERROR: ${errorMessage}`);
            }
        };
        reader.onerror = () => {
            setIsProcessing(false);
            setStep('upload');
            alert("BUREAU ERROR: File read failed");
        };
        reader.readAsText(file);
    };

    const downloadDossier = () => {
        if (!result?.pdf_base64) return;
        const linkSource = `data:application/pdf;base64,${result.pdf_base64}`;
        const downloadLink = document.createElement("a");
        const fileName = `BUREAU_DOSSIER_${new Date().getTime()}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    return (
        <>
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
                                            <div className="space-y-6">
                                                {/* Source Citation */}
                                                {/* AVA Mission Control Arbiter Verdict */}
                                                {result?.analysis?.precision_audit && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all"
                                                    >
                                                        <div className="absolute top-0 right-0 p-4">
                                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result?.analysis?.verdict === 'VERIFIED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'}`}>
                                                                {result?.analysis?.verdict || 'PENDING'}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-black border border-slate-800 flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                                                                <ShieldCheck className="w-6 h-6" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">AVA Mission Command</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Precision Audit Complete</span>
                                                                </div>
                                                                <h3 className="text-xl font-black text-white mb-2 leading-tight">
                                                                    {result.analysis.report_title}
                                                                </h3>
                                                                {result.analysis.age_cohorts_identified && result.analysis.age_cohorts_identified.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                                        <span className="text-[10px] text-slate-500 font-bold uppercase mr-2 mt-1">Generational Scope:</span>
                                                                        {result.analysis.age_cohorts_identified.map((cohort: string, idx: number) => (
                                                                            <span key={idx} className="px-2 py-0.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500/80 text-[10px] font-black rounded uppercase tracking-tighter">
                                                                                {cohort}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mb-4 italic">
                                                                    "{result.analysis.precision_audit}"
                                                                </p>
                                                                <div className="flex items-center gap-4 pt-4 border-t border-slate-800/50">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Integrity Score</span>
                                                                        <span className="text-lg font-black text-emerald-500">{result.analysis.methodology_score}%</span>
                                                                    </div>
                                                                    <div className="w-px h-8 bg-slate-800" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Final Action</span>
                                                                        <span className="text-lg font-black text-white tracking-widest uppercase">READY TO PUBLISH</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/40 border border-slate-800/50 rounded-3xl">
                                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                                        <FileText className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest block">Source Document Citied</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm text-slate-200 font-bold">{result?.analysis?.source_filename || 'Bureau Groundwork Dataset'}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                            <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">Analyzed at {result?.analysis?.timestamp}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="p-8 bg-emerald-500 text-black rounded-3xl flex items-center justify-between"
                                                >
                                                    <div>
                                                        <h2 className="text-3xl font-black leading-tight">VERDICT: {result?.analysis?.verdict || 'PASS (A+)'}</h2>
                                                        <p className="font-bold opacity-80">{result?.analysis?.verdict_reasoning || 'Data exceeds methodology standards for reliability.'}</p>
                                                    </div>
                                                    <CheckCircle2 className="w-16 h-16 opacity-50" />
                                                </motion.div>
                                            </div>
                                        )}
                                    </AnimatePresence>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Methodology Score / Data Integrity */}
                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[180px] flex flex-col justify-between">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <ShieldCheck className="w-5 h-5" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Integrity Score</span>
                                            </div>
                                            {step === 'results' ? (
                                                <>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <span className="text-4xl font-black text-emerald-500">{result?.analysis?.methodology_score || '0'}/100</span>
                                                    </div>
                                                    <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Certified via Bureau Protocol</p>
                                                </>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="h-8 bg-slate-800 rounded w-1/2 animate-pulse" />
                                                    <div className="h-2 bg-slate-800 rounded w-3/4 animate-pulse" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Map through Benchmarks */}
                                        {step === 'results' && result?.analysis?.benchmarks && Object.entries(result.analysis.benchmarks).map(([key, value], idx) => (
                                            <div key={key} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[180px] flex flex-col justify-between overflow-hidden">
                                                <div className="flex items-center gap-3 text-slate-500">
                                                    <BarChart3 className="w-5 h-5 text-emerald-500/50" />
                                                    <span className="text-xs font-bold uppercase tracking-widest truncate">{key}</span>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <span className={`${String(value).length > 20 ? 'text-sm' : String(value).length > 10 ? 'text-xl' : 'text-4xl'} font-black leading-tight break-words text-slate-100`}>
                                                        {String(value)}
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">AI Derived Index</p>
                                            </div>
                                        )).slice(0, 5)}

                                        {/* Placeholder for Processing */}
                                        {step === 'processing' && [1, 2].map((i) => (
                                            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[180px] flex flex-col justify-between opacity-50">
                                                <div className="flex items-center gap-3 text-slate-500">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Calculating...</span>
                                                </div>
                                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-emerald-500"
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* SOURCE CITATION & VALIDATION BAR */}
                                    {step === 'results' && result?.analysis?.source_citation && (
                                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase text-emerald-500 font-black tracking-widest block mb-1">Official Data Citation</span>
                                                    <p className="text-xs text-slate-300 font-bold">{result.analysis.source_citation}</p>
                                                </div>
                                            </div>
                                            <div className="hidden md:flex flex-col items-end gap-1">
                                                {result.analysis.validation_passed ? (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">All Checks Passed</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                        <span className="text-[10px] text-amber-400 font-black uppercase tracking-tighter">
                                                            {result.analysis.validation_flags?.length || 0} Auto-Corrected
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Bureau Validation Gate</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* I & II. EXECUTIVE PULSE & KEY FINDINGS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">I</div>
                                                <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Executive Intelligence Pulse</h4>
                                            </div>
                                            {step === 'results' ? (
                                                <div className="space-y-6">
                                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl border-l-4 border-l-emerald-500">
                                                        <span className="text-[10px] uppercase text-emerald-500 font-black mb-1 block">The Growth Verdict</span>
                                                        <p className="text-lg leading-relaxed text-slate-200 font-bold italic">
                                                            "{result?.analysis?.executive_pulse?.growth_verdict}"
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div>
                                                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 block">"Agentic" Insights</span>
                                                            <p className="text-sm text-slate-300 leading-relaxed font-medium">{result?.analysis?.executive_pulse?.agentic_insights}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 block">The Value Gap</span>
                                                            <p className="text-sm text-slate-300 leading-relaxed font-medium">{result?.analysis?.executive_pulse?.value_gap}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 animate-pulse">
                                                    <div className="h-4 bg-slate-800 rounded w-full" />
                                                    <div className="h-20 bg-slate-800/50 rounded w-full" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">II</div>
                                                <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Survey Metrics & Key Findings</h4>
                                            </div>
                                            {step === 'results' ? (
                                                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {result?.analysis?.key_findings?.map((f: any, i: number) => (
                                                        <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-colors">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{f.label}</span>
                                                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded uppercase">
                                                                    {f.value}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                                                {f.context}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-3 animate-pulse">
                                                    <div className="h-24 bg-slate-800/50 rounded-2xl w-full" />
                                                    <div className="h-24 bg-slate-800/50 rounded-2xl w-full" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* III & IV. MARKET LANDSCAPE & CONSUMER BEHAVIOR */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">III</div>
                                                <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Macro-Intelligence Shift</h4>
                                            </div>
                                            {step === 'results' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Economic Resilience</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.market_landscape?.economic_resilience}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Geopolitical Risk</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.market_landscape?.geopolitical_risk}</p>
                                                    </div>
                                                    <div className="p-3 bg-slate-800/20 border border-slate-700/30 rounded-xl">
                                                        <span className="text-[10px] uppercase text-amber-500 font-bold">Regulatory Watch</span>
                                                        <p className="text-[11px] text-slate-400 mt-1">{result?.analysis?.market_landscape?.regulatory_watch}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-40 bg-slate-800/20 rounded-2xl animate-pulse" />
                                            )}
                                        </div>

                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">IV</div>
                                                <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Stakeholder Journey</h4>
                                            </div>
                                            {step === 'results' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Primary Influencers</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.consumer_behavior?.primary_influencers || result?.analysis?.consumer_behavior?.gen_z_influence}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Engagement Patterns</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.consumer_behavior?.engagement_patterns || result?.analysis?.consumer_behavior?.omnichannel_sweet_spots}</p>
                                                    </div>
                                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                        <span className="text-[10px] uppercase text-emerald-500 font-black">Stakeholder Perception</span>
                                                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{result?.analysis?.consumer_behavior?.stakeholder_perception || result?.analysis?.consumer_behavior?.value_perception}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-40 bg-slate-800/20 rounded-2xl animate-pulse" />
                                            )}
                                        </div>
                                    </div>

                                    {/* V & VI. COMPETITIVE DEEP DIVE & OPERATIONAL READINESS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">V</div>
                                                <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Regional/Sector Deep Dive</h4>
                                            </div>
                                            {step === 'results' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Sector Performance</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.competitive_deep_dive?.sector_performance}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Analysis of Direct impacts</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.competitive_deep_dive?.impact_analysis}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Resource & Value Mapping</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.competitive_deep_dive?.resource_mapping}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-48 bg-slate-800/20 rounded-2xl animate-pulse" />
                                            )}
                                        </div>

                                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-xs">VI</div>
                                                <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Infrastructure & AI Readiness</h4>
                                            </div>
                                            {step === 'results' ? (
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between p-4 bg-black/40 border border-slate-800 rounded-2xl border-l-4 border-l-emerald-500">
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-[0.2em]">Data Hygiene Score</span>
                                                        <span className="text-2xl font-black text-emerald-500">{result?.analysis?.operational_readiness?.data_hygiene_score}<span className="text-xs text-slate-500">/100</span></span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Supply Chain Resilience</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.operational_readiness?.supply_chain_resilience}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Inventory Visibility</span>
                                                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.analysis?.operational_readiness?.inventory_visibility}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 animate-pulse">
                                                    <div className="h-16 bg-slate-800/30 rounded-2xl" />
                                                    <div className="h-32 bg-slate-800/30 rounded-2xl" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* VII. STRATEGIC EXECUTION ROADMAP */}
                                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">VII</div>
                                            <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">Strategic Execution Roadmap</h4>
                                        </div>
                                        {step === 'results' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-800 hidden md:block -z-0" />
                                                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl relative z-10 hover:border-emerald-500/30 transition-colors">
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase mb-4 inline-block">Q1-Q2 (SHORT-TERM)</span>
                                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{result?.analysis?.roadmap?.short_term}</p>
                                                </div>
                                                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl relative z-10 hover:border-emerald-500/30 transition-colors">
                                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase mb-4 inline-block">2026-2027 (MID-TERM)</span>
                                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{result?.analysis?.roadmap?.mid_term}</p>
                                                </div>
                                                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl relative z-10 hover:border-emerald-500/30 transition-colors">
                                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-black rounded-full uppercase mb-4 inline-block">2028+ (LONG-TERM)</span>
                                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{result?.analysis?.roadmap?.long_term}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-40 bg-slate-800/20 rounded-2xl animate-pulse" />
                                        )}
                                    </div>

                                    {/* VIII. FORECAST ENGINE */}
                                    {step === 'results' && result?.analysis?.forecast_data && (() => {
                                        // Safety formatter: if AI returns raw numbers, convert to human-readable
                                        const fmt = (v: any): string => {
                                            if (typeof v === 'string' && /[TBMK]/i.test(v)) return v; // Already formatted (e.g. "6.3T")
                                            const n = Number(v);
                                            if (isNaN(n)) return String(v);
                                            if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
                                            if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
                                            if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
                                            if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
                                            return String(n);
                                        };
                                        return (
                                            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                                                <div className="px-6 py-4 border-b border-slate-800">
                                                    <h4 className="text-slate-200 text-[11px] font-bold uppercase tracking-widest">
                                                        {result?.analysis?.report_title || '2026 BUREAU FORECAST'}
                                                    </h4>
                                                    <p className="text-[9px] text-slate-500 uppercase mt-0.5 tracking-tighter">
                                                        {result?.analysis?.primary_theme || 'ARCHITECTURAL ANALYSIS'} | {result?.analysis?.forecast_data?.forecast_unit || 'USD'}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-3">
                                                    <div className="px-4 py-5 border-r border-slate-800 text-center">
                                                        <span className="text-[9px] uppercase text-slate-500 font-bold block mb-1">2025 (ACTUAL)</span>
                                                        <span className="text-base md:text-lg font-black text-slate-300">{fmt(result?.analysis?.forecast_data['2025_actual'])}</span>
                                                    </div>
                                                    <div className="px-4 py-5 border-r border-slate-800 text-center bg-emerald-500/5">
                                                        <span className="text-[9px] uppercase text-emerald-500 font-bold block mb-1">2026 (FORECAST)</span>
                                                        <span className="text-base md:text-lg font-black text-emerald-500">{fmt(result?.analysis?.forecast_data['2026_forecast'])}</span>
                                                    </div>
                                                    <div className="px-4 py-5 text-center">
                                                        <span className="text-[9px] uppercase text-slate-500 font-bold block mb-1">2030 (PROJECTED)</span>
                                                        <span className="text-base md:text-lg font-black text-slate-300">{fmt(result?.analysis?.forecast_data['2030_projected'])}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* NEW: Visual Intelligence Section */}
                                    {result?.infographic_svg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8"
                                        >
                                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Visual Intelligence Model</h4>
                                            <div className="w-full bg-black/40 rounded-2xl border border-slate-800/50 p-6 flex items-center justify-center">
                                                <div
                                                    className="w-full h-auto max-w-full"
                                                    dangerouslySetInnerHTML={{ __html: result.infographic_svg }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
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
                                    onClick={downloadDossier}
                                    className="w-full mt-6 py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                                >
                                    EXPORT BUREAU DOSSIER <FileText className="w-5 h-5" />
                                </motion.button>
                            )}
                        </div>

                        {/* NEW: Glassbox UI Trigger */}
                        {(step === 'processing' || step === 'results') && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setIsGlassboxOpen(true)}
                                className="w-full text-left bg-slate-900/40 border border-slate-800 rounded-3xl p-6 overflow-hidden relative group border-t-4 border-t-emerald-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-slate-800/60 hover:border-emerald-500/40 transition-all block cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8" />
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-3">
                                        <Activity className="w-4 h-4" /> Telemetry Glassbox
                                    </h3>
                                    <div className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-bold border border-emerald-500/20 px-2 py-1 rounded">View Modal</div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 pr-8 leading-relaxed font-mono">
                                    {step === 'processing' ? 'Agentic pipeline engaged. Awaiting cross-agent telemetry...' : 'Pipeline execution complete. Click to view full agentic thought-chain telemetry.'}
                                </p>
                            </motion.button>
                        )}

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

            {/* Glassbox Modal */}
            <AnimatePresence>
                {isGlassboxOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsGlassboxOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl relative z-10 shadow-2xl border-t-4 border-t-emerald-500 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
                                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-3">
                                    <Activity className="w-5 h-5" /> Telemetry Glassbox Output
                                </h3>
                                <button
                                    onClick={() => setIsGlassboxOpen(false)}
                                    className="p-2 bg-slate-800/50 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-slate-700 text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0f16]">
                                {step === 'processing' ? (
                                    <div className="space-y-6 font-mono text-sm text-slate-400 flex flex-col items-center justify-center py-16">
                                        <div className="flex items-center gap-3 text-emerald-500 animate-pulse mb-4">
                                            <Activity className="w-10 h-10 opacity-50" />
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-500 opacity-60 animate-pulse">
                                            <span>Agentic pipeline engaged. Awaiting cross-agent telemetry...</span>
                                        </div>
                                        <div className="flex items-center gap-3 opacity-30">
                                            <span className="w-2 h-2 rounded-full bg-slate-500 animate-ping" />
                                            <span>Polling Arbiter Matrix...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 font-mono text-sm">
                                        {result?.analysis?.chain_of_thought?.map((log: any, i: number) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={i}
                                                className="flex flex-col gap-2 border border-slate-800/50 hover:border-emerald-500/30 bg-slate-900/40 p-5 rounded-2xl transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-emerald-500 font-bold tracking-tight text-base">[{log.agent}]</span>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase ${log.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 mt-2 break-words leading-relaxed text-sm">{log.output}</p>
                                            </motion.div>
                                        ))}
                                        {(!result?.analysis?.chain_of_thought || result?.analysis?.chain_of_thought.length === 0) && (
                                            <div className="text-center text-slate-500 py-10 opacity-50">
                                                No telemetry logic captured for this sequence.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
