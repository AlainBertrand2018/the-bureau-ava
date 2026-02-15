"use client";
import React, { useEffect, useState } from "react";
import {
    Coins,
    TrendingUp,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieIcon,
    DollarSign,
    Zap
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const revenueGrowth = [
    { name: 'Jan', rev: 12000, cost: 800 },
    { name: 'Feb', rev: 18000, cost: 1200 },
    { name: 'Mar', rev: 24000, cost: 1800 },
    { name: 'Apr', rev: 45000, cost: 3200 },
    { name: 'May', rev: 72000, cost: 4800 },
];

const tokenUsageByService = [
    { name: 'Quick Audit', value: 40, color: '#3B82F6' },
    { name: 'Batch Simulation', value: 35, color: '#10B981' },
    { name: 'Persona Gen', value: 15, color: '#F59E0B' },
    { name: 'Report Analytics', value: 10, color: '#8B5CF6' },
];

export default function CommercialPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`);
                const data = await res.json();
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s Real-time polling
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Commercial Portfolio</h1>
                    <p className="text-slate-400 font-medium">Revenue streams, profit margins, and token burn efficiency.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Live Commercial Stream</span>
                    </div>
                </div>
            </div>

            {/* Real-time Profit Center Rack */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        label: "Total Pipeline",
                        value: `$${stats?.financial_health.total_revenue.toLocaleString()}`,
                        change: `${stats?.financial_health.hero_audits_count + stats?.financial_health.simulations_count} Events`,
                        up: true,
                        icon: <DollarSign size={16} />,
                        color: "text-emerald-500"
                    },
                    {
                        label: "Simulation Rev",
                        value: `$${stats?.financial_health.enterprise_revenue.toLocaleString()}`,
                        change: `${stats?.financial_health.simulations_count} Jobs`,
                        up: true,
                        icon: <TrendingUp size={16} />,
                        color: "text-blue-500"
                    },
                    {
                        label: "Hero Audit Rev",
                        value: `$${stats?.financial_health.hero_audit_revenue.toLocaleString()}`,
                        change: `${stats?.financial_health.hero_audits_count} Leads`,
                        up: true,
                        icon: <Zap size={16} />,
                        color: "text-amber-500"
                    },
                    {
                        label: "Operational ROI",
                        value: `${stats?.financial_health.roi_ratio}x`,
                        change: "Net Margin",
                        up: true,
                        icon: <Coins size={16} />,
                        color: "text-purple-500"
                    },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>{item.icon}</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.change}</div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
                        <p className="text-2xl font-black text-white tracking-tighter">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Growth Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Revenue Scalability</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Growth projection based on current demand</p>
                        </div>
                        <CreditCard size={20} className="text-emerald-500" />
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.1 }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                                <Bar dataKey="rev" fill="#10B981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="cost" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Token Cost Distribution */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Token Burn Mix</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">COGS (Cost of Goods Sold)</p>
                        </div>
                        <PieIcon size={20} className="text-amber-500" />
                    </div>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tokenUsageByService}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {tokenUsageByService.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {tokenUsageByService.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-white">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* High-Tier Transactions */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Tier 1 Client Invoicing (Simulated)</h3>
                </div>
                <div className="p-0 font-mono text-[11px]">
                    {[
                        { client: "Global Insight Partners", amount: "$1,250.00", status: "PAID", service: "Batch Optimization (25 Questions)" },
                        { client: "Mauritius Telecom", amount: "$450.00", status: "PENDING", service: "Strategic Audit (9 Questions)" },
                        { client: "Aria Fintech", amount: "$850.00", status: "PAID", service: "Persona Stress-Test (Cluster B)" },
                        { client: "Verve Media", amount: "$2,400.00", status: "PAID", service: "Enterprise Audit (Subscription)" },
                    ].map((tx, i) => (
                        <div key={i} className="flex items-center gap-6 px-8 py-5 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                            <span className="text-white font-black flex-1 tracking-tight">{tx.client}</span>
                            <span className="text-slate-400 hidden md:block">{tx.service}</span>
                            <span className="text-blue-500 font-black">{tx.amount}</span>
                            <span className={`px-2 py-1 rounded text-[9px] font-black tracking-widest ${tx.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
