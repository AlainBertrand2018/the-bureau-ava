"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';

const POSTS = [
    {
        title: "Why 94% of Surveys Fail Before They Reach the Field",
        category: "Internal Audit",
        date: "Feb 05, 2026",
        excerpt: "An investigation into structural bias and phrasing traps that cost Mauritian brands millions in wasted fieldwork.",
        image: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800",
        readTime: "6 min read"
    },
    {
        title: "Synthetic Personas vs. Real Panels: The Rigor Gap",
        category: "Methodology",
        date: "Jan 28, 2026",
        excerpt: "A comparative study on how AI agents eliminate response fatigue and social desirability bias in high-stakes research.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read"
    },
    {
        title: "Predicting the Rs 49 Pricing Trigger in FMCG & Retail",
        category: "Retail Intelligence",
        date: "Jan 15, 2026",
        excerpt: "How we simulated consumer elasticity for local retail staples using synthetic cross-tabulation.",
        image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80&w=800",
        readTime: "5 min read"
    }
];

export default function Intelligence() {
    return (
        <section id="intelligence" className="min-h-screen flex items-center bg-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-6 underline underline-offset-8 decoration-2">Bureau Files</h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
                        Intelligence Dossiers:<br />
                        <span className="text-primary">Where Data Becomes Truth.</span>
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Explore our latest dispatches on simulation methodology, internal audits, and the evolving landscape of Mauritian market intelligence.
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
                            className="group flex flex-col bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 cursor-pointer"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-6 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-6">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={14} /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <BookOpen size={14} /> {post.readTime}
                                    </span>
                                </div>

                                <h4 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-tight group-hover:text-primary transition-colors">
                                    {post.title}
                                </h4>

                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-2 text-primary text-[10px] font-black tracking-[0.2em] uppercase group-hover:gap-4 transition-all">
                                    Access File <ArrowRight size={14} />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <button className="bg-slate-900 text-white px-12 py-5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-primary transition-all shadow-xl active:scale-95 flex items-center gap-3">
                        View Full Ledger <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
