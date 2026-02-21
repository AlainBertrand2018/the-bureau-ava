"use client";
import React from "react";
import { Zap, ArrowRight } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface FinalCTASectionProps {
    onEntryOpen: () => void;
}

export default function FinalCTASection({ onEntryOpen }: FinalCTASectionProps) {
    return (
        <section id="contact" className="section-full relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-white pointer-events-none" />
            <div className="max-w-4xl mx-auto px-6 w-full text-center relative z-10">
                <Reveal>
                    <div className="badge-blue inline-flex items-center gap-2 mb-8">
                        <Zap size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            The Verdict
                        </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-40 pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                                Don't guess.{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    Audit first.
                                </span>
                            </h2>
                            <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto mb-10">
                                Leave the stress-test to me. Run your first survey quality audit now — completely free.
                            </p>
                            <button
                                onClick={onEntryOpen}
                                className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                <Zap size={18} />
                                Start Free Audit
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
