"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '@/context/OSContext';

const Onboarding: React.FC = () => {
    const { wallpaper } = useOS();
    const isLight = wallpaper === 'clinical-white';
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('ava-os-onboarding-v4');
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const complete = () => {
        setIsVisible(false);
        localStorage.setItem('ava-os-onboarding-v4', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={complete}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full md:w-2/5 p-8 md:p-12 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl flex flex-col items-center text-center gap-8 ${isLight
                        ? 'bg-white/60 border-slate-200/50 text-slate-900'
                        : 'bg-black/40 border-white/5 text-white'
                        }`}
                >
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-center gap-3 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.5em] opacity-40">
                                System Initialization
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-semibold leading-tight uppercase tracking-[0.15em] opacity-90">
                            Welcome to the Bureau
                        </h2>

                        <p className={`text-base md:text-lg font-normal leading-relaxed opacity-70 ${isLight ? 'text-slate-600' : 'text-slate-200'}`}>
                            This is our <span className="text-emerald-400/80 font-semibold">SURVEY OS</span>—your interface to global market intelligence.
                            Feel free to explore the interactive widgets, manage field apps via the dock, or simply ask AVA if you need help.
                        </p>
                    </div>

                    <button
                        onClick={complete}
                        className={`w-full py-4 rounded-2xl font-semibold uppercase tracking-[0.3em] transition-all duration-500 backdrop-blur-md border ${isLight
                            ? 'bg-slate-900/90 text-white border-slate-800 hover:bg-emerald-600/90 shadow-lg'
                            : 'bg-white/5 text-white/90 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-xl'
                            }`}
                    >
                        Initialize Interface
                    </button>

                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                        Neural Link Active • Version 2.4.1
                    </span>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Onboarding;
