"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Target, FileText, Sparkles } from "lucide-react";
import gsap from "gsap";

interface HeroProps {
    onAuditClick: () => void;
    onGenesisClick: () => void;
}

export default function Hero({ onAuditClick, onGenesisClick }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);
    const ctasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });

            tl.from(badgeRef.current, { y: 20, opacity: 0, delay: 0.2 })
                .from(headlineRef.current, { y: 30, opacity: 0 }, "-=0.8")
                .from(sublineRef.current, { y: 20, opacity: 0 }, "-=0.8")
                .from(ctasRef.current, { y: 15, opacity: 0 }, "-=0.8");
        });
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative min-h-screen flex items-center bg-[#F2F0E9]"
        >
            {/* Background Layer: Dot Grid & AVA Presence */}
            <div className="absolute inset-0 hero-dot-grid opacity-30 select-none pointer-events-none" />

            <div className="absolute bottom-0 right-0 hidden lg:block pointer-events-none select-none z-0">
                <div className="relative">
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            background: 'linear-gradient(to right, #F2F0E9 0%, transparent 20%)',
                        }}
                    />
                    <Image
                        src="/images/AVA.webp"
                        alt="AVA"
                        width={600}
                        height={800}
                        className="opacity-90 transition-all duration-1000 object-contain object-bottom"
                        style={{ maxHeight: '95vh' }}
                        priority
                    />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div ref={contentRef} className="max-w-4xl text-left">
                    {/* Badge */}
                    <div ref={badgeRef} className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#2E4036]/20 bg-[#2E4036]/5">
                        <Sparkles size={12} className="text-[#CC5833]" />
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#2E4036]">
                            The Elite Choice.
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 ref={headlineRef} className="mb-8 flex flex-col items-start gap-1">
                        <span className="text-hero text-[#2E4036] uppercase">
                            Executive-Grade
                        </span>
                        <span className="text-hero text-[#2E4036] uppercase">
                            Survey Optimization &
                        </span>
                        <span className="text-drama text-[#CC5833] -ml-1">
                            Synthetic Panel Testing
                        </span>
                    </h1>

                    {/* Subheadline / Copy Anchor */}
                    <p ref={sublineRef} className="text-body-lg text-[#2E4036]/70 max-w-xl mb-12 leading-relaxed">
                        <strong className="font-bold">The Bureau</strong> provides autonomous validation for market research instruments. I am <span className="text-[#CC5833] font-bold">AVA</span>, an AI-powered analyzer that utilizes proprietary <strong className="font-bold">Synthetic Populations</strong> and <strong className="font-bold">Adversarial Auditing</strong> to identify leading bias, linguistic ambiguity, and structural flaws. I secure data integrity for institutional research units and government agencies before fieldwork begins.
                    </p>

                    {/* CTAs */}
                    <div ref={ctasRef} className="flex flex-col sm:flex-row items-start gap-4">
                        <button
                            onClick={onAuditClick}
                            className="btn-magnetic bg-[#2E4036] text-white group shadow-xl shadow-[#2E4036]/10"
                        >
                            <Target size={16} className="text-[#CC5833]" />
                            <span>Catch A Glimpse</span>
                        </button>
                        <button
                            onClick={onGenesisClick}
                            className="btn-magnetic border-2 border-[#2E4036]/20 text-[#2E4036] hover:border-[#2E4036] bg-transparent"
                        >
                            <FileText size={16} />
                            <span>Access Our Tools</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

