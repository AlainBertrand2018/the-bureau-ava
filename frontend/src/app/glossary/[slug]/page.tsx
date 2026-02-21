import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { glossaryData } from "@/constants/glossary";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ChevronRight, Zap, Shield, Cpu } from "lucide-react";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const entry = glossaryData.find((e) => e.slug === slug);
    if (!entry) return { title: 'Term Not Found' };

    return {
        title: `${entry.term} | AVA Glossary`,
        description: entry.definition.split('.')[0],
    };
}

export async function generateStaticParams() {
    return glossaryData.map((entry) => ({
        slug: entry.slug,
    }));
}

export default async function GlossaryTermPage({ params }: Props) {
    const { slug } = await params;
    const entry = glossaryData.find((e) => e.slug === slug);

    if (!entry) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": entry.term,
        "description": entry.definition,
        "url": `https://the-bureau-ava.vercel.app/glossary/${entry.slug}`,
        "inDefinedTermSet": "https://the-bureau-ava.vercel.app/glossary"
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Breadcrumbs */}
            <div className="pt-24 border-b border-slate-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link href="/glossary" className="hover:text-blue-600">Glossary</Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-900">{entry.term}</span>
                </div>
            </div>

            <article className="py-20 flex-grow">
                <div className="max-w-4xl mx-auto px-6">
                    <Link
                        href="/glossary"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 mb-12 hover:gap-3 transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to Glossary
                    </Link>

                    {/* DEFINITION HEADER - AEO TARGET */}
                    <header className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8" id={entry.slug}>
                            {entry.term}
                        </h1>

                        <div className="p-8 md:p-12 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Zap size={120} className="text-blue-600" />
                            </div>
                            {/* CORE DEFINITION BLOCK - FOR AEO EXTRACTION */}
                            <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-medium relative z-10">
                                {entry.definition}
                            </p>
                        </div>
                    </header>

                    {/* EXTENDED CONTENT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {/* Why it Matters */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield size={18} className="text-emerald-600" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Why it matters</h2>
                            </div>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {entry.whyItMatters}
                            </p>
                        </div>

                        {/* How AVA uses it */}
                        <div className="p-8 bg-slate-900 text-white rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <Cpu size={18} className="text-blue-400" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">How AVA Uses it</h2>
                            </div>
                            <p className="text-slate-300 leading-relaxed font-medium relative z-10">
                                {entry.howAvaUsesIt}
                            </p>
                            <div className="mt-6 flex items-center gap-2 relative z-10">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agent: {entry.agentName}</span>
                            </div>
                        </div>
                    </div>

                    {/* RELATED TERMS LINK GRAPH */}
                    <footer className="pt-12 border-t border-slate-100">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Related Intelligence</h2>
                        <div className="flex flex-wrap gap-3">
                            {entry.relatedTerms.map((rel) => (
                                <Link
                                    key={rel.slug}
                                    href={`/glossary/${rel.slug}`}
                                    className="px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all"
                                >
                                    {rel.name}
                                </Link>
                            ))}
                        </div>
                    </footer>
                </div>
            </article>

            <Footer dark={false} />
        </main>
    );
}
