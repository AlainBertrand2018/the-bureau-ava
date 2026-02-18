"use client";
import React, { useEffect, useState } from "react";
import {
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Coins,
    Users,
    Zap,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Search
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

interface DashboardData {
    system_health: {
        total_requests: number;
        avg_latency_ms: number;
        error_rate: number;
        status: string;
    };
    financial_health: {
        total_revenue: number;
        total_token_cost: number;
        net_profit: number;
        roi_ratio: number;
        currency: string;
    };
    audit_metrics: {
        total_audits_performed: number;
        average_quality_score: number;
    };
}

// Dummy data for charts
const revenueData = [
    { name: 'Mon', revenue: 400, cost: 24 },
    { name: 'Tue', revenue: 300, cost: 13 },
    { name: 'Wed', revenue: 900, cost: 98 },
    { name: 'Thu', revenue: 1200, cost: 120 },
    { name: 'Fri', revenue: 1500, cost: 150 },
    { name: 'Sat', revenue: 1800, cost: 180 },
    { name: 'Sun', revenue: 2100, cost: 210 },
];

const issueData = [
    { name: 'Leading', count: 45 },
    { name: 'Double-B', count: 32 },
    { name: 'Ambiguity', count: 56 },
    { name: 'Missing', count: 21 },
    { name: 'Cultural', count: 12 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!apiUrl) return;

                const resp = await fetch(`${apiUrl}/admin/dashboard`);
                if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
                const json = await resp.json();
                setData(json);
            } catch (err) {
                // Silent fallback for development stability
                if (!data) {
                    setData({
                        system_health: { total_requests: 0, avg_latency_ms: 0, error_rate: 0, status: "INITIALIZING" },
                        financial_health: { total_revenue: 0, total_token_cost: 0, net_profit: 0, roi_ratio: 0, currency: "USD" },
                        audit_metrics: { total_audits_performed: 0, average_quality_score: 0 }
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Live-ish update
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) return (
        <div className="flex items-center justify-center p-20">
            <Zap className="animate-pulse text-blue-500 mr-2" />
            <span className="font-bold uppercase tracking-widest text-slate-500">Decrypting Ops Data...</span>
        </div>
    );

    return (
        <div className="space-y-10 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">OPERATIONS OVERVIEW</h1>
                    <p className="text-slate-400 font-medium">Real-time system, commercial, and audit telemetry.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input
                            type="text"
                            placeholder="Search Logs..."
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none w-64"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Live — Standard Ops</span>
                    </div>
                </div>
            </div>

            {/* Top Cards: The Three Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. System Health */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Health</p>
                            <h3 className="text-lg font-black text-white">{data?.system_health.status}</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Latency</p>
                            <p className="text-xl font-black text-white">{data?.system_health.avg_latency_ms}ms</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Error Rate</p>
                            <p className="text-xl font-black text-red-500">{data?.system_health.error_rate}%</p>
                        </div>
                    </div>
                </div>

                {/* 2. Commercial Health */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Coins size={80} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Coins size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Financial Health</p>
                            <h3 className="text-lg font-black text-white">${data?.financial_health.total_revenue} MRR</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Net ROI</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-black text-emerald-500">{data?.financial_health.roi_ratio}x</p>
                                <ArrowUpRight size={14} className="text-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Token Burn</p>
                            <p className="text-xl font-black text-white">${data?.financial_health.total_token_cost}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Audit Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle2 size={80} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Audit Statistics</p>
                            <h3 className="text-lg font-black text-white">{data?.audit_metrics.total_audits_performed} Total</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Quality</p>
                            <p className="text-xl font-black text-white">{data?.audit_metrics.average_quality_score}/100</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Reliability</p>
                            <p className="text-xl font-black text-white">99.8%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Cost Area Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-sm font-black text-white tracking-tight">Revenue vs AI Cost (7d)</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Gross Profit Analysis</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-white">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-slate-700" />
                                <span>Costs</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    itemStyle={{ fontSize: 12 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="cost" stroke="#475569" strokeWidth={2} fillOpacity={0.1} fill="#475569" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Common Issues Bar Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-sm font-black text-white tracking-tight">Top Flaws Detected</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Frequency across all audits</p>
                        </div>
                        <BarChart3 className="text-slate-700" size={20} />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={issueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {issueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black text-white tracking-tight uppercase">Recent Log Transactions</h4>
                        <button className="text-[10px] font-black text-blue-500 uppercase hover:underline">View All Logs</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: '#8922', type: 'Simulation', client: 'Retail Ltd', status: 'Success', cost: '$0.042', time: '2m ago' },
                            { id: '#8921', type: 'Expert Audit', client: 'State Dept', status: 'Success', cost: '$0.008', time: '14m ago' },
                            { id: '#8920', type: 'Persona Gen', client: 'Anon User', status: 'Success', cost: '$0.012', time: '22m ago' },
                            { id: '#8919', type: 'Simulation', client: 'Retail Ltd', status: 'Error', cost: '-', time: '1h ago' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-white leading-none mb-1">{log.type} {log.id}</p>
                                        <p className="text-[10px] font-medium text-slate-500 uppercase">Client: {log.client}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-white leading-none mb-1">{log.cost}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team / Superadmin Quick Actions */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                    <h4 className="text-sm font-black text-white tracking-tight uppercase mb-8">Admin Directives</h4>
                    <div className="space-y-3">
                        <button className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left transition-colors flex items-center justify-between group">
                            <span className="text-xs font-bold text-white">Manual Recalibration</span>
                            <Zap size={14} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <button className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left transition-colors flex items-center justify-between group">
                            <span className="text-xs font-bold text-white">Purge Health Logs</span>
                            <AlertCircle size={14} className="text-slate-500 group-hover:text-red-500 transition-colors" />
                        </button>
                        <button className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left transition-colors flex items-center justify-between group">
                            <span className="text-xs font-bold text-white">Export Financials</span>
                            <TrendingUp size={14} className="text-blue-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
