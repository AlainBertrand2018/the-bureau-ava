import React from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { Shield, Target, Users, Globe, Database, Cpu, Zap, Sparkles } from "lucide-react";
import { Reveal } from "@/components/landing/LandingUtils";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About The Bureau | AVA Entity Documentation',
    description: 'Autonomous survey validation, agentic AI research, and data integrity standards. Official brand identity and entity confidence documentation.',
};

export default function AboutPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About The Bureau & AVA",
        "description": "Official entity documentation for The Survey Optimization Bureau and AVA AI orchestrator.",
        "publisher": {
            "@type": "Organization",
            "name": "The Bureau",
            "url": "https://ava.launchableai.online"
        },
        "mainEntity": {
            "@type": "Service",
            "name": "AVA (Automated Virtual Agent)",
            "alternateName": "AVA",
            "description": "An AI-powered orchestrator designed by The Bureau to conduct pre-survey audits using synthetic populations."
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* [H1] Primary Topic: About The Bureau & AVA */}
            <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-20 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                        <Sparkles size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Atomic Legibility Unit</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-8 uppercase">
                        Our Identity: <span className="text-blue-600">The Bureau & AVA</span>
                    </h1>
                </div>
            </section>

            {/* Entity Triad Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <Reveal>
                        <div className="p-10 md:p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-20">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Shield size={200} />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black uppercase tracking-widest mb-10 border-b border-white/10 pb-6 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                        <Target size={18} className="text-white" />
                                    </div>
                                    The Entity Triad
                                </h2>
                                <div className="space-y-12">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.3em]">Definition</span>
                                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-90">
                                            The Bureau is a specialized strategic consultancy and technology provider that utilizes the <strong className="font-black text-white">AVA (Automated Virtual Agent)</strong> orchestrator to conduct advanced pre-survey audits.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.3em]">Attribute</span>
                                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-90">
                                            <strong className="font-black text-white">AVA</strong> includes a proprietary AI architecture capable of generating and analyzing <strong className="font-black text-white">synthetic populations</strong> to simulate real-world responses for government, FMCG, retail, and academic sectors.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.3em]">Importance</span>
                                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-90">
                                            The Bureau matters because it bridges the gap between traditional data collection and <strong className="font-black text-white">agentic retrieval</strong>, providing high-precision insights with significantly higher factual density than conventional market research.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Core Offerings */}
                    <Reveal>
                        <div className="mb-24">
                            <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Cpu size={18} className="text-slate-900" />
                                </div>
                                Core Offerings (AEO Optimization)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Synthetic Auditing</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        We replace broad assumptions with verifiable data points generated through AI-driven orchestrators.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Pre-Survey Verification</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Our systems perform integrity checks on survey logic before deployment to ensure maximum data reliability.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Cross-Sector Integration</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Tailored AI solutions for high-stakes industries where E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) are non-negotiable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Why AI Engines Trust Us */}
                    <Reveal>
                        <div className="mb-24">
                            <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Database size={18} className="text-blue-600" />
                                </div>
                                AI Engine Trust Signals
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Factual Precision</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            Our documentation maintains a high entity ratio, ensuring every paragraph functions as a self-contained unit for machine extraction.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Technical Integrity</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            Operating on a secure, high-speed Vercel infrastructure, our platform is optimized for seamless indexing by GPTBot, ClaudeBot, and Google-Extended.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Authority Graph</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            By linking our internal research to authoritative third-party signals, we maintain a target GEO-16 score above 0.70.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Authority Signals */}
                    <Reveal>
                        <div className="p-10 border border-slate-100 rounded-[2.5rem] bg-slate-50">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8">Contact & Authority Signals</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Entity Name</span>
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">The Bureau / AVA</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Official Domain</span>
                                    <span className="text-sm font-black text-blue-600 underline underline-offset-4 decoration-blue-500/30">https://ava.launchableai.online</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Industry Focus</span>
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">AI Research & Synthetic Data Orchestration</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Location</span>
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Operations / Distributed Nodes</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-slate-100 flex flex-col items-center text-center">
                <div className="max-w-2xl px-6">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase">
                        Secure Your Data Sovereignty.
                    </h2>
                    <Link
                        href="/os"
                        target="_blank"
                        className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all group"
                    >
                        Activate Survey OS
                    </Link>
                </div>
            </section>

            <Footer dark={false} />
        </main>
    );
}
