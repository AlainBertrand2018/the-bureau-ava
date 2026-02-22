"use client";
import React from "react";
import { Target } from "lucide-react";
import { Reveal, AnimatedCounter } from "./LandingUtils";




interface ProofProps {
    pubStats: any;
}

export default function Proof({ pubStats }: ProofProps) {
    return (
        <section id="proof" className="section-full section-warm relative">
            <div className="max-w-5xl mx-auto px-6 w-full">
                <Reveal className="text-center mb-16">
                    <div className="badge-green inline-flex items-center gap-2 mb-6">
                        <Target size={12} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            Field Evidence
                        </span>
                    </div>
                    <h2 className="text-section-title text-slate-900 mb-4">
                        I was challenged on 12 surveys.
                    </h2>
                    <p className="text-base text-slate-500 font-medium max-w-lg mx-auto">
                        Before I used the Bureau, I was flying blind. Now, every question is a verified asset.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { target: pubStats?.total_questions_processed || 520, label: "Questions Processed", color: "text-blue-500", suffix: "+" },
                        { target: pubStats?.average_quality_score || 98, label: "Average Quality Score", color: "text-emerald-500", suffix: "/100" },
                        { target: pubStats?.total_audits || 12, label: "Audits Completed", color: "text-violet-600", suffix: "+" },
                    ].map((stat, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                            <div className="card-elevated p-8 text-center">
                                <div className={`text-5xl font-black ${stat.color} mb-2`}>
                                    <AnimatedCounter target={stat.target} suffix={stat.suffix} className={stat.color} />
                                </div>
                                <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.3} className="text-center">
                    <p className="text-slate-400 text-sm font-semibold">
                        Most issues were fixed in minutes.{" "}
                        <span className="text-emerald-600 font-bold">Before a single respondent was contacted.</span>
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
