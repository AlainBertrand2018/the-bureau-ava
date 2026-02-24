import React from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, BookOpen, Clock, ShieldCheck, User } from "lucide-react";
import { Metadata } from 'next';
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
    title: 'Bureau Insights | Survey Intelligence & AI Research',
    description: 'Executive briefings on data integrity, synthetic population testing, and the future of autonomous market research.',
};

async function getPosts() {
    const token = process.env.SANITY_API_TOKEN;

    try {
        // Get published posts first
        const query = `*[_type == "post"] | order(publishedAt desc) {
            ...,
            author->,
            categories[]->
        }`;
        const publishedPosts = await client.fetch(query);

        // If we have published posts, return them
        if (publishedPosts && publishedPosts.length > 0) {
            return publishedPosts;
        }

        // Fallback: try drafts if no published posts found
        if (token) {
            const draftClient = client.withConfig({ token, perspective: 'drafts', useCdn: false });
            return await draftClient.fetch(query);
        }

        return [];
    } catch (e) {
        console.error("fetchPosts error:", e);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <main className="min-h-screen bg-[#F2F0E9] flex flex-col">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 sm:pt-36 pb-10 sm:pb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#2E4036] flex items-center justify-center shadow-lg shadow-black/20">
                            <BookOpen size={18} className="text-[#F2F0E9]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CC5833]">Bureau Insights</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#2E4036] mb-4 uppercase leading-[0.9]">
                        The Intelligence <span className="text-[#CC5833]">Briefings.</span>
                    </h1>
                    <p className="text-base sm:text-lg text-[#2E4036]/60 font-medium max-w-2xl leading-relaxed font-serif">
                        Analyzing the frontier of autonomous market research. From data integrity crises to the rise of synthetic panels—stay briefed on the AI evolution.
                    </p>
                </div>
            </section>

            {/* Blog Feed — 3-col grid with "Load More" */}
            <BlogGrid posts={posts} />

            {/* AEO Footer Content Segment */}
            <section className="py-16 sm:py-24 bg-[#2E4036] text-[#F2F0E9] overflow-hidden relative">
                <div className="absolute inset-0 hero-dot-grid opacity-5" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-[#CC5833] mx-auto mb-6 sm:mb-8 animate-pulse" />
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-4 sm:mb-6 uppercase leading-none">
                        Securing Research <span className="text-[#CC5833]">Sovereignty.</span>
                    </h2>
                    <p className="text-[#F2F0E9]/60 leading-relaxed text-sm sm:text-lg mb-8 sm:mb-10 font-serif">
                        Our insights are derived from real-world adversarial audits of institutional research instruments. We identify logic gaps and structural flaws before they compromise your strategic data.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        {['Synthetic Panels', 'Adversarial Auditing', 'Data Integrity'].map(tag => (
                            <div key={tag} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#F2F0E9]/40">
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer dark={true} />
        </main>
    );
}
