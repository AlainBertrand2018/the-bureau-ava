"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import SurveyArchitect from "@/components/architect/SurveyArchitect";
import { Reveal } from "./LandingUtils";

interface GenesisSectionProps {
    t: any;
}

export default function GenesisSection({ t }: GenesisSectionProps) {
    return (
        <section id="genesis" className="section-full bg-slate-950 py-24 relative overflow-hidden">
            <div className="absolute inset-0 hero-dot-grid opacity-10 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Sparkles size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            {t.architect.badge}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 uppercase">
                        {t.architect.title}
                    </h2>
                    <p className="text-body-lg text-slate-400 font-medium max-w-2xl mx-auto text-balance">
                        {t.architect.sub}
                    </p>
                </Reveal>

                <Reveal delay={0.2}>
                    <SurveyArchitect />
                </Reveal>
            </div>
        </section>
    );
}
