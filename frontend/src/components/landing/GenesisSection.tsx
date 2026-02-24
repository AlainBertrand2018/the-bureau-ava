"use client";
import React from "react";
import { Sparkles, Cpu } from "lucide-react";
import SurveyArchitect from "@/components/architect/SurveyArchitect";
import { Reveal } from "./LandingUtils";

export default function GenesisSection() {
    return (
        <section id="genesis" className="section-full bg-[#1A1A1A] relative">
            <div className="absolute inset-0 hero-dot-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#CC5833]/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Reveal className="text-center mb-20">
                    <div className="badge-minimal text-white/40 border-white/10 mb-8 inline-flex items-center gap-2">
                        <Cpu size={12} className="text-[#CC5833]" />
                        <span>Architect Protocol</span>
                    </div>
                    <h2 className="text-section-title text-[#F2F0E9] mb-8 leading-[0.9]">
                        The Genesis Suite.
                    </h2>
                    <p className="text-body-lg text-[#F2F0E9]/40 max-w-2xl mx-auto font-sans">
                        Quantum-generation for initial research design. AVA orchestrates the foundational architecture of your project before a single prompt is even written.
                    </p>
                </Reveal>

                <Reveal delay={0.2} className="relative">
                    <div className="absolute -inset-4 bg-[#CC5833]/5 blur-3xl opacity-50 rounded-full" />
                    <div className="relative bg-[#2E4036]/5 border border-white/5 rounded-[2rem] p-4 md:p-8 backdrop-blur-sm">
                        <SurveyArchitect />
                    </div>
                </Reveal>

                <div className="mt-16 text-center">
                    <p className="font-mono text-[11px] text-[#F2F0E9]/20 uppercase tracking-[0.4em]">
                        // INITIALIZING_ARCHITECT_SUBSYSTEM // CALIBRATION_PHASE_01
                    </p>
                </div>
            </div>
        </section>
    );
}

