"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface Report {
    score: number;
    issues: string;
    quality: string;
    question: string;
    text: string;
    flags: { label: string; color: string; bg: string; border: string }[];
    rewrite: string;
    rewrite_desc: string;
}

const reports: Report[] = [
    {
        score: 42,
        issues: "3 Issues Found",
        quality: "Poor Quality",
        question: "Question 4 of 12",
        text: "Don't you agree that our service is excellent and worth recommending?",
        flags: [
            { label: "Leading", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
            { label: "Double-Barreled", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
            { label: "Acquiescence Bias", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" }
        ],
        rewrite: "How would you rate the quality of our service?",
        rewrite_desc: "Neutral framing · Single construct · Eliminates acquiescence bias"
    },
    {
        score: 68,
        issues: "2 Issues Found",
        quality: "Needs Work",
        question: "Question 7 of 12",
        text: "How often do you visit our website and are you happy with the design?",
        flags: [
            { label: "Double-Barreled", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
            { label: "Ambiguity", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" }
        ],
        rewrite: "On a scale of 1-10, how happy are you with the website design?",
        rewrite_desc: "Separates constructs · Quantitative scale · Reduced cognitive load"
    },
    {
        score: 98,
        issues: "0 Issues Found",
        quality: "Golden Standard",
        question: "Question 11 of 12",
        text: "Thinking about your last visit, how likely are you to return to our store?",
        flags: [
            { label: "Scientific", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Clear Context", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Temporal Anchor", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" }
        ],
        rewrite: "Thinking about your last visit, how likely are you to return to our store?",
        rewrite_desc: "Scientifically accurate · Clear context · Temporal anchoring"
    }
];

export default function AnimatedReportCard() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % reports.length);
        }, 5000); // Switch every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const report = reports[index];

    return (
        <div className="card-elevated p-0 h-full overflow-hidden min-h-[420px] flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col h-full"
                >
                    {/* Report Header */}
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center">
                                <Sparkles size={12} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">Sample Audit Report</h4>
                                <p className="text-[11px] font-semibold text-slate-400">Customer Satisfaction Survey</p>
                            </div>
                        </div>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`px-3 py-1 rounded-full border ${report.score < 50 ? "bg-red-50 border-red-100 text-red-500" :
                                    report.score < 80 ? "bg-amber-50 border-amber-100 text-amber-600" :
                                        "bg-emerald-50 border-emerald-100 text-emerald-600"
                                }`}
                        >
                            <span className="text-[11px] font-bold uppercase tracking-wider">{report.issues}</span>
                        </motion.div>
                    </div>

                    {/* Flagged Question */}
                    <div className="p-5 border-b border-slate-50 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <motion.div
                                initial={{ rotate: -10 }}
                                animate={{ rotate: 0 }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.score < 50 ? "bg-red-50 text-red-500" :
                                        report.score < 80 ? "bg-amber-50 text-amber-600" :
                                            "bg-emerald-50 text-emerald-600"
                                    }`}
                            >
                                <span className="text-lg font-black">{report.score}</span>
                            </motion.div>
                            <div className="flex-1">
                                <p className={`text-[11px] font-bold uppercase tracking-wider ${report.score < 50 ? "text-red-500" :
                                        report.score < 80 ? "text-amber-600" :
                                            "text-emerald-600"
                                    }`}>{report.quality}</p>
                                <p className="text-xs text-slate-500 font-medium">{report.question}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-3 border border-slate-100/50">
                            <p className="text-sm text-slate-700 font-semibold leading-relaxed">&quot;{report.text}&quot;</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {report.flags.map((flag, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${flag.bg} ${flag.color} ${flag.border}`}
                                >
                                    {flag.label}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Rewrite */}
                    <div className={`p-5 mt-auto transition-colors duration-500 ${report.score >= 90 ? "bg-emerald-50/30" : "bg-white"}`}>
                        <div className="flex items-center gap-1.5 mb-2">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                                {report.score >= 90 ? "AVA's Certification" : "AVA'S REWRITE"}
                            </span>
                        </div>
                        <div className={`${report.score >= 90 ? "bg-emerald-100/50 border-emerald-200" : "bg-emerald-50 border-emerald-100"} border rounded-xl p-4 transition-all duration-500`}>
                            <p className="text-sm text-slate-800 font-semibold leading-relaxed">&quot;{report.rewrite}&quot;</p>
                            <p className="text-[10px] text-emerald-600 font-medium mt-2">{report.rewrite_desc}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-center gap-1.5">
                {reports.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === i ? "bg-blue-600 w-4" : "bg-slate-200"
                            }`}
                        aria-label={`Switch to report ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
