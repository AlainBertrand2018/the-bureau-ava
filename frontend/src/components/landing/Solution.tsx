"use client";
import React from "react";
import { ShieldCheck, AlertTriangle, Target, Users, BarChart3, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface SolutionProps {
    t: any;
    onAuditClick: () => void;
}

export default function Solution({ t, onAuditClick }: SolutionProps) {
    return (
        <section id="solution" className="section-full section-tinted relative">
            <div className="max-w-6xl mx-auto px-6 w-full">
                <Reveal className="text-center mb-16">
                    <div className="badge-blue inline-flex items-center gap-2 mb-6">
                        <ShieldCheck size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            {t.solution.badge}
                        </span>
                    </div>
                    <h2 className="text-section-title text-slate-900 mb-6">
                        {t.solution.title_1}
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {t.solution.title_2}
                        </span>
                    </h2>
                    <p className="text-body-lg text-slate-500 font-medium max-w-3xl mx-auto">
                        {t.solution.description}
                    </p>
                </Reveal>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
                    {[
                        { icon: <AlertTriangle size={18} />, label: t.solution.cap_1, color: "text-red-500", bg: "bg-red-50" },
                        { icon: <Target size={18} />, label: t.solution.cap_2, color: "text-amber-600", bg: "bg-amber-50" },
                        { icon: <Users size={18} />, label: t.solution.cap_3, color: "text-violet-600", bg: "bg-violet-50" },
                        { icon: <BarChart3 size={18} />, label: t.solution.cap_4, color: "text-sky-600", bg: "bg-sky-50" },
                        { icon: <CheckCircle2 size={18} />, label: t.solution.cap_5, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((cap, i) => (
                        <Reveal key={i} delay={i * 0.08}>
                            <div className="card p-6 text-center group cursor-default h-full">
                                <div className={`w-10 h-10 rounded-xl ${cap.bg} ${cap.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                    {cap.icon}
                                </div>
                                <span className="text-slate-800 text-xs font-bold">{cap.label}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.4} className="flex justify-center">
                    <button
                        onClick={onAuditClick}
                        className="group flex items-center gap-3 px-7 py-3.5 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20"
                    >
                        <Zap size={14} className="text-blue-400 group-hover:text-white transition-colors" />
                        {t.solution.cta}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Reveal>
            </div>
        </section>
    );
}
