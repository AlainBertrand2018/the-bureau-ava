'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, ArrowRight, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Download, Eye, X, Activity, Search, BarChart3, Shield, Award } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface AgentPhase {
    id: string;
    name: string;
    role: string;
    icon: React.ElementType;
    status: 'idle' | 'working' | 'done' | 'error';
    message?: string;
}

interface StreamEvent {
    type: 'phase_start' | 'phase_complete' | 'report' | 'error';
    agent: string;
    data: Record<string, any>;
    ts: string;
}

/* ═══════════════════════════════════════════════════════════════
   AGENT CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const AgentCard = ({ phase }: { phase: AgentPhase }) => {
    const Icon = phase.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border transition-all duration-500 ${phase.status === 'working'
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.15)]'
                : phase.status === 'done'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : phase.status === 'error'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-slate-900/50 border-slate-800'
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${phase.status === 'done' ? 'bg-emerald-500 text-white' : phase.status === 'working' ? 'bg-emerald-500/20 text-emerald-400' : phase.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                        {phase.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : phase.status === 'working' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">{phase.name}</h4>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">{phase.role}</p>
                    </div>
                </div>
                {phase.status === 'done' && <span className="text-emerald-500 text-[10px] font-black tracking-widest">✓ DONE</span>}
                {phase.status === 'working' && <span className="text-emerald-400 text-[10px] font-black tracking-widest animate-pulse">ACTIVE</span>}
            </div>
            <AnimatePresence>
                {phase.message && (
                    <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-slate-400 text-xs mt-2 border-l-2 border-emerald-500/30 pl-3 leading-relaxed italic"
                    >
                        &quot;{phase.message}&quot;
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function FieldInterpreterClient() {
    const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<{ analysis: any; pdf_base64: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isGlassboxOpen, setIsGlassboxOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultPhases: AgentPhase[] = [
        { id: 'ingestion', name: 'Clean at Source', role: 'Data Ingestion', icon: Upload, status: 'idle' },
        { id: 'discoverer', name: 'The Discoverer', role: 'Phase 1 — Data DNA', icon: Search, status: 'idle' },
        { id: 'contextualizer', name: 'The Contextualizer', role: 'Phase 2 — Intelligent Cell', icon: BarChart3, status: 'idle' },
        { id: 'challenger', name: 'The Challenger', role: 'Phase 3 — Intelligent Row', icon: Activity, status: 'idle' },
        { id: 'sentinel', name: 'The Sentinel', role: 'Phase 4 — Intelligent Column', icon: Shield, status: 'idle' },
        { id: 'ava', name: 'AVA', role: 'Phase 5 — Intelligent Grid', icon: Award, status: 'idle' },
    ];

    const [phases, setPhases] = useState<AgentPhase[]>(defaultPhases);

    const updatePhase = useCallback((agentId: string, update: Partial<AgentPhase>) => {
        setPhases(prev => prev.map(p => p.id === agentId ? { ...p, ...update } : p));
    }, []);

    /* ─── File Upload Handler ─── */
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    /* ─── Drop Handler ─── */
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
                setFile(droppedFile);
                setError(null);
            }
        }
    };

    /* ─── STREAM ANALYSIS ─── */
    const startAnalysis = async () => {
        if (!file) return;
        setStep('processing');
        setError(null);
        setResult(null);
        setPhases(defaultPhases);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const csvContent = e.target?.result as string;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                const response = await fetch(`${apiUrl}/interpreter/process`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ csv_content: csvContent, filename: file.name })
                });

                if (!response.ok) {
                    let errorMsg = 'Analysis failed';
                    try { const ed = await response.json(); errorMsg = ed.detail || errorMsg; } catch { errorMsg = `HTTP ${response.status}`; }
                    throw new Error(errorMsg);
                }

                // Read NDJSON stream
                const streamReader = response.body?.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                if (!streamReader) throw new Error('Stream unavailable');

                while (true) {
                    const { done, value } = await streamReader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const event: StreamEvent = JSON.parse(line);
                            handleStreamEvent(event);
                        } catch { /* skip malformed lines */ }
                    }
                }

                // Process any remaining buffer
                if (buffer.trim()) {
                    try {
                        const event: StreamEvent = JSON.parse(buffer);
                        handleStreamEvent(event);
                    } catch { /* skip */ }
                }

            } catch (err: any) {
                console.error(err);
                setError(err?.message || 'Analysis failed');
                setStep('upload');
            }
        };
        reader.onerror = () => { setError('File read failed'); setStep('upload'); };
        reader.readAsText(file);
    };

    /* ─── Stream Event Handler ─── */
    const handleStreamEvent = (event: StreamEvent) => {
        switch (event.type) {
            case 'phase_start':
                updatePhase(event.agent, { status: 'working', message: event.data.message });
                break;
            case 'phase_complete':
                updatePhase(event.agent, { status: 'done', message: event.data.message });
                break;
            case 'report':
                setResult({
                    analysis: event.data.analysis,
                    pdf_base64: event.data.pdf_base64,
                });
                setStep('results');
                break;
            case 'error':
                updatePhase(event.agent, { status: 'error', message: event.data.message });
                if (event.data.is_quota) {
                    setError('AI Quota Exceeded (429). Please try again later.');
                } else {
                    setError(event.data.message);
                }
                setStep('upload');
                break;
        }
    };

    /* ─── Download Handlers ─── */
    const downloadDossier = () => {
        if (!result?.pdf_base64) return;
        const blob = new Blob([atob(result.pdf_base64)], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `BUREAU_DOSSIER_${Date.now()}.html`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const resetAll = () => {
        setStep('upload');
        setFile(null);
        setResult(null);
        setError(null);
        setPhases(defaultPhases);
        setIsGlassboxOpen(false);
        setIsPreviewOpen(false);
    };

    /* ═══════════════════════════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════════════════════════ */

    const analysis = result?.analysis;

    return (
        <>
            <div className="min-h-screen bg-black text-white p-4 md:p-8">
                <div className="max-w-7xl mx-auto mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                            <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">Intelligent Grid v2.0</span>
                        </div>
                        <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Kantar Protocol</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Field Data <span className="text-emerald-500 underline decoration-emerald-500/30">Interpreter</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                        Upload your survey results. The 5-phase Intelligent Grid will extract themes,
                        cross-tabulate segments, validate integrity, and generate a consultant-grade dossier.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── MAIN COLUMN ── */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {/* ── UPLOAD STEP ── */}
                            {step === 'upload' && (
                                <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }}>
                                    {error && (
                                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                            <div>
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-0.5">Bureau Error</span>
                                                <p className="text-sm text-red-300">{error}</p>
                                            </div>
                                            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                                        </div>
                                    )}

                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className={`relative h-[320px] rounded-3xl border-2 border-dashed ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-emerald-500/50'} transition-all flex flex-col items-center justify-center p-12 cursor-pointer overflow-hidden group`}
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {file ? (
                                            <>
                                                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                                                    <FileText className="w-8 h-8 text-emerald-500" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-1 text-emerald-400">{file.name}</h3>
                                                <p className="text-slate-500 text-sm mb-6">{(file.size / 1024).toFixed(1)} KB</p>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={startAnalysis}
                                                        className="px-8 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                    >
                                                        START ANALYSIS <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => setFile(null)} className="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700">
                                                        CHANGE FILE
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-10 h-10 text-emerald-500" />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">Drop your Survey CSV here</h3>
                                                <p className="text-slate-400 mb-8 text-center max-w-sm">Accepted: .csv — Upload your raw field results for analysis.</p>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-3"
                                                >
                                                    Browse Files <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".csv"
                                            onChange={handleUpload}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* ── PROCESSING STEP ── */}
                            {step === 'processing' && (
                                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    <div className="p-6 bg-slate-900/40 border border-emerald-500/20 rounded-3xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                                            <h3 className="text-lg font-bold">Intelligent Grid Processing</h3>
                                        </div>
                                        <p className="text-slate-400 text-sm">
                                            The 5-phase pipeline is analyzing <span className="text-emerald-400 font-bold">{file?.name}</span>. Each agent will report in real-time below.
                                        </p>
                                        <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── RESULTS STEP ── */}
                            {step === 'results' && analysis && (
                                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                                    {/* Grade & Verdict Banner */}
                                    <div className="p-6 bg-emerald-500 text-black rounded-3xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-1">Bureau Verdict</p>
                                            <h2 className="text-3xl font-black leading-tight">
                                                Grade: {analysis.report_grade || 'A'} — {analysis.verdict || 'VERIFIED'}
                                            </h2>
                                            <p className="font-bold opacity-80 mt-1">{analysis.validation_report || 'Analysis meets Bureau Gold Standard.'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-5xl font-black opacity-30">{analysis.integrity_score || 0}</div>
                                            <div className="text-xs font-black opacity-50">/ 100</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4">
                                        <button onClick={downloadDossier} className="flex-1 min-w-[200px] px-6 py-4 bg-slate-900 border border-emerald-500/30 text-emerald-400 font-black rounded-2xl hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-3">
                                            <Download className="w-5 h-5" /> EXPORT DOSSIER (HTML)
                                        </button>
                                        <button onClick={() => setIsPreviewOpen(true)} className="flex-1 min-w-[200px] px-6 py-4 bg-slate-900 border border-slate-700 text-white font-black rounded-2xl hover:border-emerald-500/30 transition-all flex items-center justify-center gap-3">
                                            <Eye className="w-5 h-5" /> PREVIEW REPORT
                                        </button>
                                        <button onClick={() => setIsGlassboxOpen(true)} className="px-6 py-4 bg-slate-900 border border-slate-800 text-slate-400 font-black rounded-2xl hover:border-blue-500/30 transition-all flex items-center justify-center gap-3">
                                            <Activity className="w-4 h-4" /> GLASSBOX
                                        </button>
                                        <button onClick={resetAll} className="px-6 py-4 bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-2xl hover:text-white transition-all">
                                            NEW ANALYSIS
                                        </button>
                                    </div>

                                    {/* AVA Precision Audit */}
                                    {analysis.precision_audit && (
                                        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">AVA Precision Audit</span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{analysis.precision_audit}&quot;</p>
                                        </div>
                                    )}

                                    {/* I. Executive Summary */}
                                    <ReportSection num="I" title="Executive Summary">
                                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{analysis.executive_summary}</p>
                                        {analysis.executive_addendum && (
                                            <p className="text-sm text-slate-400 leading-relaxed italic mt-4 pt-4 border-t border-slate-800">{analysis.executive_addendum}</p>
                                        )}
                                    </ReportSection>

                                    {/* II. Methodology */}
                                    <ReportSection num="II" title="Methodology & Data Quality">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <MetricCard label="Records" value={analysis.row_count} />
                                            <MetricCard label="Fields" value={analysis.col_count} />
                                            <MetricCard label="Scoring" value={analysis.scoring_standard || 'N/A'} small />
                                            <MetricCard label="Confidence" value={analysis.confidence_level || 'MEDIUM'} small />
                                        </div>
                                        {analysis.data_quality_notes && <p className="text-xs text-slate-400 leading-relaxed">{analysis.data_quality_notes}</p>}
                                    </ReportSection>

                                    {/* III. Respondent Profile */}
                                    {analysis.respondent_profile && (
                                        <ReportSection num="III" title="Respondent Profile">
                                            <p className="text-sm text-slate-300 leading-relaxed">{analysis.respondent_profile?.demographic_breakdown}</p>
                                            {analysis.age_cohorts_identified?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {analysis.age_cohorts_identified.map((c: string, i: number) => (
                                                        <span key={i} className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase">{c}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </ReportSection>
                                    )}

                                    {/* IV. Key Findings */}
                                    {analysis.key_findings?.length > 0 && (
                                        <ReportSection num="IV" title="Key Findings">
                                            <div className="space-y-4">
                                                {analysis.key_findings.map((f: any, i: number) => (
                                                    <FindingCard key={i} index={i} finding={f} />
                                                ))}
                                            </div>
                                        </ReportSection>
                                    )}

                                    {/* V. Cross-Tabulation */}
                                    {analysis.cross_tabulations?.length > 0 && (
                                        <ReportSection num="V" title="Cross-Tabulation Analysis">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {analysis.cross_tabulations.map((ct: any, i: number) => (
                                                    <div key={i} className="p-4 bg-black/30 border border-slate-800 rounded-2xl">
                                                        <span className="text-emerald-500 text-xs font-bold block mb-2">{ct.variables}</span>
                                                        <p className="text-sm text-slate-300 leading-relaxed">{ct.insight}</p>
                                                        {ct.significance && <span className="text-[10px] text-slate-500 font-bold mt-2 block">{ct.significance}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </ReportSection>
                                    )}

                                    {/* VI. Sentiment */}
                                    {analysis.sentiment_analysis && (
                                        <ReportSection num="VI" title="Sentiment & Thematic Analysis">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <MetricCard label="Overall" value={analysis.sentiment_analysis.overall_sentiment?.toUpperCase() || 'N/A'} small />
                                                <MetricCard label="Distribution" value={analysis.sentiment_analysis.sentiment_distribution || 'N/A'} small />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {analysis.sentiment_analysis.top_positive_themes?.length > 0 && (
                                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider block mb-2">Positive Themes</span>
                                                        <ul className="space-y-1">{analysis.sentiment_analysis.top_positive_themes.map((t: string, i: number) => <li key={i} className="text-xs text-slate-300">• {t}</li>)}</ul>
                                                    </div>
                                                )}
                                                {analysis.sentiment_analysis.top_negative_themes?.length > 0 && (
                                                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                                        <span className="text-[10px] text-red-400 font-black uppercase tracking-wider block mb-2">Negative Themes</span>
                                                        <ul className="space-y-1">{analysis.sentiment_analysis.top_negative_themes.map((t: string, i: number) => <li key={i} className="text-xs text-slate-300">• {t}</li>)}</ul>
                                                    </div>
                                                )}
                                            </div>
                                        </ReportSection>
                                    )}

                                    {/* VII. Statistical Deep Dive */}
                                    {analysis.statistical_deep_dive && (
                                        <ReportSection num="VII" title="Statistical Deep Dive">
                                            {analysis.statistical_deep_dive.descriptive_statistics && (
                                                <p className="text-sm text-slate-300 leading-relaxed mb-4">{analysis.statistical_deep_dive.descriptive_statistics}</p>
                                            )}
                                            {analysis.statistical_deep_dive.regression_insights?.length > 0 && (
                                                <div className="space-y-3">
                                                    <span className="text-[10px] text-blue-400 font-black uppercase tracking-wider">Regression Insights</span>
                                                    {analysis.statistical_deep_dive.regression_insights.map((r: any, i: number) => (
                                                        <div key={i} className="p-4 bg-blue-500/5 border-l-2 border-blue-500/40 rounded-r-xl">
                                                            <span className="text-sm font-bold text-blue-300">{r.predictor} → {r.outcome}</span>
                                                            <p className="text-xs text-slate-400 mt-1">{r.relationship}</p>
                                                            <p className="text-xs text-slate-500 italic mt-1">{r.interpretation}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ReportSection>
                                    )}

                                    {/* VIII. Benchmarking */}
                                    {analysis.industry_benchmarks && Object.keys(analysis.industry_benchmarks).length > 0 && (
                                        <ReportSection num="VIII" title="Industry Benchmarking">
                                            {analysis.market_realities && <p className="text-sm text-slate-300 leading-relaxed mb-4">{analysis.market_realities}</p>}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {Object.entries(analysis.industry_benchmarks).map(([k, v]) => (
                                                    <MetricCard key={k} label={k.replace(/_/g, ' ')} value={String(v)} small />
                                                ))}
                                            </div>
                                        </ReportSection>
                                    )}

                                    {/* IX. Recommendations */}
                                    {analysis.strategic_recommendations && (
                                        <ReportSection num="IX" title="Strategic Recommendations">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-800 hidden md:block -z-0" />
                                                <RecBlock label="SHORT-TERM (0-3 Mo)" items={analysis.strategic_recommendations.short_term} color="emerald" />
                                                <RecBlock label="MID-TERM (3-12 Mo)" items={analysis.strategic_recommendations.mid_term} color="blue" />
                                                <RecBlock label="LONG-TERM (12+ Mo)" items={analysis.strategic_recommendations.long_term} color="purple" />
                                            </div>
                                        </ReportSection>
                                    )}

                                    {/* X. Risk Assessment */}
                                    {analysis.risk_flags?.length > 0 && (
                                        <ReportSection num="X" title="Risk Assessment & Limitations">
                                            <div className="space-y-3">
                                                {analysis.risk_flags.map((rf: any, i: number) => {
                                                    const sevColor = rf.severity === 'HIGH' ? 'red' : rf.severity === 'MEDIUM' ? 'amber' : 'emerald';
                                                    return (
                                                        <div key={i} className={`p-4 bg-${sevColor}-500/5 border border-${sevColor}-500/10 rounded-2xl`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded text-${sevColor}-400 bg-${sevColor}-500/20 uppercase`}>{rf.severity}</span>
                                                                <span className="text-sm font-bold text-slate-200">{typeof rf === 'string' ? rf : rf.flag}</span>
                                                            </div>
                                                            {rf.mitigation && <p className="text-xs text-slate-400 mt-1">Mitigation: {rf.mitigation}</p>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ReportSection>
                                    )}

                                    {/* Source Citation */}
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                                        <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        <div>
                                            <span className="text-[10px] uppercase text-emerald-500 font-black tracking-widest block">Source</span>
                                            <span className="text-xs text-slate-300 font-bold">{analysis.source_filename} — {analysis.row_count} records — {analysis.timestamp}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── SIDEBAR: Agent Council ── */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4" /> Intelligent Grid
                            </h3>
                            <div className="space-y-3">
                                {phases.map((phase) => <AgentCard key={phase.id} phase={phase} />)}
                            </div>
                        </div>

                        {/* Token Telemetry */}
                        {step === 'results' && analysis && (
                            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-3">
                                    <Activity className="w-4 h-4" /> Telemetry
                                </h3>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between"><span className="text-slate-500">Tokens In</span><span className="font-mono text-emerald-400">{analysis.tokens_in?.toLocaleString() || 0}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Tokens Out</span><span className="font-mono text-emerald-400">{analysis.tokens_out?.toLocaleString() || 0}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Report Grade</span><span className="font-mono text-white font-bold">{analysis.report_grade || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Integrity</span><span className="font-mono text-emerald-400">{analysis.integrity_score || 0}/100</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── GLASSBOX MODAL ── */}
            <AnimatePresence>
                {isGlassboxOpen && analysis?.chain_of_thought && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsGlassboxOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-black text-white">Glassbox — Chain of Thought</h2>
                                </div>
                                <button onClick={() => setIsGlassboxOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4">
                                {analysis.chain_of_thought.map((step: any, i: number) => (
                                    <div key={i} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-2 h-2 rounded-full ${step.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{step.agent}</span>
                                            <span className="text-[10px] text-slate-500 font-bold">{step.status}</span>
                                        </div>
                                        <p className="text-sm text-slate-300">{step.output}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── PREVIEW MODAL ── */}
            <AnimatePresence>
                {isPreviewOpen && result?.pdf_base64 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
                            <div className="flex items-center justify-between px-6 py-3 bg-slate-100 border-b">
                                <span className="text-sm font-bold text-slate-700">Report Preview</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={downloadDossier} className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-400">Download</button>
                                    <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <iframe
                                srcDoc={atob(result.pdf_base64)}
                                className="w-full flex-1 min-h-[70vh]"
                                title="Report Preview"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const ReportSection = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">{num}</div>
            <h4 className="text-slate-200 text-xs font-bold uppercase tracking-widest">{title}</h4>
        </div>
        {children}
    </div>
);

const MetricCard = ({ label, value, small }: { label: string; value: string | number; small?: boolean }) => (
    <div className="p-3 bg-black/30 border border-slate-800 rounded-xl">
        <span className="text-[9px] uppercase text-slate-500 font-black tracking-wider block mb-1">{label}</span>
        <span className={`${small ? 'text-sm' : 'text-xl'} font-black text-emerald-400`}>{value}</span>
    </div>
);

const FindingCard = ({ index, finding }: { index: number; finding: any }) => {
    const priorityColors: Record<string, string> = { HIGH: 'text-red-400 bg-red-500/10 border-red-500/20', MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20', LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    const p = finding.priority || 'MEDIUM';
    return (
        <div className="p-5 bg-black/30 border border-slate-800 rounded-2xl hover:border-emerald-500/20 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
                <span className="text-2xl font-black text-emerald-500/30">{String(index + 1).padStart(2, '0')}</span>
                <span className={`px-2 py-0.5 text-[9px] font-black rounded border ${priorityColors[p] || priorityColors.MEDIUM} uppercase`}>{p}</span>
            </div>
            <h5 className="text-sm font-bold text-white mb-3 leading-relaxed">{typeof finding === 'string' ? finding : finding.finding}</h5>
            {finding.evidence && <div className="mb-2"><span className="text-[9px] text-emerald-500 font-black uppercase tracking-wider">Evidence</span><p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{finding.evidence}</p></div>}
            {finding.impact && <div className="mb-2"><span className="text-[9px] text-blue-400 font-black uppercase tracking-wider">Impact</span><p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{finding.impact}</p></div>}
            {finding.recommendation && <div><span className="text-[9px] text-amber-400 font-black uppercase tracking-wider">Recommendation</span><p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{finding.recommendation}</p></div>}
        </div>
    );
};

const RecBlock = ({ label, items, color }: { label: string; items: string[] | string; color: string }) => {
    const colorMap: Record<string, string> = { emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20', purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
    const list = Array.isArray(items) ? items : [items];
    return (
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl relative z-10 hover:border-emerald-500/30 transition-colors">
            <span className={`px-3 py-1 ${colorMap[color]} text-[10px] font-black rounded-full uppercase mb-4 inline-block border`}>{label}</span>
            <ul className="space-y-2">
                {list.filter(Boolean).map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
                        <span className="text-emerald-500/50 flex-shrink-0">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};
