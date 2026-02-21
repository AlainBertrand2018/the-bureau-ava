import React from "react";
import { notFound } from "next/navigation";
import { agentData } from "@/constants/agents";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Shield, Wrench, Cpu, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

type Props = {
    params: { slug: string };
};

export async function generateStaticParams() {
    return agentData.map((agent) => ({
        slug: agent.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const agent = agentData.find((a) => a.slug === params.slug);
    if (!agent) return { title: "Agent Not Found" };

    return {
        title: `${agent.name} — ${agent.role} | AVA OS`,
        description: agent.p1,
    };
}

export default function AgentDossierPage({ params }: Props) {
    const agent = agentData.find((a) => a.slug === params.slug);

    if (!agent) return notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": agent.name,
        "applicationCategory": "Researcher",
        "operatingSystem": "AVA OS",
        "description": agent.p1,
        "featureList": agent.skills,
        "provider": {
            "@type": "Organization",
            "name": "The Bureau"
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Breadcrumbs */}
            <nav className="pt-28 pb-6 bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <Link href="/" className="hover:text-blue-600 transition-colors">The Bureau</Link>
                        <ChevronRight size={10} />
                        <Link href="/agents" className="hover:text-blue-600 transition-colors">Agentic Roster</Link>
                        <ChevronRight size={10} />
                        <span className="text-blue-600">{agent.name}</span>
                    </div>
                </div>
            </nav>

            {/* Agent Detail Section */}
            <section className="py-20 flex-grow">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20">

                        {/* Left Content Column */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 text-white">
                                    <agent.icon size={32} />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                                        {agent.name}
                                    </h1>
                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-widest leading-loose">
                                        {agent.role}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-slate-900 font-black text-xl tracking-tight uppercase border-b border-slate-100 pb-4">Purpose & Scope</h2>
                                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium">
                                        {agent.p1}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-slate-900 font-black text-xl tracking-tight uppercase border-b border-slate-100 pb-4">Operational Mechanism</h2>
                                    <p className="text-lg text-slate-500 leading-relaxed italic">
                                        {agent.p2}
                                    </p>
                                </div>

                                <div className="p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-600/30 transition-colors duration-500" />
                                    <div className="relative z-10">
                                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Core Deliverable</span>
                                        <h3 className="text-2xl md:text-3xl font-black leading-tight mb-4">Output:</h3>
                                        <p className="text-xl text-slate-300 font-medium leading-relaxed">
                                            {agent.output}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-80 space-y-10">
                            {/* Stats Box */}
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Status: {agent.status}</span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 border-b border-slate-200 pb-2">Primary Skills</span>
                                        <div className="flex flex-wrap gap-2">
                                            {agent.skills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 border-b border-slate-200 pb-2">Resource Stack</span>
                                        <div className="flex flex-wrap gap-2">
                                            {agent.tools.map((tool, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-tight">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Related Knowledge Graph */}
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-6">Knowledge Graph</span>
                                <div className="space-y-4">
                                    {agent.relatedGlossary.map((term, i) => (
                                        <Link
                                            key={i}
                                            href={`/glossary/${term.slug}`}
                                            className="flex items-center justify-between group p-3 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all duration-300"
                                        >
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">{term.name}</span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <Shield size={24} className="text-slate-300" />
                                <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                    Audited by Bureau Security v1.4.2
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-slate-100 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Deploy this intelligence.</h2>
                    <Link
                        href="/os"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 transform"
                    >
                        Launch OS <Zap size={18} fill="currentColor" />
                    </Link>
                </div>
            </section>

            <Footer dark={false} />
        </main>
    );
}
