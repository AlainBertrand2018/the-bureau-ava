"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, User, ChevronDown } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

const POSTS_PER_PAGE = 12;

interface BlogGridProps {
    posts: any[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

    const visiblePosts = posts.slice(0, visibleCount);
    const hasMore = posts.length > visibleCount;

    return (
        <section className="pb-16 sm:pb-20 flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {visiblePosts.map((post: any) => (
                        <Link
                            key={post._id}
                            href={`/blog/${post.slug.current}`}
                            className="group bg-white border border-[#2E4036]/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                        >
                            {/* Image */}
                            {post.image && (
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={urlFor(post.image).width(600).url()}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-[#2E4036]/5 group-hover:bg-transparent transition-colors" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-4 sm:p-5 flex flex-col flex-grow">
                                {/* Meta row */}
                                <div className="flex items-center gap-3 mb-3">
                                    {post.categories?.[0] && (
                                        <span className="px-2.5 py-1 rounded-full bg-[#F2F0E9] text-[9px] font-black uppercase tracking-widest text-[#2E4036] truncate max-w-[160px]">
                                            {post.categories[0].title}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1 text-[#2E4036]/30 text-[9px] font-bold shrink-0">
                                        <Clock size={10} />
                                        {post.readingTime || 5} MIN
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-base sm:text-lg font-black text-[#2E4036] mb-2 group-hover:text-[#CC5833] transition-colors leading-tight uppercase tracking-tight line-clamp-2">
                                    {post.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-[#2E4036]/50 text-sm leading-relaxed font-medium font-serif line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>

                                {/* Footer */}
                                <div className="mt-auto pt-3 border-t border-[#F2F0E9] flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-[#F2F0E9] border border-[#2E4036]/10 flex items-center justify-center">
                                            <User size={10} className="text-[#2E4036]/40" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#2E4036]/40">{post.author?.name || 'AVA'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#CC5833] font-black text-[9px] uppercase tracking-widest">
                                        Read
                                        <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="flex justify-center mt-10 sm:mt-12">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#2E4036]/10 text-[#2E4036] text-[10px] font-black uppercase tracking-widest hover:border-[#CC5833] hover:text-[#CC5833] transition-all duration-300"
                        >
                            More Briefings
                            <ChevronDown size={14} />
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[#2E4036]/30 font-mono text-sm tracking-widest uppercase">No briefings available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
