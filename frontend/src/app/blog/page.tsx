import React from "react";
import Link from "next/link";
import { blogPosts } from "@/constants/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, BookOpen, Clock, Calendar, Sparkles } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bureau Insights | Survey Intelligence & AI Research',
    description: 'Executive briefings on data integrity, synthetic population testing, and the future of autonomous market research.',
};

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* GEO Lede / Hero */}
            <section className="pt-32 pb-20 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-30 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Bureau Insights</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 uppercase">
                        The Intelligence <span className="text-blue-600">Briefings.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Analyzing the frontier of autonomous market research. From data integrity crises to the rise of synthetic panels—stay briefed on the AI evolution.
                    </p>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-20 flex-grow">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {blogPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                            >
                                <div className="p-10 flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                            {post.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                            <Clock size={12} />
                                            {post.readTime}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tight">
                                        {post.title}
                                    </h2>

                                    <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                <Sparkles size={14} className="text-slate-400" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                            Read Briefing
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* AEO Footer Content Segment */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 hero-dot-grid opacity-10" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 uppercase">
                        Securing Research Sovereignty.
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-lg mb-10">
                        Our insights are derived from real-world adversarial audits of institutional research instruments. We identify logic gaps and structural flaws before they compromise your strategic data.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                            Synthetic Panels
                        </div>
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                            Adversarial Auditing
                        </div>
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                            Data Integrity
                        </div>
                    </div>
                </div>
            </section>

            <Footer dark={false} />
        </main>
    );
}
