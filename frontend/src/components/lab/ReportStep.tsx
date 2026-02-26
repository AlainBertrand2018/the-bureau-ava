"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Loader2,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    AlertTriangle,
    ArrowRightLeft,
    CheckCircle2,
    Target,
    Users,
    Lightbulb,
    TrendingUp,
    Gavel,
    FileDown,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Clock,
    Zap,
    ThumbsUp,
    ThumbsDown,
    Award,
    MessageSquareText,
    ArrowRight
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { useClearance } from "@/context/ClearanceContext";
import { PaywallOverlay } from "../os/PaywallOverlay";
import type { Persona, SimulationResult } from "./LabShell";

interface ReportStepProps {
    context: string;
    results: SimulationResult[];
    questions: string[];
    personas: Persona[];
}

interface QuestionAnalysis {
    original_question: string;
    quality_score: number;
    risk_level: string;
    issues_identified: string[];
    diagnostic_evidence: string;
    rewritten_question: string;
    rewrite_rationale: string;
    predicted_improvement: string;
}

interface Recommendation {
    title: string;
    priority: string;
    category: string;
    description: string;
    expected_impact: string;
}

interface DemographicInsight {
    segment: string;
    finding: string;
    implication: string;
}

interface BureauReport {
    executive_summary: string;
    overall_risk_level: string;
    quality_score: number;
    question_analysis: QuestionAnalysis[];
    strategic_recommendations: Recommendation[];
    demographic_insights: DemographicInsight[];
    next_steps: string[];
    bureau_verdict: string;
}

function getRiskIcon(level: string) {
    const l = (level || "").toUpperCase();
    if (l === "LOW") return <ShieldCheck size={16} className="text-emerald-600" />;
    if (l === "MODERATE") return <ShieldAlert size={16} className="text-amber-600" />;
    if (l === "HIGH") return <ShieldX size={16} className="text-rose-600" />;
    if (l === "CRITICAL") return <ShieldX size={16} className="text-red-600" />;
    return <ShieldAlert size={16} className="text-slate-400" />;
}

function getRiskColor(level: string) {
    const l = (level || "").toUpperCase();
    if (l === "LOW") return "text-emerald-600";
    if (l === "MODERATE") return "text-amber-600";
    if (l === "HIGH") return "text-rose-600";
    if (l === "CRITICAL") return "text-red-600";
    return "text-slate-400";
}

function getRiskBg(level: string) {
    const l = (level || "").toUpperCase();
    if (l === "LOW") return "bg-emerald-50 border-emerald-100";
    if (l === "MODERATE") return "bg-amber-50 border-amber-100";
    if (l === "HIGH") return "bg-rose-50 border-rose-100";
    if (l === "CRITICAL") return "bg-red-50 border-red-100";
    return "bg-slate-50 border-slate-100";
}

function getPriorityColor(priority: string) {
    const p = (priority || "").toUpperCase();
    if (p === "IMMEDIATE") return "text-red-600 bg-red-50 border-red-100";
    if (p === "HIGH") return "text-rose-600 bg-rose-50 border-rose-100";
    if (p === "MEDIUM") return "text-amber-600 bg-amber-50 border-amber-100";
    if (p === "LOW") return "text-emerald-600 bg-emerald-50 border-emerald-100";
    return "text-slate-500 bg-slate-50 border-slate-100";
}

