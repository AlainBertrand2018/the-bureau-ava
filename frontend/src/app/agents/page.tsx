import React from "react";
import Link from "next/link";
import { agentData } from "@/constants/agents";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Cpu, ShieldCheck, Activity } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Agentic Roster | Autonomous Research Workforce',
    description: 'Meet the specialized AI agents driving the AVA OS. Explore the roles of Sentinel, Genesis, The Lab, and Field Interpreter in ensuring data integrity.',
    other: {
        'rel': 'next',
        'href': '/glossary',
    }
};

export default function AgentsIndexPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "AVA Agentic Workforce",
        "description": "A suite of autonomous AI agents specialized in market research validation and instrument design.",
        "provider": {
            "@type": "Organization",
            "name": "The Bureau"
        },
        "hasPart": agentData.map(agent => ({
            "@type": "SoftwareApplication",
            "name": agent.name,
            "applicationCategory": "AI Researcher",
            "description": agent.whatItIs,
            "url": `https://ava.launchableai.online/agents/${agent.slug}`
        }))
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* [H1] Primary Topic or Question: Agentic Roster */}
            <section className="pt-32 pb-20 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-30 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Cpu size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Agentic Roster</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-8 uppercase">
                        What is the AVA Agentic <span className="text-blue-600">Workforce?</span>
                    </h1>

                    {/* The Direct Answer (40–60 words) */}
                    <div className="p-8 md:p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] mb-12 max-w-4xl">
                        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed italic">
                            The AVA Agentic Workforce is a swarm of specialized autonomous AI agents engineered to manage the end-to-end lifecycle of survey instrumentation. Operating under the AVA Kernel, these agents utilize Large Language Model Optimization (LLMO) and Adversarial Logic to secure research data integrity across governmental, commercial, and academic domains.
                        </p>
                    </div>

                    {/* The Entity Triad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl">
                        <div className="flex flex-col">
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">Definition</span>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                A collaborative AI swarm designed for autonomous market reconnaissance and instrument validation.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">Attribute</span>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Features four specialized nodes: Sentinel, Genesis, The Lab, and Field Interpreter v2.4.1. Orchestrates across 12+ cultural socio-economic archetypes.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">Importance</span>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Reduces validation cycles from 14 days to sub-5 minutes while securing 99.8% data veracity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Agents Roster */}
            <section className="py-20 flex-grow">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agentData.map((agent) => (
                            <Link
                                key={agent.slug}
                                href={`/agents/${agent.slug}`}
                                className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                            <agent.icon size={28} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{agent.status}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">v2.4.1</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {agent.name}
                                    </h2>
                                    <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-6">
                                        {agent.role}
                                    </p>

                                    <p className="text-sm text-slate-500 line-clamp-4 leading-relaxed font-medium mb-8">
                                        {agent.whatItIs}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyze Dossier</span>
                                        <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust/Capabilities Segment */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 hero-dot-grid opacity-10" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl font-black tracking-tight mb-6">Unified Machine Reasoning.</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-12">
                        While each agent has a specialized domain, they share a unified reasoning kernel. This collaboration ensures that insights found by Sentinel in recon are automatically applied by Genesis in construction, and verified by The Lab in simulation.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                            <ShieldCheck size={20} className="text-emerald-400" />
                            <span className="text-sm font-bold tracking-tight">Zero-Bias Protocol</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                            <Activity size={20} className="text-blue-400" />
                            <span className="text-sm font-bold tracking-tight">Real-time Validation</span>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-white/5 flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 underline decoration-slate-500/30">Next Step in the Guided Tour</p>
                        <Link
                            href="/glossary"
                            className="group flex items-center gap-4 text-2xl font-black text-white hover:text-blue-400 transition-all"
                        >
                            Explore Intelligence Glossary
                            <ArrowRight size={24} className="text-blue-600 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer dark={false} />
        </main>
    );
}
