"use client";
import React from 'react';
import { useClearance } from '@/context/ClearanceContext';
import { Coins, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreditGauge: React.FC<{ showLabel?: boolean }> = ({ showLabel = true }) => {
    const { credits, isAuthenticated } = useClearance();

    // If no credits are available or user shouldn't see them (Guest), return null
    if (!isAuthenticated) return null;

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden relative group">
            {/* Animated Glow Grid */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.3)_0,transparent_70%)]" />

            <div className="relative z-10 w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Coins size={16} className="group-hover:scale-110 transition-transform" />
            </div>

            <div className="relative z-10 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={credits}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -5, opacity: 0 }}
                        className="text-white font-black font-mono text-sm leading-none"
                    >
                        {credits.toLocaleString()}
                    </motion.span>
                </AnimatePresence>
                {showLabel && (
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 leading-none mt-1.5 flex items-center gap-1">
                        Sovereign Credits <ShieldCheck size={8} className="text-emerald-500/50" />
                    </span>
                )}
            </div>

            {/* Subtle Progress Bar (Capacity Visualization) */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500/20 w-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((credits / 5000) * 100, 100)}%` }}
                    className="h-full bg-emerald-500"
                />
            </div>
        </div>
    );
};

export default CreditGauge;
