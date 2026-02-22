import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/constants/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, Calendar, User, Tag, Sparkles } from "lucide-react";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Bureau Insights`,
        description: post.excerpt,
    };
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "author": {
            "@type": "Organization",
            "name": post.author
        },
        "datePublished": post.date,
        "publisher": {
            "@type": "Organization",
            "name": "The Survey Optimization Bureau",
            "logo": {
                "@type": "ImageObject",
                "url": "https://the-bureau-ava.vercel.app/images/AVA.webp"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://the-bureau-ava.vercel.app/blog/${post.slug}`
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Article Header */}
            <article className="pt-32 pb-20 flex-grow">
                <div className="max-w-4xl mx-auto px-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 mb-12 hover:gap-3 transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to Insights
                    </Link>

                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-blue-500" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={12} className="text-blue-500" />
                                {post.readTime}
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={12} className="text-blue-500" />
                                {post.author}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-tight uppercase">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Experimental GEO Lede component / Abstract */}
                    <div className="p-8 md:p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 mb-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Sparkles size={80} className="text-blue-600" />
                        </div>
                        <p className="text-xl text-slate-800 leading-relaxed font-bold italic relative z-10">
                            {post.excerpt}
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="prose prose-slate prose-lg max-w-none 
                        prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                        prose-strong:text-slate-900 prose-strong:font-black
                        prose-li:text-slate-600 prose-li:font-medium
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:font-bold prose-blockquote:italic
                    ">
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i}>{line}</p>;
                        })}
                    </div>

                    {/* Footer / CTA Hook */}
                    <footer className="mt-20 pt-16 border-t border-slate-100 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Ready to Secure Your Outcome?</h3>
                            <p className="text-slate-500 mb-10 font-medium">Deploy AVA's adversarial auditing on your own research instruments today.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/lab"
                                    className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                >
                                    Initiate Lab Protocol
                                </Link>
                                <Link
                                    href="/genesis"
                                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                                >
                                    Build from Scratch
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </article>

            <Footer dark={false} />
        </main>
    );
}
