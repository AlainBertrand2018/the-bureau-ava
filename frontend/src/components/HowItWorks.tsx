"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Settings, Users, BrainCircuit } from 'lucide-react';

const STEPS = [
    {
        icon: <Users size={20} />,
        title: "1. Audit Intake",
        plain: "You drop your survey draft. We immediately scan for structural flaws.",
        tech: "IPF-driven parsing with semantic vector analysis for bias detection."
    },
    {
        icon: <BrainCircuit size={20} />,
        title: "2. Soul Generation",
        plain: "We create 100 deep-thinkers based on real census data.",
        tech: "Stochastic Persona Reconstruction (n=100) using 2022 Census anchors."
    },
    {
        icon: <Settings size={20} />,
        title: "3. Total War",
        plain: "Agents try to break your questions with honesty and skepticism.",
        tech: "Monte Carlo roleplay iterations with 1,000+ sentiment data points."
    }
];

export default function HowItWorks() {
    const [mode, setMode] = useState<'plain' | 'tech'>('plain');

    return (
        <section id="methodology" className="min-h-screen flex items-center bg-white relative overflow-hidden py-24">
            {/* Static CSS Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `radial-gradient(#0046FF 1.5px, transparent 1.5px)`,
                        backgroundSize: '48px 48px'
                    }}
                />

                {/* Sparse "Twinkle" Persona Layer */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(24)].map((_, i) => {
                        // Generate consistent positions using the index as seed
                        const left = ((i * 37) % 100);
                        const top = ((i * 73) % 100);
                        const delay = (i * 0.6) % 15;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 0.4, 0],
                                    scale: [0.8, 1.2, 0.8]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: delay,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                                style={{
                                    left: `${left}%`,
                                    top: `${top}%`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-6">The Optimization Protocol</h2>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
                        How we simulate the <span className="text-primary text-blue-600">Truth.</span>
                    </h3>

                    <div className="flex bg-slate-100/50 backdrop-blur-md p-1.5 rounded-full border border-slate-200/50 mb-12 w-fit mx-auto">
                        <button
                            onClick={() => setMode('plain')}
                            className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${mode === 'plain' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                        >
                            Plain English
                        </button>
                        <button
                            onClick={() => setMode('tech')}
                            className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${mode === 'tech' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                        >
                            Technical Specs
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STEPS.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 bg-white/40 backdrop-blur-[2px] rounded-[40px] border border-slate-100/50 hover:bg-white/60 hover:border-slate-200 transition-all flex flex-col"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-white rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm">{step.title}</h4>
                            </div>
                            <p className="text-slate-600 font-medium text-sm leading-relaxed flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={mode}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {mode === 'plain' ? step.plain : step.tech}
                                    </motion.span>
                                </AnimatePresence>
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <button className="py-5 px-10 rounded-full bg-slate-900 border border-transparent text-white font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl">
                        See Full Scientific Whitepaper <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
