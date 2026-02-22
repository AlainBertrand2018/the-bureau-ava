"use client";
import React from "react";
import { Building2, TrendingUp, BarChart3, AlertTriangle } from "lucide-react";
import { Reveal } from "./LandingUtils";

// No props needed.


export default function PainPoints() {
    return (
        <section id="painpoints" className="section-full relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-red-50/20 via-white to-white pointer-events-none" />
            <div className="max-w-5xl mx-auto px-6 w-full relative z-10">
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertTriangle size={12} className="text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                            The Crisis of Veracity
                        </span>
                    </div>
                    <h2 className="text-section-title text-slate-900 mb-6">
                        The high cost of
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            structural research bias.
                        </span>
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-slate-900 font-extrabold text-xl mb-1">Enterprises lose millions annually to contaminated datasets and flawed instrumentation.</p>
                        <p className="text-slate-500 font-medium text-sm">
                            Fragmented logic, leading language, and cognitive load issues corrupt respondent integrity, resulting in decision-making based on statistical noise rather than market truth.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            icon: <Building2 size={20} />,
                            color: "text-red-500",
                            bg: "bg-red-50",
                            title: "Institutional Risk",
                            desc: "Deploying government policy or 8-figure FMCG investments based on biased feedback loops is a systemic failure, not a strategy.",
                        },
                        {
                            icon: <TrendingUp size={20} />,
                            color: "text-amber-600",
                            bg: "bg-amber-50",
                            title: "Data Veracity Erosion",
                            desc: "Once stakeholders identify structural flaws in your research designs, the institutional authority of your intelligence unit evaporates.",
                        },
                        {
                            icon: <BarChart3 size={20} />,
                            color: "text-violet-600",
                            bg: "bg-violet-50",
                            title: "Intelligence Deficit",
                            desc: "You aren't just losing capital; you are failing to identify the non-obvious market shifts currently being captured by adversarial competitors.",
                        },
                    ].map((item, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                            <div className="card-elevated p-8 h-full">
                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-4`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-slate-900 font-black text-base tracking-tight mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>


            </div>
        </section>
    );
}
