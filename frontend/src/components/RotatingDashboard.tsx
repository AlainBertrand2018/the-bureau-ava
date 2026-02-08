"use client";
import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutPanelLeft, PieChart as PieIcon, TrendingUp, Target, Activity } from 'lucide-react';

const VIEWS = [
    { id: 'sentiment', label: 'Sentiment Matrix', icon: <LayoutPanelLeft size={14} /> },
    { id: 'demographic', label: 'Demographic Reach', icon: <PieIcon size={14} /> },
    { id: 'elasticity', label: 'Market Elasticity', icon: <TrendingUp size={14} /> },
    { id: 'resonance', label: 'Topic Resonance', icon: <Target size={14} /> }
];

const MOCK_BAR = [
    { name: 'Agent 1', score: 8, color: '#10B981' },
    { name: 'Agent 2', score: 4, color: '#F43F5E' },
    { name: 'Agent 3', score: 6.5, color: '#F59E0B' },
    { name: 'Agent 4', score: 9, color: '#10B981' },
];

const MOCK_PIE = [
    { name: 'Approve', value: 45, fill: '#10B981' },
    { name: 'Neutral', value: 25, fill: '#F59E0B' },
    { name: 'Reject', value: 30, fill: '#F43F5E' },
];

const MOCK_AREA = [
    { price: 'Rs 100', value: 90 },
    { price: 'Rs 300', value: 75 },
    { price: 'Rs 500', value: 42 },
    { price: 'Rs 700', value: 15 },
];

const MOCK_RADAR = [
    { subject: 'Trust', A: 120, fullMark: 150 },
    { subject: 'Price', A: 98, fullMark: 150 },
    { subject: 'Quality', A: 86, fullMark: 150 },
    { subject: 'Local', A: 99, fullMark: 150 },
    { subject: 'Style', A: 85, fullMark: 150 },
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
        <div className="w-full h-full flex flex-col">
            {/* Rotating Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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
                                className="text-xs font-black tracking-widest text-slate-900 uppercase"
                            >
                                {activeView.label}
                            </motion.h4>
                        </AnimatePresence>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Bureau Simulation Engine</p>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {VIEWS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Chart Canvas */}
            <div className="flex-1 p-8 relative min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            {activeView.id === 'sentiment' ? (
                                <BarChart data={MOCK_BAR} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" hide />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                                        {MOCK_BAR.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            ) : activeView.id === 'demographic' ? (
                                <PieChart>
                                    <Pie
                                        data={MOCK_PIE}
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {MOCK_PIE.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            ) : activeView.id === 'elasticity' ? (
                                <AreaChart data={MOCK_AREA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0046FF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0046FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="price" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#0046FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            ) : (
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_RADAR}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} />
                                    <Radar name="Simulation" dataKey="A" stroke="#0046FF" fill="#0046FF" fillOpacity={0.6} />
                                </RadarChart>
                            )}
                        </ResponsiveContainer>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="px-8 pb-8 flex items-center justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
                <span className="flex items-center gap-2">
                    <Activity size={12} className="text-primary" />
                    Active Optimization
                </span>
                <span>n=100 Persona Cluster</span>
            </div>
        </div>
    );
}
