"use client";
import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart as PieIcon, TrendingUp, Target, Activity } from 'lucide-react';

const VIEWS = [
    { id: 'bias', label: 'Bias Detection', icon: <BarChart3 size={14} /> },
    { id: 'distribution', label: 'Response Distribution', icon: <PieIcon size={14} /> },
    { id: 'dropoff', label: 'Drop-off Risk Curve', icon: <TrendingUp size={14} /> },
    { id: 'quality', label: 'Quality Dimensions', icon: <Target size={14} /> }
];

const MOCK_BAR = [
    { name: 'Q1', score: 82, color: '#10B981' },
    { name: 'Q2', score: 41, color: '#EF4444' },
    { name: 'Q3', score: 67, color: '#F59E0B' },
    { name: 'Q4', score: 91, color: '#10B981' },
    { name: 'Q5', score: 55, color: '#EF4444' },
];

const MOCK_PIE = [
    { name: 'Agree', value: 38, fill: '#2563EB' },
    { name: 'Neutral', value: 27, fill: '#0EA5E9' },
    { name: 'Disagree', value: 22, fill: '#F59E0B' },
    { name: 'Skip', value: 13, fill: '#EF4444' },
];

const MOCK_AREA = [
    { q: 'Q1', risk: 5 },
    { q: 'Q2', risk: 12 },
    { q: 'Q3', risk: 8 },
    { q: 'Q4', risk: 38 },
    { q: 'Q5', risk: 62 },
    { q: 'Q6', risk: 45 },
];

const MOCK_RADAR = [
    { subject: 'Clarity', A: 92, fullMark: 100 },
    { subject: 'Neutrality', A: 45, fullMark: 100 },
    { subject: 'Scope', A: 78, fullMark: 100 },
    { subject: 'Options', A: 88, fullMark: 100 },
    { subject: 'Flow', A: 65, fullMark: 100 },
];

export default function RotatingDashboard() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % VIEWS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const activeView = VIEWS[currentIndex];

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView.id}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                {activeView.icon}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.h4
                                key={activeView.id}
                                initial={{ y: 5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -5, opacity: 0 }}
                                className="text-[10px] font-bold tracking-widest text-slate-800 uppercase"
                            >
                                {activeView.label}
                            </motion.h4>
                        </AnimatePresence>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">AVA Audit Engine</p>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {VIEWS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 p-6 relative min-h-[260px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            {activeView.id === 'bias' ? (
                                <BarChart data={MOCK_BAR} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', fontSize: 12 }}
                                        formatter={(value) => [`${value ?? 0}/100`, 'Quality Score']}
                                    />
                                    <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={32}>
                                        {MOCK_BAR.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            ) : activeView.id === 'distribution' ? (
                                <PieChart>
                                    <Pie
                                        data={MOCK_PIE}
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {MOCK_PIE.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', fontSize: 12 }}
                                        formatter={(value) => [`${value ?? 0}%`, 'Responses']}
                                    />
                                </PieChart>
                            ) : activeView.id === 'dropoff' ? (
                                <AreaChart data={MOCK_AREA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="dropoffGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', fontSize: 12 }}
                                        formatter={(value) => [`${value ?? 0}%`, 'Drop-off Risk']}
                                    />
                                    <Area type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#dropoffGrad)" />
                                </AreaChart>
                            ) : (
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={MOCK_RADAR}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                    <Radar name="Score" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.12} strokeWidth={2} />
                                </RadarChart>
                            )}
                        </ResponsiveContainer>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 flex items-center justify-between text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                <span className="flex items-center gap-1.5">
                    <Activity size={10} className="text-emerald-500" />
                    <span className="text-emerald-600">Live</span> Analysis
                </span>
                <span>50 Diagnostic Personas</span>
            </div>
        </div>
    );
}
