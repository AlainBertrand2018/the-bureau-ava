"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Target, FileText, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useCurrency } from "@/context/CurrencyContext";

interface HeroProps {
    onAuditClick: () => void;
    onGenesisClick: () => void;
    onTryFreeClick?: () => void;
}

export default function Hero({ onAuditClick, onGenesisClick, onTryFreeClick }: HeroProps) {
    const { currency } = useCurrency();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);
    const ctasRef = useRef<HTMLDivElement>(null);
    const avaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.4 } });

            // 1. AVA Presence enters first
            tl.fromTo(avaRef.current, 
                { x: 40, opacity: 0, scale: 0.98 },
                { x: 0, opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" }
            )
                // 2. Badge & Headline follow with a small overlap
                .fromTo(badgeRef.current, 
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.4 }, 
                    "-=1.2"
                )
                .fromTo(headlineRef.current?.children || [], 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.15, duration: 1 },
                    "-=1.0"
                )
                // 3. Subheadline and CTAs
                .fromTo(sublineRef.current, 
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.4 },
                    "-=0.8"
                )
                .fromTo(ctasRef.current, 
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=0.8"
                );
        });
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative min-h-[75vh] sm:min-h-screen flex items-center bg-[#F2F0E9] pb-12 sm:pb-0 overflow-hidden"
        >
            {/* Background Layer: Dot Grid & AVA Presence */}
            <div className="absolute inset-0 hero-dot-grid opacity-30 select-none pointer-events-none" />

            <div
                ref={avaRef}
                className="absolute bottom-0 right-0 hidden lg:block pointer-events-none select-none z-0 opacity-0"
            >
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
                        className="opacity-90 object-contain object-bottom"
                        style={{ maxHeight: '95vh' }}
                        priority
                    />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div ref={contentRef} className="max-w-4xl text-left">
                    {/* Badge */}
                    <div ref={badgeRef} className="inline-flex items-center gap-2 mb-12 px-4 py-1.5 rounded-full border border-[#2E4036]/20 bg-[#2E4036]/5 opacity-0">
                        <Sparkles size={12} className="text-[#CC5833]" />
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2E4036]">
                            The Elite Choice.
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 ref={headlineRef} className="mb-14 flex flex-col items-start gap-3">
                        <span className="text-hero text-[#2E4036] uppercase font-black">
                            Your Surveys...
                        </span>
                        <span className="text-hero text-[#2E4036] uppercase font-black">
                            Created, Tested &amp; Analyzed.
                        </span>
                        <span className="text-drama text-[#CC5833] -ml-1 opacity-0 !text-[clamp(1.6rem,4vw,2.8rem)] tracking-tight font-bold">
                            Before A Single Respondent Is Reached.
                        </span>
                    </h1>

                    {/* Subheadline / Copy Anchor */}
                    <p ref={sublineRef} className="text-body-lg text-[#2E4036]/70 max-w-3xl mb-12 sm:mb-16 leading-relaxed opacity-0 font-medium">
                        Welcome to The Bureau. I am <span className="text-[#CC5833] font-black">AVA</span>, your Autonomous Validation Analyst. I oversee a skillful team of AI agents that collectively validate market research instruments. We utilize proprietary <strong className="font-black">Synthetic Populations</strong> and <strong className="font-black">Adversarial Auditing</strong> to identify and resolve leading bias, linguistic ambiguity, and structural flaws. <strong>And what&apos;s more... We can architect your professional survey questionnaire in minutes.</strong> <button onClick={onTryFreeClick} className="text-[#CC5833] font-black hover:underline transition-all cursor-pointer">Try us for free.</button>
                    </p>

                    {/* CTAs */}
                    <div ref={ctasRef} className="flex flex-col sm:flex-row items-start gap-4 opacity-0">
                        <button
                            onClick={onAuditClick}
                            className="btn-magnetic bg-[#2E4036] text-white group shadow-xl shadow-[#2E4036]/10 flex items-center gap-4 py-3"
                        >
                            <Target size={20} className="text-[#CC5833]" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[13px] font-black uppercase tracking-wider mb-0.5">START FREE MARKET RECON</span>
                                <span className="text-[9px] font-bold text-[#CC5833] uppercase tracking-widest opacity-90">Up to 50,000 Credits Free</span>
                            </div>
                        </button>
                        <button
                            onClick={onGenesisClick}
                            className="btn-magnetic border-2 border-[#2E4036]/20 text-[#2E4036] hover:border-[#2E4036] bg-transparent flex items-center gap-4 py-3"
                        >
                            <FileText size={20} />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[13px] font-black uppercase tracking-wider mb-0.5">Create your 20-item Survey</span>
                                <span className="text-[9px] font-bold text-[#2E4036]/60 uppercase tracking-widest">For Less than {currency.code === 'MUR' ? 'Rs 5,000' : `${currency.symbol}${Math.ceil(5000 * (currency.tiers.genesis.price / 3450))}`}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

