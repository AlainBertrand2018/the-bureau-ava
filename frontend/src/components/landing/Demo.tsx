"use client";
import React from "react";
import { Sparkles, Terminal, Activity } from "lucide-react";
import dynamic from "next/dynamic";
import { Reveal } from "./LandingUtils";

const RotatingDashboard = dynamic(() => import("@/components/RotatingDashboard"), { ssr: false });
const AnimatedReportCard = dynamic(() => import("@/components/AnimatedReportCard"), { ssr: false });

interface DemoProps {
    onProtocolOpen: () => void;
}

export default function Demo({ onProtocolOpen }: DemoProps) {
    return (
        <section id="demo" className="section-full bg-[#1A1A1A] relative py-24 md:py-40 border-y border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#F2F0E9 1px, transparent 1px), linear-gradient(90deg, #F2F0E9 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <Reveal className="mb-20">
                    <div className="badge-minimal text-white/40 border-white/10 mb-8 inline-flex items-center gap-2">
                        <Terminal size={12} className="text-[#CC5833]" />
                        <span>The Output Interface</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-baseline">
                        <h2 className="text-section-title text-[#F2F0E9] uppercase leading-[0.9]">
                            Forensic <br /><span className="text-[#CC5833]">Intelligence.</span>
                        </h2>
                        <p className="text-body-lg text-[#F2F0E9]/40 max-w-xl font-sans">
                            Bureau reports provide deterministic insights, isolating exactly where your instrument breaks and calibrating the precise fix before data collection.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    <Reveal className="h-full">
                        <div className="card-artifact bg-white/[0.03] border-white/10 p-2 h-full min-h-[500px] overflow-hidden group hover:border-[#CC5833]/30 transition-all duration-700">
                            <div className="absolute top-4 left-6 flex items-center gap-2 z-20">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#CC5833] animate-pulse" />
                                <span className="font-mono text-[9px] text-[#F2F0E9]/40 uppercase tracking-widest">LIVE_DIAGNOSTIC_FEED</span>
                            </div>
                            <AnimatedReportCard />
                        </div>
                    </Reveal>

                    <Reveal delay={0.2} className="h-full">
                        <div className="card-artifact bg-white/[0.03] border-white/10 p-2 h-full min-h-[500px] overflow-hidden group hover:border-[#CC5833]/30 transition-all duration-700">
                            <div className="absolute top-4 right-6 flex items-center gap-2 z-20">
                                <span className="font-mono text-[9px] text-[#F2F0E9]/40 uppercase tracking-widest">NEURAL_CALIBRATION_GRID</span>
                                <Activity size={10} className="text-[#CC5833]" />
                            </div>
                            <RotatingDashboard />
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.4} className="flex justify-center">
                    <button
                        onClick={onProtocolOpen}
                        className="btn-magnetic bg-[#F2F0E9] text-[#2E4036] shadow-2xl shadow-black/20"
                    >
                        <Sparkles size={16} className="text-[#CC5833]" />
                        <span>Initiate Simulation Lab</span>
                    </button>
                </Reveal>
            </div>
        </section>
    );
}

