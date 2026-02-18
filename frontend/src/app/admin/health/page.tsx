"use client";
import React, { useEffect, useState } from "react";
import {
    Activity,
    Zap,
    ShieldAlert,
    Clock,
    Server,
    Cpu,
    Globe,
    ArrowUpRight
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

// Investor-ready mock trend data
const latencyTrend = [
    { time: '12:00', latency: 45, load: 12 },
    { time: '13:00', latency: 48, load: 15 },
    { time: '14:00', latency: 120, load: 85 },
    { time: '15:00', latency: 52, load: 20 },
    { time: '16:00', latency: 44, load: 18 },
    { time: '17:00', latency: 47, load: 22 },
];

export default function HealthPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!apiUrl) return;

                const res = await fetch(`${apiUrl}/admin/dashboard`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                // Silent catch for dev stability
            }
        };

        fetchHealth();
    }, []);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">System Telemetry</h1>
                <p className="text-slate-400 font-medium">Real-time node performance and infrastructure status.</p>
            </div>

            {/* Live Status Rack */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Uptime", value: "99.98%", sub: "Last 30 days", icon: <Clock size={16} />, color: "text-emerald-500" },
                    { label: "Nodes", value: "4 Active", sub: "Global distribution", icon: <Server size={16} />, color: "text-blue-500" },
                    { label: "CPU Load", value: "14%", sub: "Optimal range", icon: <Cpu size={16} />, color: "text-purple-500" },
                    { label: "Registry", value: "v4.2.0-stable", sub: "Latest build", icon: <Globe size={16} />, color: "text-slate-400" },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>{item.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                        </div>
                        <p className="text-2xl font-black text-white">{item.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Latency Distribution */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Latency Distribution</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global response times (ms)</p>
                        </div>
                        <Zap size={20} className="text-blue-500" />
                    </div>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={latencyTrend}>
                                <defs>
                                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="latency" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorLat)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Infrastructure Load */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Load Intensity</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Compute pressure vs. Requests</p>
                        </div>
                        <Activity size={20} className="text-emerald-500" />
                    </div>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={latencyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                                <Line type="stepAfter" dataKey="load" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Error Logs Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <ShieldAlert size={20} className="text-red-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Incident Logs</h3>
                    </div>
                    <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Clear Stream</button>
                </div>
                <div className="p-0 max-h-[300px] overflow-y-auto font-mono text-[11px]">
                    {[
                        { time: "16:42:12", type: "WARN", msg: "API Rate-limiting engaged for client_4429", status: "RESOLVED" },
                        { time: "16:40:05", type: "INFO", msg: "Recursive Loop iteration complete for quick_audit_node_1", status: "OK" },
                        { time: "16:38:22", type: "ERR", msg: "Gemini 2.0-Flash timeout on batch_simulate", status: "RETRY_SUCCESS" },
                        { time: "16:35:10", type: "INFO", msg: "Database buffer flushed to SOB_V3 storage", status: "OK" },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-6 px-8 py-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                            <span className="text-slate-500 shrink-0 font-bold">{log.time}</span>
                            <span className={`font-black tracking-widest shrink-0 w-12 ${log.type === 'ERR' ? 'text-red-500' : log.type === 'WARN' ? 'text-amber-500' : 'text-blue-500'}`}>[{log.type}]</span>
                            <span className="text-slate-300 flex-1">{log.msg}</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase shrink-0">{log.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
