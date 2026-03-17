"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";
import { Reveal } from "./LandingUtils";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Post {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    image?: any;
    publishedAt?: string;
    readingTime?: number;
    author?: { name: string };
    categories?: { title: string }[];
}

export default function IntelligenceHub() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const query = `*[_type == "post"] | order(publishedAt desc)[0...4] {
                    _id,
                    title,
                    slug,
                    excerpt,
                    image,
                    publishedAt,
                    readingTime,
                    author->,
                    categories[]->
                }`;
                const data = await client.fetch(query);
                setPosts(data || []);
            } catch (err) {
                console.error("[IntelligenceHub] Failed to fetch posts:", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <section id="intelligence-hub" className="section-full bg-[#F2F0E9] relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 hero-dot-grid opacity-[0.08] pointer-events-none" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#CC5833]/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#2E4036]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                {/* Header */}
                <Reveal className="mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2.5 mb-6 px-4 py-1.5 rounded-full border border-[#2E4036]/10 bg-white/50">
                                <BookOpen size={12} className="text-[#CC5833]" />
                                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#CC5833]">
                                    Bureau Insights
                                </span>
                            </div>
                            <h2 className="text-section-title text-[#2E4036] mb-4">
                                Intelligence Hub.
                            </h2>
                            <p className="text-body-lg text-[#2E4036]/60 max-w-xl leading-relaxed font-sans">
                                Strategic analysis at the intersection of AI, data integrity, and modern market research methodology.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#2E4036]/10 bg-white hover:bg-[#2E4036] hover:border-[#2E4036] transition-all duration-500 shrink-0 self-start lg:self-auto shadow-sm"
                        >
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#2E4036]/70 group-hover:text-white transition-colors">
                                View All Briefings
                            </span>
                            <ArrowRight size={14} className="text-[#CC5833] group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </Reveal>

                {/* Article Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-white border border-[#2E4036]/5 overflow-hidden animate-pulse">
                                <div className="aspect-[16/10] bg-[#2E4036]/5" />
                                <div className="p-6 space-y-3">
                                    <div className="h-3 bg-[#2E4036]/10 rounded-full w-1/3" />
                                    <div className="h-4 bg-[#2E4036]/10 rounded-full w-full" />
                                    <div className="h-4 bg-[#2E4036]/10 rounded-full w-2/3" />
                                    <div className="h-3 bg-[#2E4036]/5 rounded-full w-full mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {posts.map((post, idx) => (
                            <Reveal key={post._id} delay={idx * 0.08} className="h-full">
                                <Link
                                    href={`/blog/${post.slug.current}`}
                                    className="group flex flex-col h-full rounded-2xl bg-white border border-[#2E4036]/5 overflow-hidden hover:shadow-[0_20px_40px_rgba(46,64,54,0.08)] hover:-translate-y-1.5 transition-all duration-500"
                                >
                                    {/* Image */}
                                    {post.image ? (
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={urlFor(post.image).width(480).height(300).url()}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4036]/20 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity duration-500" />

                                            {/* Category chip */}
                                            {post.categories?.[0] && (
                                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#2E4036]/10 shadow-sm">
                                                    <span className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#CC5833]">
                                                        {post.categories[0].title}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/10] bg-[#2E4036]/5 flex items-center justify-center">
                                            <BookOpen size={24} className="text-[#2E4036]/10" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow bg-white">
                                        {/* Meta */}
                                        <div className="flex items-center gap-3 mb-3">
                                            {post.publishedAt && (
                                                <span className="font-mono text-[9px] font-bold text-[#2E4036]/30 uppercase tracking-wider">
                                                    {formatDate(post.publishedAt)}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1 text-[#2E4036]/20">
                                                <Clock size={9} />
                                                <span className="font-mono text-[9px] font-bold">{post.readingTime || 5} MIN</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-sm font-black text-[#2E4036] uppercase tracking-tight leading-snug mb-3 group-hover:text-[#CC5833] transition-colors duration-300 line-clamp-2">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-[12px] text-[#2E4036]/40 font-medium leading-relaxed line-clamp-2 mb-4 font-sans">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-[#2E4036]/5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-[#F2F0E9] border border-[#2E4036]/10 flex items-center justify-center">
                                                    <User size={8} className="text-[#2E4036]/30" />
                                                </div>
                                                <span className="font-mono text-[8px] font-black uppercase tracking-widest text-[#2E4036]/25">
                                                    {post.author?.name || "AVA"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#CC5833] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="font-mono text-[8px] font-black uppercase tracking-widest">Read</span>
                                                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    /* Empty State — elegant fallback */
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-white border border-[#2E4036]/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <BookOpen size={24} className="text-[#CC5833]/50" />
                        </div>
                        <p className="font-mono text-[11px] font-bold text-[#2E4036]/25 uppercase tracking-[0.2em] mb-6">
                            Intelligence briefings coming soon.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-[#CC5833] font-mono text-[10px] font-black uppercase tracking-widest hover:text-[#2E4036] transition-colors"
                        >
                            Visit the Blog
                            <ArrowRight size={12} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
