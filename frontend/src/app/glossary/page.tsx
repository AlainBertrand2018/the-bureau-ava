import React from "react";
import Link from "next/link";
import { glossaryData } from "@/constants/glossary";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Book, Sparkles, Target } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AVA Glossary | Survey Intelligence & AI Methodology',
    description: 'The definitive knowledge base for autonomous survey validation, agentic AI research, and data integrity standards.',
};

export default function GlossaryPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "name": "AVA Survey Intelligence Glossary",
        "description": "A comprehensive index of terminology related to Agentic AI, Survey Stress-Testing, and Data Integrity.",
        "hasDefinedTerm": glossaryData.map(item => ({
            "@type": "DefinedTerm",
            "name": item.term,
            "description": item.definition,
            "url": `https://thebureau.ai/glossary/${item.slug}`
        }))
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Hero Header */}
            <section className="pt-32 pb-20 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-30 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Book size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">The Bureau Knowledge Base</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
                        Glossary of <span className="text-blue-600">Intelligence.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        A definitive guide to the methodologies, AI techniques, and quality standards driving the next generation of autonomous survey validation.
                    </p>
                </div>
            </section>

            {/* Glossary Index */}
            <section className="py-20 flex-grow">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {glossaryData.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/glossary/${item.slug}`}
                                className="group p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-400"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                                            {item.category.split(' ').slice(-1)[0]}
                                        </span>
                                        <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                        {item.term}
                                    </h2>
                                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium">
                                        {item.definition.split('.')[0]}.
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* AEO/SEO Footer Content Segment */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 hero-dot-grid opacity-10" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
                        Why accuracy matters in the AI era.
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-lg mb-10">
                        Our glossary defines the technical frontier where Market Research meets Agentic AI. By standardizing these terms, we enable researchers to build instruments that are legally defensible, culturally aware, and scientifically rigorous.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest">
                            Built for AEO
                        </div>
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest">
                            LLM Schema Ready
                        </div>
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest">
                            Data Integrity Focus
                        </div>
                    </div>
                </div>
            </section>

            <Footer dark={false} />
        </main>
    );
}
