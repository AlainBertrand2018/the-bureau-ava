"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Clock,
    Calendar,
    User,
    Share2,
    Linkedin,
    Twitter,
    MessageCircle,
    ChevronRight,
    ArrowRight,
    ShieldCheck,
    Lock,
    Star,
    Sparkles,
    Library
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/landing/FAQSection";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";

interface ArticleLayoutProps {
    post: any;
}

const ArticleLayout = ({ post }: ArticleLayoutProps) => {
    const [activeSection, setActiveSection] = useState<string>("");
    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

    // Parse body for TOC
    useEffect(() => {
        if (post?.body) {
            const headings = post.body
                .filter((block: any) => block._type === 'block' && /^h[1-6]$/.test(block.style))
                .map((block: any) => {
                    const text = block.children.map((c: any) => c.text).join("");
                    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                    return { id, text, level: parseInt(block.style.replace('h', '')) };
                });
            setToc(headings);
        }
    }, [post?.body]);

    // Intersection Observer for TOC highlight
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0% -35% 0%" }
        );

        toc.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [toc]);

    const [shareUrls, setShareUrls] = useState({
        linkedin: "",
        twitter: "",
        whatsapp: ""
    });

    // Handle social sharing URLs on client side to avoid hydration mismatch
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.href;
            setShareUrls({
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
                twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm reviewing AVA's latest diagnostic on ${post.title}. The methodology for market research is shifting. What’s your take? ${post.mentionHandle || '@TheBureauAI'} ${post.socialHashtags || '#AdversarialAudit'}`)}&url=${encodeURIComponent(currentUrl)}`,
                whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${currentUrl}`)}`
            });
        }
    }, [post.title, post.mentionHandle, post.socialHashtags]);

    const components = {
        block: {
            h2: ({ children, value }: any) => {
                const id = value.children.map((c: any) => c.text).join("").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                return <h2 id={id} className="text-3xl font-bold text-[#2E4036] mt-16 mb-6 tracking-tight">{children}</h2>;
            },
            h3: ({ children, value }: any) => {
                const id = value.children.map((c: any) => c.text).join("").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                return <h3 id={id} className="text-2xl font-bold text-[#2E4036] mt-12 mb-4 tracking-tight">{children}</h3>;
            },
            normal: ({ children }: any) => <p className="text-lg text-[#2E4036]/80 leading-[1.8] mb-8 font-serif">{children}</p>,
            blockquote: ({ children }: any) => (
                <blockquote className="my-12 p-8 bg-[#F2F0E9] border-l-4 border-[#CC5833] rounded-r-2xl relative overflow-hidden group">
                    <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#CC5833] animate-pulse" />
                        <span className="font-mono text-[10px] font-bold text-[#CC5833] tracking-widest uppercase">Verified protocol node</span>
                    </div>
                    <p className="text-xl font-bold italic text-[#2E4036] relative z-10 leading-relaxed">
                        "{children}"
                    </p>
                </blockquote>
            ),
        },
        list: {
            bullet: ({ children }: any) => <ul className="list-none space-y-4 mb-10 pl-4">{children}</ul>,
            number: ({ children }: any) => <ol className="list-none space-y-4 mb-10 pl-4 counter-reset-item">{children}</ol>,
        },
        listItem: {
            bullet: ({ children }: any) => (
                <li className="flex items-start gap-4">
                    <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#CC5833]" />
                    <span className="text-lg text-[#2E4036]/80 font-serif">{children}</span>
                </li>
            ),
            number: ({ children, index }: any) => (
                <li className="flex items-start gap-4">
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#2E4036] text-[#F2F0E9] text-[10px] font-bold flex items-center justify-center">{(index ?? 0) + 1}</span>
                    <span className="text-lg text-[#2E4036]/80 font-serif">{children}</span>
                </li>
            ),
        },
        types: {
            table: ({ value }: any) => (
                <div className="my-12 overflow-x-auto rounded-2xl border border-[#2E4036]/10 shadow-xl shadow-black/5 bg-white">
                    <table className="w-full border-collapse text-left text-sm">
                        <tbody className="divide-y divide-[#2E4036]/5">
                            {value.rows?.map((row: any, i: number) => (
                                <tr key={i} className={i === 0 ? "bg-[#2E4036]/5" : "hover:bg-[#F2F0E9]/30 transition-colors"}>
                                    {row.cells?.map((cell: any, j: number) => (
                                        <td key={j} className={`p-5 ${i === 0 ? "font-bold text-[#2E4036] uppercase tracking-wider text-[10px]" : "text-[#2E4036]/70 font-serif text-base"}`}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ),
            image: ({ value }: any) => (
                <div className="my-12 relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/5 group">
                    <Image
                        src={urlFor(value).url()}
                        alt="Article illustration"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            ),
        }
    };

    return (
        <main className="min-h-screen bg-[#F2F0E9] flex flex-col pt-52">
            <Navbar />

            {post?._id?.startsWith('drafts.') && (
                <div className="bg-[#CC5833] text-white py-2 px-6 flex items-center justify-center gap-4 fixed top-0 left-0 w-full z-[100] font-bold tracking-widest text-xs">
                    <span className="animate-pulse">●</span> Draft preview mode // Unauthenticated engines blocked
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 w-full">
                {/* Header Section */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#2E4036] tracking-tight mb-4 leading-[1.05] max-w-4xl">
                        {post.title}
                    </h1>
                </header>

                {/* Featured Image */}
                <div className="relative aspect-[21/9] rounded-[1.5rem] overflow-hidden mb-12 group shadow-2xl shadow-black/5">
                    {post.image && (
                        <Image
                            src={urlFor(post.image).url()}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2E4036]/20 to-transparent" />
                </div>

                {/* Metadata Transition Bar */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-16 pb-8 border-b border-[#2E4036]/10">
                    <div className="flex flex-wrap items-center gap-8 text-xs font-medium text-[#2E4036]/60">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#CC5833]" />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft Protocol'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#CC5833]" />
                            {post.readingTime} min read
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-[#CC5833]" />
                            {post.author?.name || "The Bureau"}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#2E4036] text-[#F2F0E9] rounded-full text-xs font-bold">
                            <ShieldCheck size={12} className="text-[#CC5833]" />
                            Veracity {post.veracityScore}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {post.categories?.filter(Boolean).map((cat: any, idx: number) => (
                            <span key={cat?._id || idx} className="px-4 py-1.5 rounded-full bg-white border border-[#2E4036]/5 text-xs font-bold text-[#2E4036]/40 tracking-widest">
                                {cat?.title || "General"}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative items-start mb-20">
                    {/* Sidebar sharing/TOC */}
                    <aside className="lg:col-span-3 space-y-12 py-0 border-r border-[#2E4036]/5 pr-8">
                        <div>
                            <h4 className="text-xs font-bold text-[#CC5833] mb-8 flex items-center gap-2 tracking-[0.2em] uppercase">
                                <ChevronRight size={12} /> Contents
                            </h4>
                            <nav className="space-y-5">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block text-sm font-medium transition-all duration-300 hover:text-[#CC5833] ${activeSection === item.id ? 'text-[#CC5833] font-bold' : 'text-[#2E4036]/60'
                                            } ${item.level > 2 ? 'ml-4 opacity-60 text-xs' : ''}`}
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {post.references && post.references.length > 0 && (
                            <div className="pt-12 border-t border-[#2E4036]/5">
                                <h4 className="text-xs font-bold text-[#CC5833] mb-8 flex items-center gap-2 tracking-[0.2em] uppercase">
                                    <Library size={12} /> References
                                </h4>
                                <div className="space-y-6">
                                    {post.references.map((ref: any, rIdx: number) => (
                                        <div key={rIdx} className="group">
                                            {ref.source && (
                                                <span className="block font-mono text-[9px] text-[#2E4036]/30 uppercase tracking-widest mb-1">
                                                    {ref.source}
                                                </span>
                                            )}
                                            {ref.url ? (
                                                <a
                                                    href={ref.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-sm font-medium text-[#2E4036]/60 hover:text-[#CC5833] transition-all leading-snug"
                                                >
                                                    {ref.title}
                                                </a>
                                            ) : (
                                                <span className="block text-sm font-medium text-[#2E4036]/60 leading-snug">
                                                    {ref.title}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-12 border-t border-[#2E4036]/5">
                            <h4 className="text-xs font-bold text-[#2E4036]/30 mb-8 flex items-center gap-2 tracking-[0.2em] uppercase">
                                <Share2 size={12} /> Distribution
                            </h4>
                            <div className="flex flex-col gap-4">
                                <a href={shareUrls.linkedin} target="_blank" className="flex items-center justify-between group py-2 text-[#2E4036]/60 hover:text-[#2E4036] transition-all">
                                    <span className="text-sm font-medium">LinkedIn</span>
                                    <Linkedin size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a href={shareUrls.twitter} target="_blank" className="flex items-center justify-between group py-2 text-[#2E4036]/60 hover:text-[#2E4036] transition-all">
                                    <span className="text-sm font-medium">X Cluster</span>
                                    <Twitter size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a href={shareUrls.whatsapp} target="_blank" className="flex items-center justify-blank group py-2 text-[#2E4036]/60 hover:text-[#2E4036] transition-all">
                                    <span className="text-sm font-medium">Messaging</span>
                                    <MessageCircle size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="w-full">
                            {/* Ingestion Node - Subtle Sentence Case */}
                            <div className="bg-[#2E4036] p-12 rounded-[2rem] mb-20 relative overflow-hidden group shadow-2xl shadow-[#2E4036]/10">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                    <Sparkles size={160} className="text-[#F2F0E9]" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-2xl text-[#F2F0E9] font-bold leading-[1.6]">
                                        {post.aiSummary || post.excerpt}
                                    </p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="pb-32 border-b border-[#2E4036]/5">
                                <PortableText value={post.body} components={components} />
                            </div>

                            {/* Engagement Layer */}
                            <div className="mt-20 space-y-24">
                                {post.isPremium && (
                                    <div className="bg-white p-12 rounded-[3.5rem] border border-[#2E4036]/10 shadow-xl shadow-black/5">
                                        <div className="flex items-center justify-between mb-12">
                                            <div>
                                                <h4 className="text-2xl font-bold text-[#2E4036] tracking-tight mb-2">Institutional Review</h4>
                                                <p className="text-sm text-[#2E4036]/50">Peer-reviewed commentary for verified researchers.</p>
                                            </div>
                                            <div className="flex gap-1 text-[#CC5833]">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= 4 ? "#CC5833" : "none"} />)}
                                            </div>
                                        </div>

                                        <div className="bg-[#F2F0E9]/50 p-8 rounded-2xl border border-dashed border-[#2E4036]/20 text-center">
                                            <Lock size={16} className="mx-auto mb-4 text-[#2E4036]/20" />
                                            <p className="font-bold text-[#2E4036]/40 tracking-widest text-sm">
                                                Please authenticate to access Peer Reviews
                                            </p>
                                            <button className="mt-6 text-[#CC5833] font-bold tracking-widest text-xs hover:underline">
                                                Researcher Login
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Social CTA */}
                                <div className="text-center py-20 border-t border-[#2E4036]/5">
                                    <h4 className="text-3xl font-bold text-[#2E4036] tracking-tight mb-8">Discuss this logic?</h4>
                                    <div className="flex flex-wrap justify-center gap-6">
                                        <a href={shareUrls.linkedin} target="_blank" className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl border border-[#2E4036]/10 font-bold text-xs tracking-widest hover:border-[#CC5833] transition-all group">
                                            <Linkedin size={16} className="text-[#0077b5]" />
                                            <span>Share to LinkedIn</span>
                                            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                        <button className="flex items-center gap-3 px-8 py-4 bg-[#2E4036] text-white rounded-2xl font-bold text-xs tracking-widest hover:shadow-2xl hover:shadow-[#2E4036]/30 transition-all active:scale-95">
                                            <MessageCircle size={16} />
                                            <span>Share-to-comment</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Footer FAQ Override */}
            <FAQSection
                items={post.customFAQ && post.customFAQ.length > 0 ? post.customFAQ : undefined}
                isFullPage={false}
            />

            {/* Promo Box */}
            <section className="bg-[#2E4036] py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CC5833] rounded-full text-white text-xs font-bold tracking-[0.3em] mb-12">
                        Institutional Deployment Hub
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-[#F2F0E9] tracking-tighter mb-8 leading-[0.9]">
                        Don't guess.<br /><span className="text-[#CC5833]">Audit first.</span>
                    </h2>
                    <p className="text-xl text-[#F2F0E9]/60 max-w-2xl mx-auto mb-16 font-serif">
                        Run your first Market Research instrument stress-test — completely free. <br className="hidden md:block" /> No questionnaire needed to start.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
                        {[
                            { label: "Trial Audit", price: "Free" },
                            { label: "Standard", price: "€280" },
                            { label: "Deep Sim", price: "€420" },
                            { label: "Genesis", price: "€350" }
                        ].map(plan => (
                            <div key={plan.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="text-xs font-bold text-[#F2F0E9]/40 tracking-widest mb-2">{plan.label}</div>
                                <div className="text-2xl font-bold text-[#F2F0E9]">{plan.price}</div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/os"
                        className="btn-magnetic bg-[#F2F0E9] text-[#2E4036] px-16 py-6 inline-flex items-center gap-4 text-sm no-underline group"
                    >
                        <span>Initialize Protocol</span>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>

                    <div className="mt-12 font-mono text-[11px] text-[#F2F0E9]/20 tracking-[0.8em] uppercase">
                        AVA V2.4.1 // Secure audit handshake
                    </div>
                </div>
            </section>

            <Footer dark={true} />
        </main>
    );
};

export default ArticleLayout;