export default function ReportStep({ context, results, questions, personas }: ReportStepProps) {
    const { currentMission } = useMission();
    const { credits, spendCredits } = useClearance();
    const [report, setReport] = useState<BureauReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLocked, setIsLocked] = useState(true); // Locked by default for premium reports
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    // Trust layer state
    const [benchmarkGrade, setBenchmarkGrade] = useState<string | null>(null);
    const [benchmarkAccuracy, setBenchmarkAccuracy] = useState<number | null>(null);
    const [feedbackSent, setFeedbackSent] = useState<Record<string, string>>({});
    const [agreementRate, setAgreementRate] = useState<number | null>(null);

    const generateReport = async () => {
        setIsLoading(true);
        setError("");
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze_results`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context,
                    questions,
                    results,
                    mission_id: currentMission?.mission_id
                }),
            });
            if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
            const data = await resp.json();
            setReport(data);
        } catch (err: any) {
            setError(err.message || "Failed to generate report");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!report && !isLoading) {
            generateReport();
        }
        // Fetch benchmark accuracy
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/benchmark`)
            .then((r) => r.json())
            .then((data) => {
                setBenchmarkGrade(data.grade || null);
                setBenchmarkAccuracy(data.overall_detection_accuracy || null);
            })
            .catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitFeedback = async (
        questionIndex: number,
        questionText: string,
        findingType: string,
        aiAssessment: string,
        verdict: "AGREE" | "DISAGREE"
    ) => {
        const key = `${questionIndex}-${findingType}`;
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question_index: questionIndex,
                    question_text: questionText,
                    finding_type: findingType,
                    ai_assessment: aiAssessment,
                    client_verdict: verdict,
                }),
            });
            const data = await resp.json();
            setFeedbackSent((prev) => ({ ...prev, [key]: verdict }));
            setAgreementRate(data.client_agreement_rate || null);
        } catch (err) {
            console.error("Feedback error:", err);
        }
    };

    const handleExport = () => {
        if (!report || !reportRef.current) return;
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bureau Report — Survey Quality Audit</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, system-ui, sans-serif; color: #1e293b; padding: 40px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
          .header { border-bottom: 3px solid #10B981; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
          .header p { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-top: 4px; }
          .meta { display: flex; gap: 20px; margin-top: 12px; font-size: 11px; color: #94a3b8; }
          .section { margin-bottom: 32px; }
          .section-title { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #10B981; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .summary { font-size: 15px; line-height: 1.8; color: #334155; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; }
          .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
          .risk-low { background: #dcfce7; color: #166534; }
          .risk-moderate { background: #fef9c3; color: #854d0e; }
          .risk-high { background: #fee2e2; color: #991b1b; }
          .risk-critical { background: #fecdd3; color: #881337; }
          .question-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; page-break-inside: avoid; }
          .question-card h4 { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .rewrite { background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; margin-top: 8px; }
          .rewrite-label { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #10B981; margin-bottom: 4px; }
          .rewrite p { font-size: 13px; font-weight: 600; color: #064e3b; }
          .issues li { font-size: 12px; color: #ef4444; margin: 2px 0; padding-left: 4px; }
          .recommendation { border-left: 3px solid #10B981; padding: 12px 16px; margin-bottom: 12px; background: #f8fafc; }
          .recommendation h4 { font-size: 14px; font-weight: 800; color: #0f172a; }
          .recommendation p { font-size: 12px; color: #475569; margin-top: 4px; }
          .verdict { background: #0f172a; color: white; padding: 24px; border-radius: 8px; text-align: center; font-size: 16px; font-weight: 700; margin-top: 40px; }

          @media print { body { padding: 20px; } .question-card { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>THE BUREAU — Survey Quality Audit Report</h1>
          <p>Diagnostic Dry-Run Analysis & Mitigation Protocol</p>
          <div class="meta">
            <span>Date: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
            <span>Sample: n=${results.length}</span>
            <span>Questions: ${questions.length}</span>
            <span>Quality Score: ${report.quality_score}/100</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <div class="summary">${report.executive_summary}</div>
          <div style="margin-top: 12px;">
            Overall Risk: <span class="risk-badge risk-${report.overall_risk_level.toLowerCase()}">${report.overall_risk_level}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Question Analysis & Rewrites</div>
          ${(report.question_analysis || []).map((qa: QuestionAnalysis, i: number) => `
            <div class="question-card">
              <h4>Q${i + 1}: ${qa.original_question}</h4>
              <span class="risk-badge risk-${qa.risk_level.toLowerCase()}">${qa.risk_level} RISK</span>
              <ul class="issues" style="margin-top: 8px;">
                ${(qa.issues_identified || []).map((issue: string) => `<li>⚠ ${issue}</li>`).join("")}
              </ul>
              <div class="rewrite">
                <div class="rewrite-label">Recommended Rewrite (${qa.predicted_improvement} improvement)</div>
                <p>${qa.rewritten_question}</p>
                <p style="font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 500;">${qa.rewrite_rationale}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="section">
          <div class="section-title">Strategic Recommendations</div>
          ${(report.strategic_recommendations || []).map((rec: Recommendation) => `
            <div class="recommendation">
              <h4>${rec.title} <span class="risk-badge risk-${rec.priority === "IMMEDIATE" ? "critical" : rec.priority.toLowerCase()}">${rec.priority}</span></h4>
              <p>${rec.description}</p>
              <p style="font-size: 11px; color: #10B981; margin-top: 4px; font-weight: 700;">Impact: ${rec.expected_impact}</p>
            </div>
          `).join("")}
        </div>

        <div class="section">
          <div class="section-title">Demographic Insights</div>
          ${(report.demographic_insights || []).map((ins: DemographicInsight) => `
            <div class="recommendation">
              <h4>${ins.segment}</h4>
              <p>${ins.finding}</p>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${ins.implication}</p>
            </div>
          `).join("")}
        </div>

        <div class="section">
          <div class="section-title">Next Steps</div>
          <ol style="padding-left: 20px;">
            ${(report.next_steps || []).map((step: string) => `<li style="font-size: 13px; margin-bottom: 6px; color: #334155;">${step}</li>`).join("")}
          </ol>
        </div>

        <div class="verdict">"${report.bureau_verdict}"</div>


      </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto py-10">
                <div className="text-center py-32">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center"
                    >
                        <Sparkles size={24} className="text-emerald-600" />
                    </motion.div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                        Generating Bureau Report
                    </h3>
                    <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                        Our quality auditors are analysing {results.length} diagnostic responses
                        across {questions.length} questions to produce a structural quality audit...
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Loader2 size={12} className="animate-spin text-emerald-600" />
                        Detecting bias, ambiguity, leading language, missing options, drop-off risks...
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-5xl mx-auto py-10">
                <div className="text-center py-20 bg-red-50 border border-red-100 rounded-3xl">
                    <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-slate-900 mb-2">Report Generation Failed</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">{error}</p>
                    <button
                        onClick={generateReport}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="max-w-6xl mx-auto py-10 relative" ref={reportRef}>
            <AnimatePresence>
                {isLocked && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <PaywallOverlay
                            isLocked={isLocked}
                            onUnlock={() => setIsLocked(false)}
                            cost={50}
                            title="Structural Audit Encrypted"
                            description="Full AI Audit reports require Bureau processing credits. Allocate 50 credits to decrypt this structural intelligence Dossier."
                        />
                    </div>
                )}
            </AnimatePresence>

            <div className={isLocked ? "blur-xl pointer-events-none select-none transition-all duration-1000" : "transition-all duration-1000"}>
                {/* Report Header */}
                <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <FileText size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-900">Bureau Report</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Quality Audit & Mitigation Protocol
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <FileDown size={14} />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Executive Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-10 mb-8 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Gavel size={14} className="text-emerald-600" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Executive Summary</h3>
                    </div>
                    <p className="text-slate-900 font-medium leading-relaxed text-base md:text-lg mb-6">
                        {report.executive_summary}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getRiskBg(report.overall_risk_level)}`}>
                            {getRiskIcon(report.overall_risk_level)}
                            <span className={`text-xs font-black uppercase tracking-widest ${getRiskColor(report.overall_risk_level)}`}>
                                {report.overall_risk_level} Risk
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-emerald-50 border-emerald-100">
                            <Target size={14} className="text-emerald-600" />
                            <span className="text-xs font-black text-emerald-600">{report.quality_score}/100 Quality Score</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white border-slate-100">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-400">
                                n={results.length} respondents • {questions.length} questions
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Trust & Accuracy Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {benchmarkGrade && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                    <Award size={18} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600">
                                        Benchmark Detection Accuracy
                                    </h4>
                                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                                        Tested against known-flaw question battery
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-emerald-600">{benchmarkAccuracy}%</span>
                                <span className="text-lg font-black text-emerald-700/60 mb-1">Grade {benchmarkGrade}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium mt-2">
                                Our engine was tested against 6 intentionally flawed survey questions with documented
                                structural defects. This score measures how many known flaws the AI correctly detected.
                            </p>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-teal-50 border border-teal-100 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center">
                                <MessageSquareText size={18} className="text-teal-600" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-teal-600">
                                    Client Validation Rate
                                </h4>
                                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                                    Your feedback improves our accuracy
                                </p>
                            </div>
                        </div>
                        {agreementRate !== null ? (
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-teal-600">{agreementRate}%</span>
                                <span className="text-sm font-bold text-slate-500 mb-1">client agreement</span>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 font-medium">
                                Use the 👍 👎 buttons on each finding below to validate our diagnostics.
                                Your feedback directly calibrates our engine.
                            </p>
                        )}
                        <p className="text-[10px] text-slate-500 font-medium mt-2">
                            {Object.keys(feedbackSent).length} finding(s) reviewed this session
                        </p>
                    </motion.div>
                </div>

                {/* Question Analysis & Rewrites */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <ArrowRightLeft size={16} className="text-primary" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            Question Audit & Recommended Rewrites
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {(report.question_analysis || []).map((qa: QuestionAnalysis, i: number) => {
                            const isExpanded = expandedQuestion === i;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
                                >
                                    {/* Question Header */}
                                    <button
                                        onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                                    >
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                                Q{i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-slate-900 font-bold text-sm leading-relaxed">{qa.original_question}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${getRiskBg(qa.risk_level)} ${getRiskColor(qa.risk_level)}`}>
                                                        {qa.risk_level} Risk
                                                    </span>
                                                    {(qa.issues_identified || []).slice(0, 2).map((issue: string, j: number) => (
                                                        <span key={j} className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">
                                                            {issue.slice(0, 30)}{issue.length > 30 ? "..." : ""}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-4">
                                            <span className="text-emerald-600 text-xs font-black">+{qa.predicted_improvement}</span>
                                            {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                                        </div>
                                    </button>

                                    {/* Expanded Detail */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-100"
                                            >
                                                <div className="p-6 space-y-5">
                                                    {/* Issues with Feedback Buttons */}
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-2">
                                                            <AlertTriangle size={12} />
                                                            Issues Identified — Rate Each Finding
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {(qa.issues_identified || []).map((issue: string, j: number) => {
                                                                const feedbackKey = `${i}-${j}`;
                                                                const alreadySent = feedbackSent[feedbackKey];
                                                                return (
                                                                    <div
                                                                        key={j}
                                                                        className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-rose-50 border border-rose-100 rounded-xl p-3"
                                                                    >
                                                                        <span className="text-rose-600 shrink-0 mt-0.5">•</span>
                                                                        <span className="flex-1">{issue}</span>
                                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                                            {alreadySent ? (
                                                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${alreadySent === "AGREE" ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                                                                                    {alreadySent === "AGREE" ? "✓ Confirmed" : "✗ Flagged"}
                                                                                </span>
                                                                            ) : (
                                                                                <>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            submitFeedback(i, qa.original_question, `ISSUE_${j}`, issue, "AGREE");
                                                                                            setFeedbackSent((prev) => ({ ...prev, [feedbackKey]: "AGREE" }));
                                                                                        }}
                                                                                        className="p-1 rounded hover:bg-emerald-100 transition-colors"
                                                                                        title="This finding is accurate"
                                                                                    >
                                                                                        <ThumbsUp size={10} className="text-slate-400 hover:text-emerald-600" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            submitFeedback(i, qa.original_question, `ISSUE_${j}`, issue, "DISAGREE");
                                                                                            setFeedbackSent((prev) => ({ ...prev, [feedbackKey]: "DISAGREE" }));
                                                                                        }}
                                                                                        className="p-1 rounded hover:bg-rose-100 transition-colors"
                                                                                        title="Flag as inaccurate"
                                                                                    >
                                                                                        <ThumbsDown size={10} className="text-slate-400 hover:text-rose-600" />
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Rewrite */}
                                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                                                <CheckCircle2 size={12} />
                                                                Recommended Rewrite
                                                            </h4>
                                                            <span className="text-emerald-600 text-xs font-black bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                                                                +{qa.predicted_improvement} predicted improvement
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-900 font-bold text-base leading-relaxed mb-3">
                                                            &quot;{qa.rewritten_question}&quot;
                                                        </p>
                                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                            {qa.rewrite_rationale}
                                                        </p>
                                                    </div>

                                                    {/* Before / After */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                                                            <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 block mb-2">Before</span>
                                                            <p className="text-sm text-slate-400 font-medium line-through decoration-rose-200">
                                                                {qa.original_question}
                                                            </p>
                                                        </div>
                                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 block mb-2">After</span>
                                                            <p className="text-sm text-slate-900 font-medium">{qa.rewritten_question}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Strategic Recommendations */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Lightbulb size={16} className="text-amber-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Strategic Recommendations</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(report.strategic_recommendations || []).map((rec: Recommendation, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-emerald-200 transition-all group shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <h4 className="text-slate-900 font-black text-sm tracking-tight">{rec.title}</h4>
                                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${getPriorityColor(rec.priority)}`}>
                                        {rec.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{rec.description}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                    <TrendingUp size={12} />
                                    <span>{rec.expected_impact}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Demographic Insights */}
                {(report.demographic_insights || []).length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Users size={16} className="text-violet-600" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Demographic Insights</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(report.demographic_insights || []).map((insight: DemographicInsight, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                            <Users size={14} className="text-violet-600" />
                                        </div>
                                        <h4 className="text-slate-900 font-black text-sm">{insight.segment}</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-2">
                                        {typeof insight.finding === 'string' ? insight.finding : JSON.stringify(insight.finding)}
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        → {typeof insight.implication === 'string' ? insight.implication : JSON.stringify(insight.implication)}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next Steps */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock size={16} className="text-emerald-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recommended Next Steps</h3>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        {(report.next_steps || []).map((step: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-start gap-4 p-5 ${i < (report.next_steps || []).length - 1 ? "border-b border-slate-100" : ""}`}
                            >
                                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center justify-center shrink-0">
                                    {i + 1}
                                </span>
                                <p className="text-slate-900 font-medium text-sm leading-relaxed pt-0.5">
                                    {typeof step === 'string' ? step : (step as any)?.step || JSON.stringify(step)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bureau Verdict */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center shadow-sm"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Gavel size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Bureau Verdict</span>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
                        &quot;{report.bureau_verdict}&quot;
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <FileDown size={14} />
                            Export Full Report
                        </button>
                        <button
                            onClick={generateReport}
                            className="flex items-center gap-2 px-6 py-3 text-slate-400 border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all"
                        >
                            <Zap size={14} />
                            Regenerate
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
