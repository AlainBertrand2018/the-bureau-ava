"use client";
import React, { useEffect, useState } from "react";
import {
    Cpu,
    Zap,
    BarChart3,
    Activity,
    ArrowUpRight,
    Layers,
    Binary,
    Container
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const tokenBurnData = [
    { day: 'Mon', in: 120000, out: 240000 },
    { day: 'Tue', in: 150000, out: 310000 },
    { day: 'Wed', in: 450000, out: 980000 },
    { day: 'Thu', in: 320000, out: 650000 },
    { day: 'Fri', in: 280000, out: 590000 },
    { day: 'Sat', in: 180000, out: 410000 },
    { day: 'Sun', in: 140000, out: 320000 },
];

export default function TokenUsagePage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = () => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`)
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(err => console.error(err));
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Computing Intelligence</h1>
                <p className="text-slate-400 font-medium">Token burn rate, context window utilization, and LLM orchestration stats.</p>
            </div>

            {/* Token Rack */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Cumulative Tokens", value: stats?.unit_economics.total_tokens || "1.2M", sub: "Mixed Orchestration", icon: <Binary size={16} />, color: "text-blue-500" },
                    { label: "Avg Question Load", value: stats?.unit_economics.avg_tokens_per_question || "0", sub: "Tokens per Q", icon: <Layers size={16} />, color: "text-purple-500" },
                    { label: "Buffer Saturation", value: "24.2%", sub: "Context Cache", icon: <Container size={16} />, color: "text-emerald-500" },
                    { label: "Infrastructure Cost", value: `$${stats?.financial_health.total_token_cost || "0.00"}`, sub: "Gemini 2.0 Burn", icon: <Zap size={16} />, color: "text-amber-500" },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>{item.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                        </div>
                        <p className="text-2xl font-black text-white">{item.value}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Token Velocity Chart */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Token Velocity (Daily)</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Input vs Output token distribution</p>
                    </div>
                    <Cpu size={20} className="text-blue-500" />
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={tokenBurnData}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                            />
                            <Area type="monotone" dataKey="in" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                            <Area type="monotone" dataKey="out" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Model Efficiency Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Binary size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">Context Retention</h4>
                            <p className="text-xs text-slate-500">Avg tokens saved via Prompt Caching.</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-emerald-500">420k</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">Loop Efficiency</h4>
                            <p className="text-xs text-slate-500">Token reduction between iterations.</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-blue-500">-12.5%</span>
                </div>
            </div>
        </div>
    );
}
