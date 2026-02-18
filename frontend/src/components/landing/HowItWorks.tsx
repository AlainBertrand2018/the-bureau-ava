"use client";
import React from "react";
import { FileText, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface HowItWorksProps {
    t: any;
}

export default function HowItWorks({ t }: HowItWorksProps) {
    return (
        <section id="how-it-works" className="section-full section-tinted relative">
            <div className="max-w-5xl mx-auto px-6 w-full">
                <Reveal className="text-center mb-16">
                    <div className="badge-blue inline-flex items-center gap-2 mb-6">
                        <Clock size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            The Process
                        </span>
                    </div>
                    <h2 className="text-section-title text-slate-900 mb-6">
                        {t.how_it_works.title}
                    </h2>
                    <p className="text-body-lg text-slate-500 font-medium">{t.how_it_works.sub}</p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: "01",
                            title: t.how_it_works.step1_title,
                            desc: t.how_it_works.step1_desc,
                            icon: <FileText size={24} />,
                            gradient: "from-blue-600 to-blue-500",
                        },
                        {
                            step: "02",
                            title: t.how_it_works.step2_title,
                            desc: t.how_it_works.step2_desc,
                            icon: <ShieldCheck size={24} />,
                            gradient: "from-violet-600 to-blue-500",
                        },
                        {
                            step: "03",
                            title: t.how_it_works.step3_title,
                            desc: t.how_it_works.step3_desc,
                            icon: <CheckCircle2 size={24} />,
                            gradient: "from-emerald-600 to-sky-500",
                        },
                    ].map((s, i) => (
                        <Reveal key={i} delay={i * 0.15}>
                            <div className="card-elevated p-8 h-full relative group overflow-hidden">
                                <div className="text-[80px] font-black absolute top-2 right-4 text-slate-100 group-hover:text-slate-200 transition-colors select-none leading-none">
                                    {s.step}
                                </div>
                                <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-6 text-white shadow-lg`}>
                                    {s.icon}
                                </div>
                                <h3 className="relative z-10 text-slate-900 font-black text-xl tracking-tight mb-3">{s.title}</h3>
                                <p className="relative z-10 text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.5} className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-100">
                        <Clock size={14} className="text-emerald-600" />
                        <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">
                            {t.how_it_works.footer}
                        </span>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
