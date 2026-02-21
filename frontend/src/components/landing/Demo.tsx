"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { Reveal } from "./LandingUtils";

const RotatingDashboard = dynamic(() => import("@/components/RotatingDashboard"), { ssr: false });
const AnimatedReportCard = dynamic(() => import("@/components/AnimatedReportCard"), { ssr: false });

interface DemoProps {
    onProtocolOpen: () => void;
}

export default function Demo({ onProtocolOpen }: DemoProps) {
    return (
        <section id="demo" className="section-full section-warm relative">
            <div className="max-w-6xl mx-auto px-6 w-full">
                <Reveal className="text-center mb-12">
                    <div className="badge-green inline-flex items-center gap-2 mb-6">
                        <Sparkles size={12} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            The Output
                        </span>
                    </div>
                    <h2 className="text-section-title text-slate-900 mb-6">
                        See what you'll get.
                    </h2>
                    <p className="text-body-lg text-slate-500 font-medium">
                        Bureau reports provide actionable intelligence, identifying exactly where your instrument will fail and how to fix it.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <Reveal>
                        <div className="h-full">
                            <AnimatedReportCard />
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className="h-full min-h-[420px]">
                            <RotatingDashboard />
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.4} className="text-center">
                    <button
                        onClick={onProtocolOpen}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                    >
                        <Sparkles size={16} />
                        Start Simulation Lab
                    </button>
                </Reveal>
            </div>
        </section>
    );
}
