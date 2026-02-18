"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Target, FileText } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface HeroProps {
    t: any;
    onAuditClick: () => void;
    onGenesisClick: () => void;
}

export default function Hero({ t, onAuditClick, onGenesisClick }: HeroProps) {
    return (
        <section id="hero" className="relative min-h-screen flex items-center hero-dot-grid hero-spotlight pt-24 overflow-hidden">
            {/* AVA — background presence */}
            <div className="absolute bottom-0 right-0 hidden md:block pointer-events-none select-none" style={{ zIndex: 1 }}>
                <div className="relative">
                    {/* Soft fade on left edge only */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 12%)',
                        }}
                    />
                    {/* Gentle fade at very top */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 10%)',
                        }}
                    />
                    <Image
                        src="/images/AVA.webp"
                        alt="Meet AVA — your AI survey auditor"
                        width={500}
                        height={700}
                        className="opacity-85 object-contain object-bottom transition-all duration-1000"
                        style={{ maxHeight: '85vh' }}
                        priority
                    />
                </div>
            </div>
            <div className="relative z-10 max-w-[90rem] mx-auto px-6 w-full">
                <div className="max-w-6xl mx-auto text-center mb-14">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="badge-blue inline-flex items-center gap-2 mb-8"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-soft" />
                        {t.hero.badge}
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-hero mb-6"
                    >
                        <span className="text-slate-900">{t.hero.title.split(' ').slice(0, -1).join(' ')}</span>
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {t.hero.title.split(' ').slice(-1)}
                        </span>
                    </motion.h1>

                    {/* Sub */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm md:text-base text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        {t.hero.description}
                    </motion.p>

                    {/* Meta Trust Signal */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-[10px] text-slate-400 font-medium mt-8 uppercase tracking-widest"
                    >
                        {t.quick_audit.footer}
                    </motion.p>

                    {/* Hero CTAs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
                    >
                        <button
                            onClick={onAuditClick}
                            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                        >
                            <Target size={16} />
                            {t.hero.cta_audit}
                        </button>
                        <button
                            onClick={onGenesisClick}
                            className="flex items-center gap-2 px-8 py-4 text-slate-500 border-2 border-slate-200 rounded-full text-sm font-bold uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all"
                        >
                            <FileText size={16} />
                            {t.hero.cta_demo}
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
