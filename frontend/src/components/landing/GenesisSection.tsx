"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import SurveyArchitect from "@/components/architect/SurveyArchitect";
import { Reveal } from "./LandingUtils";

export default function GenesisSection() {
    return (
        <section id="genesis" className="section-full bg-slate-950 py-24 relative overflow-hidden">
            <div className="absolute inset-0 hero-dot-grid opacity-10 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Sparkles size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            Architect Protocol
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 uppercase">
                        This is Our Genesis Suite
                    </h2>
                    <p className="text-body-lg text-slate-400 font-medium max-w-2xl mx-auto text-balance">
                        No clue where to start? This is where my agents and me will make your project happen.
                    </p>
                </Reveal>

                <Reveal delay={0.2}>
                    <SurveyArchitect />
                </Reveal>
            </div>
        </section>
    );
}
