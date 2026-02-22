"use client";
import React from "react";
import { BarChart3, Briefcase, Building2, Globe, GraduationCap, Megaphone, Users } from "lucide-react";
import { Reveal } from "./LandingUtils";

const item = {}; // placeholder to match structure if needed, but I already fixed the component body.
// Wait, I should just remove lines 6-9.


export default function WhoItsFor() {
    return (
        <section id="built-for-decision-makers" className="section-full bg-slate-950 relative overflow-hidden">
            {/* Background Grain/Grid */}
            <div className="absolute inset-0 hero-dot-grid opacity-[0.05] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Users size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            The Audience
                        </span>
                    </div>
                    <h2 className="text-section-title text-white mb-6">
                        Built for researchers
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            and decision makers
                        </span>
                    </h2>
                </Reveal>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { icon: <Building2 size={20} />, title: "Governmental Agencies", desc: "Scientific auditing for national policy and social research." },
                        { icon: <Briefcase size={20} />, title: "FMCG Brand Leads", desc: "Securing market reconnaissance for global product launches." },
                        { icon: <GraduationCap size={20} />, title: "Academic Institutions", desc: "Vetting complex questionnaires for peer-reviewed rigor." },
                        { icon: <BarChart3 size={20} />, title: "Market Research Units", desc: "Adversarial stress-testing for institutional field instruments." },
                        { icon: <Globe size={20} />, title: "Behavioral Analysts", desc: "Deep psychometric mapping through synthetic respondent personas." },
                        { icon: <Megaphone size={20} />, title: "Strategic Consultants", desc: "Securing decision-quality data for large-scale investments." },
                    ].map((item, i) => (
                        <Reveal key={i} delay={i * 0.08}>
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default h-full">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>


            </div>
        </section>
    );
}
