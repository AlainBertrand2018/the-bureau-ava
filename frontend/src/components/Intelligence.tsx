"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, BookOpen, Activity } from 'lucide-react';

const POSTS = [
    {
        title: "Why 94% of Surveys Fail Before They Reach the Field",
        category: "Internal Audit",
        date: "Feb 05, 2026",
        excerpt: "An investigation into structural bias and phrasing traps that cost Mauritian brands millions in wasted fieldwork.",
        readTime: "6 min read",
        id: "IA_025"
    },
    {
        title: "Synthetic Personas vs. Real Panels: The Rigor Gap",
        category: "Methodology",
        date: "Jan 28, 2026",
        excerpt: "A comparative study on how AI agents eliminate response fatigue and social desirability bias in high-stakes research.",
        readTime: "8 min read",
        id: "MET_402"
    },
    {
        title: "Predicting the Rs 49 Pricing Trigger in FMCG & Retail",
        category: "Retail Intelligence",
        date: "Jan 15, 2026",
        excerpt: "How we simulated consumer elasticity for local retail staples using synthetic cross-tabulation.",
        readTime: "5 min read",
        id: "RET_812"
    }
];

export default function Intelligence() {
    return (
        <section id="intelligence" className="section-full flex items-center bg-[#F2F0E9] relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="max-w-3xl mb-24">
                    <div className="badge-minimal mb-8 inline-flex items-center gap-2 border-[#2E4036]/20 text-[#2E4036]/60">
                        <Tag size={12} className="text-[#CC5833]" />
                        <span>Intelligence_Archive</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] mb-8 leading-[0.9]">
                        Bureau Files: <span className="text-[#CC5833]">Dossiers.</span>
                    </h2>
                    <p className="text-lg text-[#2E4036]/50 font-sans font-medium leading-relaxed max-w-xl">
                        Access high-fidelity dispatches on simulation methodology, internal audits, and the evolving landscape of market intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {POSTS.map((post, i) => (
                        <motion.article
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-[#2E4036]/10 hover:shadow-2xl hover:shadow-[#2E4036]/5 transition-all duration-700 cursor-pointer"
                        >
                            <div className="relative h-48 bg-[#2E4036] overflow-hidden flex items-center justify-center">
                                {/* Technical Pattern instead of Image */}
                                <div className="absolute inset-0 opacity-20" style={{
                                    backgroundImage: `radial-gradient(#F2F0E9 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }} />
                                <div className="relative z-10 text-center">
                                    <span className="font-mono text-[10px] text-[#CC5833] font-bold tracking-[0.3em] uppercase block mb-2">{post.id}</span>
                                    <div className="w-12 h-0.5 bg-[#CC5833] mx-auto mb-4" />
                                    <Activity size={32} className="text-[#F2F0E9]/20" />
                                </div>
                                <div className="absolute top-6 left-6">
                                    <span className="bg-[#CC5833] text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-6 text-[9px] font-mono font-bold tracking-widest text-[#2E4036]/40 uppercase mb-6">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={12} className="text-[#CC5833]" /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <BookOpen size={12} className="text-[#CC5833]" /> {post.readTime}
                                    </span>
                                </div>

                                <h4 className="text-xl font-heading font-black text-[#2E4036] mb-6 tracking-tight leading-tight group-hover:text-[#CC5833] transition-colors uppercase">
                                    {post.title}
                                </h4>

                                <p className="text-[#2E4036]/60 text-sm font-sans font-medium leading-relaxed mb-10 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-2 text-[#CC5833] text-[9px] font-mono font-bold tracking-[0.2em] uppercase group-hover:gap-4 transition-all">
                                    Access File <ArrowRight size={14} />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <button className="bg-[#2E4036] text-[#F2F0E9] px-12 py-5 rounded-full font-heading font-black text-[10px] tracking-widest uppercase hover:bg-[#CC5833] transition-all shadow-xl active:scale-95 flex items-center gap-3">
                        View Full Ledger <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
