"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Loader2,
    X,
    AlertTriangle,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AuditIssue {
    type: string;
    detail: string;
}

interface QuickAuditResult {
    question: string;
    quality_score: number;
    issues: AuditIssue[];
    verdict: string;
    rewrite: string;
}

export default function QuickAudit() {
    const { t, language } = useLanguage();
    const [auditQuestion, setAuditQuestion] = useState("");
    const [auditResult, setAuditResult] = useState<QuickAuditResult | null>(null);
    const [auditLoading, setAuditLoading] = useState(false);
    const [auditError, setAuditError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    /* Typing placeholder animation */
    const placeholders = language === 'en' ? [
        "How satisfied are you with our amazing service?",
        "Don't you agree the product is excellent?",
        "Rate your experience from 1-10",
        "Do you like or dislike the new feature?",
    ] : [
        "Êtes-vous satisfait de notre service incroyable ?",
        "Ne trouvez-vous pas que le produit est excellent ?",
        "Notez votre expérience de 1 à 10",
        "Aimez-vous ou détestez-vous la nouvelle fonctionnalité ?",
    ];

    const [phIdx, setPhIdx] = useState(0);
    const [typed, setTyped] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const cur = placeholders[phIdx];
        if (isTyping) {
            if (typed.length < cur.length) {
                const t = setTimeout(() => setTyped(cur.slice(0, typed.length + 1)), 40);
                return () => clearTimeout(t);
            } else {
                const t = setTimeout(() => setIsTyping(false), 2200);
                return () => clearTimeout(t);
            }
        } else {
            if (typed.length > 0) {
                const t = setTimeout(() => setTyped(typed.slice(0, -1)), 20);
                return () => clearTimeout(t);
            } else {
                setPhIdx((i) => (i + 1) % placeholders.length);
                setIsTyping(true);
            }
        }
    }, [typed, isTyping, phIdx, placeholders]);

    const runQuickAudit = async () => {
        if (!auditQuestion.trim()) { inputRef.current?.focus(); return; }
        setAuditLoading(true);
        setAuditError("");
        setAuditResult(null);
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quick_audit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: auditQuestion }),
            });
            if (!resp.ok) throw new Error("Audit failed");
            setAuditResult(await resp.json());
        } catch (err: any) {
            setAuditError(err.message || "Something went wrong");
        } finally {
            setAuditLoading(false);
        }
    };

    const scoreColor = (s: number) =>
        s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-600" : "text-red-600";
    const scoreBg = (s: number) =>
        s >= 80 ? "bg-emerald-50" : s >= 60 ? "bg-amber-50" : "bg-red-50";
    const scoreLabel = (s: number) =>
        s >= 80 ? t.quick_audit.score_good : s >= 60 ? t.quick_audit.score_neutral : t.quick_audit.score_poor;

    function issueBadge(type: string) {
        const t = type.toUpperCase();
        if (t.includes("LEADING")) return "bg-red-50 text-red-600 border-red-100";
        if (t.includes("DOUBLE")) return "bg-amber-50 text-amber-700 border-amber-100";
        if (t.includes("AMBIG")) return "bg-orange-50 text-orange-600 border-orange-100";
        if (t.includes("LOADED")) return "bg-rose-50 text-rose-600 border-rose-100";
        if (t.includes("MISSING")) return "bg-violet-50 text-violet-600 border-violet-100";
        if (t.includes("CULTURAL")) return "bg-cyan-50 text-cyan-700 border-cyan-100";
        if (t.includes("DROP")) return "bg-yellow-50 text-yellow-700 border-yellow-100";
        return "bg-blue-50 text-blue-600 border-blue-100";
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">
                    {t.quick_audit.header}
                </p>
                <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-200/60 focus-within:border-blue-400 focus-within:shadow-blue-100/60 transition-all">
                    <input
                        ref={inputRef}
                        value={auditQuestion}
                        onChange={(e) => setAuditQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && runQuickAudit()}
                        placeholder={typed}
                        className="flex-1 bg-transparent text-slate-900 text-sm font-medium px-4 py-3 outline-none placeholder-slate-300"
                    />
                    <button
                        onClick={runQuickAudit}
                        disabled={auditLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shrink-0 shadow-sm"
                    >
                        {auditLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Send size={14} />
                        )}
                        {auditLoading ? t.quick_audit.btn_loading : t.quick_audit.btn}
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-3 text-center">
                    {t.quick_audit.footer}
                </p>
            </div>

            <AnimatePresence>
                {auditResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        className="mt-4"
                    >
                        <div className="card-elevated p-8 relative">
                            <button
                                onClick={() => setAuditResult(null)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex items-center gap-6 mb-6">
                                <div className={`text-center px-5 py-3 rounded-2xl ${scoreBg(auditResult.quality_score)}`}>
                                    <div className={`text-4xl font-black ${scoreColor(auditResult.quality_score)}`}>
                                        {auditResult.quality_score}
                                    </div>
                                    <div className={`text-[9px] font-bold uppercase tracking-widest ${scoreColor(auditResult.quality_score)}`}>
                                        {scoreLabel(auditResult.quality_score)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-900 font-bold text-sm mb-1">{auditResult.verdict}</p>
                                    <p className="text-slate-400 text-xs font-medium">
                                        {t.quick_audit.dimensions}
                                    </p>
                                </div>
                            </div>

                            {auditResult.issues.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                                        <AlertTriangle size={10} />
                                        {t.quick_audit.results_title}
                                    </h4>
                                    <div className="space-y-2">
                                        {auditResult.issues.map((issue, k) => (
                                            <div key={k} className="flex items-start gap-3">
                                                <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${issueBadge(issue.type)}`}>
                                                    {issue.type.replace(/_/g, " ")}
                                                </span>
                                                <span className="text-sm text-slate-600 font-medium">{issue.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                                <h4 className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={10} />
                                    {t.quick_audit.rewrite_title}
                                </h4>
                                <p className="text-slate-800 font-bold text-sm leading-relaxed">
                                    "{auditResult.rewrite}"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {auditError && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-red-500 text-xs font-bold mt-4"
                >
                    {auditError}
                </motion.p>
            )}
        </div>
    );
}
