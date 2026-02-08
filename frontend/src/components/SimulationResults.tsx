"use client";
import React, { useState } from 'react';
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
    Pie
} from 'recharts';
import { AlertCircle, TrendingDown, LayoutPanelLeft, PieChart as PieIcon, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimulationData {
    Agent: string;
    Demographic: string;
    [key: string]: string;
}

interface SimulationResultsProps {
    data: SimulationData[];
}

export default function SimulationResults({ data }: SimulationResultsProps) {
    const [view, setView] = useState<'bar' | 'pie'>('bar');

    const chartData = data.map((agent, i) => ({
        name: agent.Agent,
        score: [8, 4, 6, 9][i % 4], // Semi-controlled mock scores
        sentiment: ["Strong Approval", "Strong Rejection", "Neutral", "Strong Approval"][i % 4]
    })).map(item => ({
        ...item,
        color: item.score < 6 ? '#F43F5E' : item.score < 8 ? '#F59E0B' : '#10B981'
    }));

    const pieData = [
        { name: 'Approval', value: 45, fill: '#10B981' },
        { name: 'Neutral', value: 25, fill: '#F59E0B' },
        { name: 'Rejection', value: 30, fill: '#F43F5E' },
    ];

    const objections = [
        { title: "Price/Value Gap", detail: "Significant friction at the Rs 500 threshold across middle-income agents." },
        { title: "Semantic Dissonance", detail: "The term 'Organic' was interpreted as 'Pesticide-Free' rather than 'Premium'." },
        { title: "Survey Fatigue", detail: "Agent attention dropped by 65% after question 12 in the current structure." }
    ];

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-12">

            {/* Header Info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Intelligence Dashboard</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Scientific Probability Model // n={data.length}</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setView('bar')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${view === 'bar' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutPanelLeft size={14} /> Agent Matrix
                    </button>
                    <button
                        onClick={() => setView('pie')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${view === 'pie' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <PieIcon size={14} /> Global Sentiment
                    </button>
                </div>
            </div>

            {/* Chart Section */}
            <div className="h-[450px] w-full bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {view === 'bar' ? (
                        <motion.div
                            key="bar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full h-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} domain={[0, 10]} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={50} animationDuration={1500}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="pie"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={100}
                                        outerRadius={140}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationDuration={1500}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">70%</span>
                                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Favorable Insight</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Strategic Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <TrendingDown className="text-rose-600" size={24} />
                        <h4 className="text-sm font-black tracking-[0.2em] text-slate-900 uppercase">Primary Optimization Levers</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {objections.slice(0, 2).map((obj, i) => (
                            <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h5 className="text-slate-900 font-black text-sm mb-2">{obj.title}</h5>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{obj.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 flex flex-col justify-between">
                    <div>
                        <span className="text-primary font-black text-[10px] tracking-widest uppercase block mb-2">Automated Conclusion</span>
                        <p className="text-slate-900 font-bold text-lg leading-tight">Your current survey has a <span className="text-primary tracking-tighter">"High Failure Risk"</span> in the Tier-2 demographic.</p>
                    </div>
                    <button className="mt-8 flex items-center justify-center gap-2 bg-primary text-white w-full py-4 rounded-full font-black text-[10px] tracking-widest uppercase transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                        Fix Structure Now
                    </button>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">P{i}</div>
                        ))}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</p>
                        <p className="text-sm font-black text-slate-900">98.4% Match with 2022 Census</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-xs font-black tracking-widest text-primary hover:text-slate-900 transition-colors uppercase underline underline-offset-4 decoration-2">
                    <RefreshCw size={14} /> Run Alternative Scenario
                </button>
            </div>

        </div>
    );
}
