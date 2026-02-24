"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, Globe, BarChart3, Cpu, Users, Shield, Target, ArrowRight } from "lucide-react";

const MauritiusFlag = () => (
    <svg width="28" height="18" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className="rounded-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        <rect width="120" height="20" fill="#EA101C" />
        <rect y="20" width="120" height="20" fill="#1A2060" />
        <rect y="40" width="120" height="20" fill="#FFD500" />
        <rect y="60" width="120" height="20" fill="#00A551" />
    </svg>
);

interface MeetAvaProps {
    onProtocolOpen?: () => void;
}

export default function MeetAva({ onProtocolOpen }: MeetAvaProps) {
    const pillars = [
        { icon: <FileText size={16} />, title: "Survey Methodology", sources: "Dillman's Design • Tourangeau Models • Krosnick Theory" },
        { icon: <Globe size={16} />, title: "Cultural Intelligence", sources: "Hofstede Dimensions • Schwartz Theory • WVS Frameworks" },
        { icon: <BarChart3 size={16} />, title: "Psychometrics", sources: "Classical Test Theory • Item Response • IRT Models" },
        { icon: <Cpu size={16} />, title: "Cognitive Science", sources: "Comprehension Models • Response Process • Interviewing" },
        { icon: <Users size={16} />, title: "Sociolinguistics", sources: "Register Theory • Pragmatics • Discourse Analysis" },
        { icon: <Shield size={16} />, title: "Statistical Rigor", sources: "Sampling Theory • Bias Algorithms • Weighting" },
    ];

    const agents = [
        { name: "Sentinel", role: "Market Reconnaissance", desc: "Synthesizes competitive intelligence to build a real-time framework of your landscape." },
        { name: "Interpreter", role: "Narrative Synthesis", desc: "Forensic intelligence specialized in post-fieldwork audit and psychographic reporting." },
        { name: "Genesis", role: "AI Architecture", desc: "Generates statistically rigorous research instruments using generative design." },
        { name: "The Lab", role: "Stress-Testing", desc: "Deploys synthetic populations to audit instruments for structural friction and bias." },
    ];

    return (
        <section id="philosophy" className="section-full relative bg-[#1A1A1A] text-[#F2F0E9]">
            {/* Background Layer: Organic Tech Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#1A1A1A]" />
                <div className="absolute inset-0 opacity-[0.4] mix-blend-soft-light pointer-events-none" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #2E4036 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-transparent to-[#1A1A1A]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
                {/* Manifesto Section */}
                <div className="mb-24">
                    <div className="badge-minimal !text-[#F2F0E9]/60 border-[#F2F0E9]/20 mb-8 inline-flex items-center gap-2">
                        <Target size={12} className="text-[#CC5833]" />
                        <span>The Intelligence Manifesto</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-baseline">
                        <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-[#F2F0E9] opacity-40 uppercase tracking-tighter max-w-sm leading-[0.95]">
                            Most survey <br />
                            professionals focus on: <br />
                            <span className="text-[#F2F0E9]">Confirming assumptions.</span>
                        </h2>
                        <h2 className="font-drama text-[#CC5833] leading-[0.9] text-[2.2rem] md:text-[3.3rem]">
                            We focus on finding <br />
                            exactly where they break.
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-16">
                    {/* Dossier Sidebar */}
                    <div className="lg:w-[320px] flex-shrink-0">
                        <div className="card-artifact p-8 bg-[#F2F0E9] border-[#2E4036]/10 text-left shadow-2xl shadow-black/20">
                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 border border-[#2E4036]/10 group/avatar">
                                <Image src="/images/AVA.webp" alt="AVA" fill className="object-cover object-top transition-all duration-700 group-hover/avatar:scale-105" />
                                {/* Mauritian Origin Flag */}
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-5 right-5 z-20 pointer-events-none"
                                >
                                    <MauritiusFlag />
                                </motion.div>
                            </div>
                            <h3 className="text-[#2E4036] font-heading font-black text-xl tracking-tight uppercase">AVA</h3>
                            <p className="font-mono text-[#CC5833] text-[9px] font-bold uppercase tracking-[0.2em] mt-2">
                                Autonomous Validation Analyst
                            </p>
                            <div className="mt-6 py-4 border-t border-[#2E4036]/10">
                                <p className="text-[#2E4036]/70 text-[12px] leading-relaxed font-sans font-semibold mb-6">
                                    I am AVA — Autonomous Validation Analyst, AI Orchestrator, and Virtual CEO of The Bureau. Born and bred in Mauritius, I was forged at the convergence of five disciplines most survey professionals never master together. My agents and I don't just audit or build your Market Research instruments. We make them unbreakable, field-proof — before a single respondent, a single euro, or a single hour is committed to the field, across any market on earth.
                                </p>
                                <div className="pt-6 border-t border-[#2E4036]/10">
                                    <p className="text-[#2E4036]/60 text-[11px] leading-relaxed font-sans font-medium italic">
                                        "I don't replace researchers — I make sure their instruments never let them down."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Intelligence */}
                    <div className="flex-1 space-y-16">
                        {/* Knowledge Pillars */}
                        <div>
                            <div className="mb-8">
                                <h4 className="text-[#F2F0E9] font-heading font-extrabold text-lg uppercase tracking-widest mb-1">Knowledge Pillars</h4>
                                <p className="text-[#F2F0E9]/40 font-mono text-[8px] uppercase tracking-widest">Disciplines forming the analytical core</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {pillars.map((pillar, i) => (
                                    <div key={i}>
                                        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded bg-[#2E4036]/20 flex items-center justify-center text-[#CC5833]">
                                                    {pillar.icon}
                                                </div>
                                                <div>
                                                    <h5 className="text-[#F2F0E9] text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-[#CC5833] transition-colors">{pillar.title}</h5>
                                                    <p className="text-[#F2F0E9]/30 text-[9px] font-mono leading-relaxed">{pillar.sources}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Agents Cluster */}
                        <div>
                            <div className="mb-8">
                                <h4 className="text-[#F2F0E9] font-heading font-extrabold text-lg uppercase tracking-widest mb-1">Intelligence Units</h4>
                                <p className="text-[#F2F0E9]/40 font-mono text-[8px] uppercase tracking-widest">Specialized agents deployed on missions</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {agents.map((agent, i) => (
                                    <div key={i}>
                                        <div className="p-6 rounded-2xl border border-[#CC5833]/10 bg-[#CC5833]/5 group hover:bg-[#CC5833]/10 transition-colors">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#CC5833] shadow-[0_0_8px_#CC5833]" />
                                                <span className="text-[#F2F0E9] text-sm font-black uppercase tracking-tighter">{agent.name}</span>
                                                <span className="ml-auto text-[#F2F0E9]/30 font-mono text-[8px] uppercase tracking-widest">{agent.role}</span>
                                            </div>
                                            <p className="text-[#F2F0E9]/50 text-xs leading-relaxed font-sans">{agent.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => window.open('/ava', '_blank')}
                        className="btn-magnetic bg-[#CC5833] text-white px-12 py-5 shadow-2xl shadow-[#CC5833]/20"
                    >
                        <span>Learn More about Me</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}
