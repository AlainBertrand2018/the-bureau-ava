"use client";
import React, { useEffect, useState } from "react";
import {
    BarChart3,
    PieChart as PieIcon,
    Zap,
    ShieldCheck,
    AlertTriangle,
    Target,
    Layers,
    ArrowUpRight,
    Cpu,
    Coins,
    BarChart as BarChartIcon
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell
} from 'recharts';

const issueDistribution = [
    { name: 'Double-Barreled', count: 145, color: '#3B82F6' },
    { name: 'Leading Bias', count: 112, color: '#F59E0B' },
    { name: 'Ambiguity', count: 89, color: '#10B981' },
    { name: 'Missing Options', count: 76, color: '#EF4444' },
    { name: 'Social Bias', count: 54, color: '#8B5CF6' },
    { name: 'Cultural Sink', count: 32, color: '#EC4899' },
];

const qualityRadar = [
    { subject: 'Clarity', A: 85, fullMark: 150 },
    { subject: 'Neutrality', A: 98, fullMark: 150 },
    { subject: 'Atomicity', A: 92, fullMark: 150 },
    { subject: 'Consistency', A: 99, fullMark: 150 },
    { subject: 'Engagement', A: 85, fullMark: 150 },
];

export default function StatsPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Scientific Intelligence</h1>
                    <p className="text-slate-400 font-medium">Aggregated audit data and survey methodology benchmarks.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Audit Stream</span>
                </div>
            </div>

            {/* Metric Rack */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Questions Audited", value: stats?.audit_metrics.total_audits_performed || "0", sub: "Global Volume", icon: <Layers size={16} />, color: "text-blue-500" },
                    { label: "Mean Accuracy", value: `${stats?.audit_metrics.average_quality_score || "0"}/100`, sub: "Quality Baseline", icon: <ShieldCheck size={16} />, color: "text-emerald-500" },
                    { label: "Token Efficiency", value: stats?.unit_economics.avg_tokens_per_question || "0", sub: "Tokens per Q", icon: <Cpu size={16} />, color: "text-purple-500" },
                    { label: "Cost per Audit", value: `$${stats?.unit_economics.avg_cost_per_question || "0.00"}`, sub: "Avg Unit Cost", icon: <Coins size={16} />, color: "text-amber-500" },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl group hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>{item.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                        </div>
                        <p className="text-2xl font-black text-white">{item.value}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Unit Economics Comparison (Investor Deep Dive) */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
                <div className="p-8 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Audit Scale & Unit Economics</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Comparative Analysis: Question Volume vs. Respondent Density (n)</p>
                        </div>
                        <BarChartIcon size={24} className="text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Tier</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Questions</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">n (Sample)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Avg. Token Cost</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Revenue</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right text-emerald-500">ROI Delta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {stats?.unit_economics.comparative_metrics.map((m: any, i: number) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-white tracking-tight">{m.scale}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-xs font-bold text-slate-400">{m.avg_q}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-xs font-bold text-slate-400">{m.avg_n || "-"}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-xs font-mono font-bold text-slate-300">${m.avg_cost.toFixed(4)}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-white tracking-widest">
                                        ${m.revenue.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="inline-flex items-center gap-1 text-emerald-500 font-black text-xs">
                                            {((m.revenue / m.avg_cost) / 10).toFixed(1)}k%
                                            <ArrowUpRight size={12} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-blue-600/5 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                        * Token Costs calculated based on Gemini 2.0 Flash pricing ($0.10/1M in, $0.40/1M out).
                        Revenue derived from SOB Tiered Pricing Model (Standard Lead Gen vs Enterprise Simulation).
                    </p>
                </div>
            </div>

            {/* Visual Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Vulnerability Index</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Most frequent survey design errors</p>
                        </div>
                        <AlertTriangle size={20} className="text-amber-500" />
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={issueDistribution} margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} width={100} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.1 }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                    {issueDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">System Benchmark</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global quality distribution across dimensions</p>
                        </div>
                        <BarChart3 size={20} className="text-blue-500" />
                    </div>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityRadar}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar
                                    name="AVA Performance"
                                    dataKey="A"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
