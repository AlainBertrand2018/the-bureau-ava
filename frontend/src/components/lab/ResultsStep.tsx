"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
} from "recharts";
import {
    BarChart3,
    PieChart as PieIcon,
    Target,
    TrendingDown,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Minus,
    User,
    LayoutPanelLeft,
    FileDown,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import type { Persona, SimulationResult } from "./LabShell";

interface ResultsStepProps {
    results: SimulationResult[];
    questions: string[];
    personas: Persona[];
}

type ChartView = "sentiment" | "distribution" | "radar";

function analyzeSentiment(text: string): number {
    const t = text.toLowerCase();
    const positiveWords = [
        "love", "great", "excellent", "amazing", "good", "yes", "approve",
        "support", "interested", "excited", "willing", "fantastic", "wonderful",
        "absolutely", "definitely", "agree", "happy", "positive", "beneficial",
    ];
    const negativeWords = [
        "no", "bad", "expensive", "reject", "hate", "oppose", "waste",
        "terrible", "horrible", "never", "refuse", "disagree", "concern",
        "worried", "skeptic", "doubt", "pointless", "unnecessary", "ridiculous",
        "too much", "can't afford", "won't",
    ];

    let score = 5;
    for (const w of positiveWords) {
        if (t.includes(w)) score += 0.8;
    }
    for (const w of negativeWords) {
        if (t.includes(w)) score -= 0.9;
    }
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function getSentimentLabel(score: number) {
    if (score >= 7) return { label: "Positive", icon: <ThumbsUp size={12} />, color: "text-emerald-600" };
    if (score <= 4) return { label: "Negative", icon: <ThumbsDown size={12} />, color: "text-rose-600" };
    return { label: "Neutral", icon: <Minus size={12} />, color: "text-amber-600" };
}

function getBarColor(score: number) {
    if (score >= 7) return "#10B981";
    if (score <= 4) return "#F43F5E";
    return "#F59E0B";
}

export default function ResultsStep({
    results,
    questions,
    personas,
}: ResultsStepProps) {
    const [chartView, setChartView] = useState<ChartView>("sentiment");
    const [expandedAgent, setExpandedAgent] = useState<number | null>(null);

    // Analyse all responses
    const analysis = useMemo(() => {
        const agentScores = results.map((row) => {
            const answers = questions.map((q) => ({
                question: q,
                answer: row[q] || "",
                score: analyzeSentiment(row[q] || ""),
            }));
            const avgScore =
                answers.reduce((s, a) => s + a.score, 0) / Math.max(answers.length, 1);
            return {
                name: row.Agent,
                demographic: row.Demographic,
                answers,
                avgScore: Math.round(avgScore * 10) / 10,
            };
        });

        // Question-level stats
        const questionStats = questions.map((q) => {
            const scores = results.map((r) => analyzeSentiment(r[q] || ""));
            const avg = scores.reduce((s, v) => s + v, 0) / Math.max(scores.length, 1);
            return {
                question: q.slice(0, 40) + (q.length > 40 ? "..." : ""),
                fullQuestion: q,
                avgScore: Math.round(avg * 10) / 10,
                positive: scores.filter((s) => s >= 7).length,
                neutral: scores.filter((s) => s > 4 && s < 7).length,
                negative: scores.filter((s) => s <= 4).length,
            };
        });

        // Distribution
        const positive = agentScores.filter((a) => a.avgScore >= 7).length;
        const neutral = agentScores.filter(
            (a) => a.avgScore > 4 && a.avgScore < 7
        ).length;
        const negative = agentScores.filter((a) => a.avgScore <= 4).length;

        // Overall
        const overallAvg =
            agentScores.reduce((s, a) => s + a.avgScore, 0) /
            Math.max(agentScores.length, 1);

        // Top objections (lowest scoring questions)
        const objections = [...questionStats]
            .sort((a, b) => a.avgScore - b.avgScore)
            .slice(0, 3);

        return {
            agentScores,
            questionStats,
            distribution: { positive, neutral, negative },
            overallAvg: Math.round(overallAvg * 10) / 10,
            objections,
        };
    }, [results, questions]);

    const barChartData = analysis.agentScores.map((a) => ({
        name: a.name,
        score: a.avgScore,
        color: getBarColor(a.avgScore),
    }));

    const pieData = [
        { name: "Positive", value: analysis.distribution.positive, fill: "#10B981" },
        { name: "Neutral", value: analysis.distribution.neutral, fill: "#F59E0B" },
        { name: "Negative", value: analysis.distribution.negative, fill: "#F43F5E" },
    ];

    const radarData = analysis.questionStats.map((qs) => ({
        subject: qs.question.slice(0, 15) + "...",
        A: qs.avgScore,
        fullMark: 10,
    }));

    const riskLevel =
        analysis.overallAvg >= 7
            ? { label: "LOW RISK", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" }
            : analysis.overallAvg >= 5
                ? { label: "MODERATE RISK", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" }
                : { label: "HIGH RISK", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" };

    return (
        <div className="max-w-7xl mx-auto py-10">
            {/* Section Header */}
            <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <BarChart3 size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900">
                                Intelligence Report
                            </h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Synthetic Dry-Run Complete • n={results.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`px-5 py-3 rounded-xl border font-black text-sm ${riskLevel.bg}`}>
                    <span className={riskLevel.color}>Survey Failure: {riskLevel.label}</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Overall Score", value: analysis.overallAvg + "/10", color: "text-blue-600" },
                    { label: "Positive", value: analysis.distribution.positive, color: "text-emerald-600" },
                    { label: "Neutral", value: analysis.distribution.neutral, color: "text-amber-600" },
                    { label: "Negative", value: analysis.distribution.negative, color: "text-rose-600" },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm"
                    >
                        <p className={`text-3xl font-black tracking-tighter ${kpi.color} mb-1`}>
                            {kpi.value}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {kpi.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chart Toggle + Chart */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden mb-10 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Simulation Visualisation
                    </h3>
                    <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100">
                        {[
                            { id: "sentiment" as const, label: "Agent Matrix", icon: <LayoutPanelLeft size={12} /> },
                            { id: "distribution" as const, label: "Distribution", icon: <PieIcon size={12} /> },
                            { id: "radar" as const, label: "Question Radar", icon: <Target size={12} /> },
                        ].map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setChartView(v.id)}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${chartView === v.id
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {v.icon}
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 h-[400px]">
                    {chartView === "sentiment" && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} domain={[0, 10]}
                                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} />
                                <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }}
                                    contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", color: "#1e293b", fontWeight: "bold", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1500}>
                                    {barChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {chartView === "distribution" && (
                        <div className="w-full h-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={90} outerRadius={130}
                                        paddingAngle={6} dataKey="value" animationDuration={1500}>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", color: "#1e293b", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                    {Math.round(
                                        (analysis.distribution.positive / Math.max(results.length, 1)) * 100
                                    )}%
                                </span>
                                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    Favorable
                                </span>
                            </div>
                        </div>
                    )}

                    {chartView === "radar" && (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="subject"
                                    tick={{ fontSize: 9, fontWeight: "bold", fill: "#64748b" }} />
                                <Radar name="Score" dataKey="A" stroke="#0046FF"
                                    fill="#0046FF" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Objections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingDown size={18} className="text-rose-600" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Primary Risk Factors
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {analysis.objections.map((obj, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle size={14} className="text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-bold text-sm mb-1">
                                            {obj.fullQuestion}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium">
                                            Avg Score:{" "}
                                            <span className="text-rose-600 font-black">
                                                {obj.avgScore}/10
                                            </span>{" "}
                                            • {obj.negative} rejections, {obj.neutral} neutral,{" "}
                                            {obj.positive} approvals
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`rounded-2xl border p-8 flex flex-col justify-between shadow-sm ${riskLevel.bg}`}>
                    <div>
                        <span className={`text-[10px] font-black tracking-widest uppercase ${riskLevel.color}`}>
                            Bureau Assessment
                        </span>
                        <p className="text-slate-900 font-bold text-lg mt-2 leading-tight">
                            Your survey has a{" "}
                            <span className={`tracking-tighter ${riskLevel.color}`}>
                                "{riskLevel.label}"
                            </span>{" "}
                            classification based on {results.length} synthetic responses.
                        </p>
                    </div>
                    <button className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white w-full py-4 rounded-full font-black text-[10px] tracking-widest uppercase transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                        <FileDown size={14} />
                        Export Report PDF
                    </button>
                </div>
            </div>

            {/* Agent Drilldown */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                    Agent Response Drilldown
                </h3>
                <div className="space-y-2">
                    {analysis.agentScores.map((agent, i) => {
                        const sentiment = getSentimentLabel(agent.avgScore);
                        const isExpanded = expandedAgent === i;

                        return (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setExpandedAgent(isExpanded ? null : i)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <User size={14} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="text-slate-900 font-bold text-sm">{agent.name}</span>
                                            <span className="text-slate-400 text-xs font-bold ml-3">
                                                {agent.demographic}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-1.5 text-xs font-black ${sentiment.color}`}>
                                            {sentiment.icon}
                                            <span>{agent.avgScore}/10</span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp size={14} className="text-slate-500" />
                                        ) : (
                                            <ChevronDown size={14} className="text-slate-500" />
                                        )}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="border-t border-slate-100 p-5 space-y-3"
                                    >
                                        {agent.answers.map((a, j) => {
                                            const aSent = getSentimentLabel(a.score);
                                            return (
                                                <div key={j} className="bg-slate-50 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            Q{j + 1}
                                                        </span>
                                                        <span className={`text-[10px] font-black flex items-center gap-1 ${aSent.color}`}>
                                                            {aSent.icon} {a.score}/10
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-medium mb-2">
                                                        "{a.question}"
                                                    </p>
                                                    <p className="text-sm text-slate-900 font-medium leading-relaxed">
                                                        {a.answer}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
