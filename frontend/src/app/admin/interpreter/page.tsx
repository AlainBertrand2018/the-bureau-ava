"use client";
import React, { useState, useRef } from "react";
import {
    Upload,
    FileText,
    Zap,
    CheckCircle2,
    Download,
    BarChart3,
    BrainCircuit,
    ShieldCheck,
    Loader2,
    Eye,
    ChevronRight,
    Lock,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
    analysis: {
        executive_summary: string;
        key_insights: string[];
        psychographic_profile: string;
        methodology_score: number;
        benchmarks: Record<string, string>;
        flaws: string[];
        narrative_report: string;
        row_count: number;
        col_count: number;
        timestamp: string;
    };
    pdf_base64: string;
    infographic_svg?: string;
}

export default function InterpreterPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
            setError("SYSTEM ERROR: INVALID FILE FORMAT. CSV REQUIRED.");
            return;
        }
        setFile(selectedFile);
        setError(null);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const processData = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvContent = e.target?.result as string;

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const response = await fetch(`${apiUrl}/interpreter/process`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        csv_content: csvContent,
                        generate_visual: true
                    }),
                });

                if (!response.ok) throw new Error("Processing failed");
                const data = await response.json();
                setResults(data);
                setIsProcessing(false);
            };
            reader.readAsText(file);
        } catch (err) {
            setError("AUTHORIZATION ERROR: DATA INTERPRETATION FAILED.");
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!results) return;
        const linkSource = `data:application/pdf;base64,${results.pdf_base64}`;
        const downloadLink = document.createElement("a");
        const fileName = `BUREAU_INTELLIGENCE_${results.analysis.timestamp.replace(/[: ]/g, '_')}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    return (
        <div className="space-y-10 max-w-7xl pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        FIELD DATA INTERPRETER
                        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-500 tracking-widest uppercase font-black">Beta v1.0</div>
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl">
                        Autonomous psychographic decoding. Upload raw CSV survey data for thorough industry-standard analysis and encrypted reporting.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Encrypted Protocol Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Uploader Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        className={`relative group h-96 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                            } ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                            className="hidden"
                            accept=".csv"
                        />

                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${file ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                            {file ? <CheckCircle2 size={40} /> : <Upload size={40} />}
                        </div>

                        {file ? (
                            <div className="space-y-1">
                                <p className="text-white font-black text-sm uppercase truncate max-w-[200px]">{file.name}</p>
                                <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Awaiting Decryption</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-white font-black text-sm uppercase">Drop CSV File</p>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    or <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 hover:underline">Select from Terminal</button>
                                </p>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center gap-3">
                            <Lock size={14} className="text-slate-600" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter text-left">
                                Bureau Security Note: All files are processed in-memory and encrypted. Zero-Log policy applied.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={processData}
                        disabled={!file || isProcessing}
                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${!file || isProcessing
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Analyzing Field Results...
                            </>
                        ) : (
                            <>
                                <BrainCircuit size={18} />
                                Start Bureau Analysis
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                            <AlertCircle size={14} className="shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{error}</span>
                        </div>
                    )}
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence mode="wait">
                        {!results ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center p-20 bg-slate-900/20 border border-slate-800 rounded-[3rem] text-center border-dashed"
                            >
                                <BarChart3 size={60} className="text-slate-800 mb-6" />
                                <h3 className="text-slate-600 font-black text-lg uppercase tracking-tighter">Awaiting Signal Ingestion</h3>
                                <p className="text-slate-700 text-sm max-w-xs mt-2">Upload your survey results to initiate the deep psychographic interpretation cycle.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Results Overview Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Integrity Score</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-blue-500">{results.analysis.methodology_score}</span>
                                            <span className="text-slate-500 font-bold text-xs">/100</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Records</p>
                                        <span className="text-4xl font-black text-white">{results.analysis.row_count.toLocaleString()}</span>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bureau Certificate</p>
                                        <button
                                            onClick={downloadPdf}
                                            className="flex items-center justify-between group mt-2"
                                        >
                                            <span className="text-xs font-black text-emerald-500 uppercase group-hover:underline">Export PDF</span>
                                            <Download size={16} className="text-emerald-500 animate-bounce" />
                                        </button>
                                    </div>
                                </div>

                                {/* Executive Summary */}
                                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Zap size={120} className="text-blue-500" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Zap size={10} /> Executive Intelligence Brief
                                    </h4>
                                    <p className="text-xl font-bold text-white leading-relaxed mb-8">
                                        {results.analysis.executive_summary}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Findings</h5>
                                            <ul className="space-y-3">
                                                {results.analysis.key_insights.map((insight, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-400">
                                                        <ChevronRight size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                                        {insight}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Psychographic Profile</h5>
                                            <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-4 py-1">
                                                "{results.analysis.psychographic_profile}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Infographic Visualization */}
                                {results.infographic_svg && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                <Eye size={10} /> Visual Intelligence Model
                                            </h4>
                                            <span className="text-[9px] font-bold text-slate-600 uppercase">Tier: Executive Masterpiece</span>
                                        </div>
                                        <div className="w-full aspect-video bg-black/20 rounded-3xl border border-white/5 p-8 flex items-center justify-center">
                                            <div
                                                className="w-full h-full max-w-full max-h-full"
                                                dangerouslySetInnerHTML={{ __html: results.infographic_svg }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
