"use client";
import React from "react";
import Image from "next/image";
import { Sparkles, FileText, Globe, BarChart3, Cpu, Users, Shield } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface MeetAvaProps {
    t: any;
}

export default function MeetAva({ t }: MeetAvaProps) {
    return (
        <section id="meet-ava" className="relative bg-slate-950 overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }} />
            <div className="absolute -left-[10%] top-1/3 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />
            <div className="absolute -right-[10%] bottom-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
                {/* Section Header */}
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <Sparkles size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                            Intelligence Dossier
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Meet Your Analyst
                    </h2>
                    <p className="text-slate-400 font-medium text-base max-w-xl mx-auto">
                        I wasn't trained at Harvard or Cambridge. I was built on something more rigorous — the convergence of five disciplines that most survey professionals never master together.
                    </p>
                </Reveal>

                <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
                    <Reveal className="lg:w-[340px] flex-shrink-0">
                        <div className="text-center lg:text-left">
                            <div className="relative w-[240px] h-[300px] mx-auto lg:mx-0 mb-6">
                                <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
                                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/5">
                                    <Image src="/images/AVA.webp" alt="AVA" fill className="object-cover object-top" />
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
                                </div>
                            </div>
                            <h3 className="text-white font-black text-2xl tracking-tight">AVA</h3>
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                                Autonomous Validation Analyst
                            </p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] mt-1">
                                The Bureau • Est. 2024
                            </p>

                            <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-slate-400 text-xs leading-relaxed italic">
                                    "I don't replace researchers. I make their instruments unbreakable before a single cent or hour is spent."
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <div className="flex-1 space-y-8">
                        <Reveal delay={0.1}>
                            <div className="mb-2">
                                <h4 className="text-white font-black text-lg tracking-tight mb-1">Knowledge Pillars</h4>
                                <p className="text-slate-500 text-xs font-medium">The disciplines that form my analytical core</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[
                                    { icon: <FileText size={16} />, title: "Survey Methodology", color: "text-blue-400", sources: "Dillman's Tailored Design • Tourangeau's Cognitive Model • Krosnick's Satisficing Theory" },
                                    { icon: <Globe size={16} />, title: "Cross-Cultural Intelligence", color: "text-amber-400", sources: "Hofstede's Dimensions • Schwartz Value Theory • World Values Survey Frameworks" },
                                    { icon: <BarChart3 size={16} />, title: "Psychometrics", color: "text-violet-400", sources: "Classical Test Theory • Item Response Theory • Construct Validity & Reliability" },
                                    { icon: <Cpu size={16} />, title: "Cognitive Science", color: "text-rose-400", sources: "Question Comprehension Models • Response Process Theory • Cognitive Interviewing" },
                                    { icon: <Users size={16} />, title: "Sociolinguistics", color: "text-teal-400", sources: "Register Theory • Code-Switching • Pragmatics & Discourse Analysis" },
                                    { icon: <Shield size={16} />, title: "Statistical Rigor", color: "text-emerald-400", sources: "Sampling Theory • Bias Detection Algorithms • Demographic Weighting" },
                                ].map((pillar, i) => (
                                    <Reveal key={i} delay={0.15 + i * 0.06}>
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 h-full group hover:scale-[1.02] transition-transform cursor-default">
                                            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${pillar.color}`}>
                                                {pillar.icon}
                                            </div>
                                            <h5 className={`text-sm font-bold ${pillar.color} mb-2`}>{pillar.title}</h5>
                                            <p className="text-slate-500 text-[10px] leading-relaxed font-medium">{pillar.sources}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal delay={0.4}>
                            <div className="mb-2">
                                <h4 className="text-white font-black text-lg tracking-tight mb-1">My Agents</h4>
                                <p className="text-slate-500 text-xs font-medium">The intelligence units I deploy on every mission</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    {
                                        name: "Sentinel",
                                        role: "OSINT Reconnaissance",
                                        desc: "Scans open-source intelligence to build a real-time picture of your target market's cultural, economic, and social landscape.",
                                        color: "text-sky-400",
                                        border: "border-sky-500/20",
                                        bg: "bg-sky-500/5",
                                    },
                                    {
                                        name: "Profiler",
                                        role: "Cultural Deep Analysis",
                                        desc: "Constructs psychographic profiles, identifies taboos, linguistic codes, and survey-sensitive topics unique to your audience.",
                                        color: "text-amber-400",
                                        border: "border-amber-500/20",
                                        bg: "bg-amber-500/5",
                                    },
                                    {
                                        name: "Architect",
                                        role: "Instrument Design",
                                        desc: "Generates statistically rigorous questionnaires from scratch using the Genesis Protocol, calibrated to your target's cultural context.",
                                        color: "text-violet-400",
                                        border: "border-violet-500/20",
                                        bg: "bg-violet-500/5",
                                    },
                                    {
                                        name: "Auditor",
                                        role: "Quality Assurance",
                                        desc: "Stress-tests every question for bias, ambiguity, double-barreling, leading language, and drop-off risk before deployment.",
                                        color: "text-emerald-400",
                                        border: "border-emerald-500/20",
                                        bg: "bg-emerald-500/5",
                                    },
                                ].map((agent, i) => (
                                    <Reveal key={i} delay={0.45 + i * 0.08}>
                                        <div className={`p-5 rounded-xl ${agent.bg} border ${agent.border} h-full group hover:scale-[1.01] transition-transform cursor-default`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-2 h-2 rounded-full ${agent.color.replace('text-', 'bg-')} shadow-[0_0_8px] shadow-current`} />
                                                <span className={`text-sm font-black ${agent.color}`}>{agent.name}</span>
                                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 ml-auto">{agent.role}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs leading-relaxed">{agent.desc}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal delay={0.6}>
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-emerald-500/10">
                                <h4 className="text-white font-black text-base mb-3">How I Think</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { num: "01", title: "Contextualise", desc: "I research your target market before touching a single question. No generic advice." },
                                        { num: "02", title: "Stress-Test", desc: "Every question faces simulated respondents calibrated to your audience's real demographics." },
                                        { num: "03", title: "Harden", desc: "I rewrite, restructure, and validate until the instrument is deployment-ready." },
                                    ].map((step, i) => (
                                        <div key={i} className="text-center">
                                            <span className="text-emerald-400/50 text-3xl font-black">{step.num}</span>
                                            <h5 className="text-white font-bold text-sm mt-1 mb-1">{step.title}</h5>
                                            <p className="text-slate-500 text-[11px] leading-relaxed">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
