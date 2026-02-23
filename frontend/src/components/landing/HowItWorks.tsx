"use client";
import React, { useEffect, useRef } from "react";
import { FileText, ShieldCheck, CheckCircle2, Clock, Mouse, ChevronDown, ArrowRight } from "lucide-react";
import { Reveal } from "./LandingUtils";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const statuses = [
        { num: "1", name: "Staging" },
        { num: "2", name: "Design & Stress Tests" },
        { num: "3", name: "Delivery & Deployment" }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Process Map Reveal Loop
            const tl = gsap.timeline({ repeat: -1 });

            // Initial state: hidden
            gsap.set(".step-node, .step-arrow", { opacity: 0, scale: 0.8 });
            gsap.set(".step-arrow", { scaleX: 0, transformOrigin: "left center" });

            tl.to(".step-node:nth-child(1)", { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" })
                .to(".step-arrow:nth-child(2)", { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.2")
                .to(".step-node:nth-child(3)", { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }, "-=0.1")
                .to(".step-arrow:nth-child(4)", { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.2")
                .to(".step-node:nth-child(5)", { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }, "-=0.1")
                .to({}, { duration: 2.5 }) // Balanced 2.5s hold for deep reading
                .to(".step-node, .step-arrow", { opacity: 0, y: -20, duration: 0.8, stagger: 0.1, ease: "power3.in" });

            // 2. Process Cards Blur/Opacity Logic
            const cards = gsap.utils.toArray(".protocol-card") as HTMLElement[];
            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.3,
                    filter: "blur(20px)",
                    scrollTrigger: {
                        trigger: cards[i + 1],
                        start: "top center+=100",
                        end: "top top",
                        scrub: true,
                    }
                });
            });

            // 3. Exit Animation for the Map & Indicator (linked to first card)
            gsap.to(".status-timeline-wrap, .scroll-indicator", {
                opacity: 0,
                y: -100,
                scrollTrigger: {
                    trigger: ".protocol-card:nth-child(1)",
                    start: "top center",
                    end: "top top",
                    scrub: true,
                }
            });

            // Fade out the sticky headline as we approach the end
            gsap.to(".sticky-headline", {
                opacity: 0,
                y: -50,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "bottom bottom",
                    end: "bottom+=200 bottom",
                    scrub: true,
                }
            });
        });
        return () => ctx.revert();
    }, []);

    const steps = [
        {
            step: "01",
            title: "Define Strategy",
            desc: "Set your research objectives and target audience demographics.",
            icon: <FileText size={24} />,
            bg: "bg-[#F2F0E9]",
            artifact: <RotatingMotif />,
        },
        {
            step: "02",
            title: "Execute Audit",
            desc: "Our behavioral engines stress-test every question against your specific personas.",
            icon: <ShieldCheck size={24} />,
            bg: "bg-[#ECEAE3]",
            artifact: <ScanningLaser />,
        },
        {
            step: "03",
            title: "Deploy Verified",
            desc: "Receive a deployable field instrument that is guaranteed to be bias-free.",
            icon: <CheckCircle2 size={24} />,
            bg: "bg-[#E6E4DD]",
            artifact: <PulsingWaveform />,
        },
    ];

    return (
        <section ref={sectionRef} id="how-it-works" className="relative bg-[#F2F0E9]">
            {/* 100vh Intro Layer */}
            <div className="sticky-headline sticky top-0 h-screen flex flex-col pointer-events-none z-20">
                <div className="max-w-7xl mx-auto px-6 w-full pt-32">
                    <div className="mb-4">
                        <div className="badge-minimal text-[#2E4036]/60 border-[#2E4036]/10 mb-4 inline-flex items-center gap-2">
                            <Clock size={12} className="text-[#CC5833]" />
                            <span>The Process</span>
                        </div>
                        <h2 className="text-section-title text-[#2E4036]">
                            Three steps. Under 5 minutes.
                        </h2>
                    </div>
                </div>

                {/* Central Kinetic Process Map */}
                <div className="flex-grow flex items-center justify-center status-timeline-wrap">
                    <div className="flex items-start justify-center gap-4 md:gap-8 max-w-5xl w-full px-6">
                        {statuses.map((s, i) => (
                            <React.Fragment key={i}>
                                {/* The Node */}
                                <div className="step-node flex flex-col items-center">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-[#2E4036] flex items-center justify-center mb-6 bg-[#F2F0E9] shadow-xl shadow-[#2E4036]/5">
                                        <span className="text-2xl md:text-4xl font-heading font-black text-[#2E4036]">{s.num}</span>
                                    </div>
                                    <h4 className="text-[10px] md:text-xs font-heading font-black text-[#2E4036] uppercase tracking-tighter text-center whitespace-nowrap">
                                        {s.name}
                                    </h4>
                                </div>

                                {/* The Arrow (Vertically Centered with Circle) */}
                                {i < statuses.length - 1 && (
                                    <div className="step-arrow flex-grow max-w-[100px] h-16 md:h-24 flex items-center">
                                        <div className="h-[2px] w-full bg-[#CC5833] relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#CC5833]" />
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div className="pb-12 flex flex-col items-center gap-2 scroll-indicator">
                    <div className="flex flex-col items-center">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[#2E4036]/40"
                        >
                            <Mouse size={20} />
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[#CC5833]"
                        >
                            <ChevronDown size={16} />
                        </motion.div>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#2E4036]/40">Explore Protocol</span>
                </div>
            </div>

            <div ref={containerRef} className="relative z-10">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        className={`protocol-card sticky top-0 h-screen w-full flex items-center justify-center p-6 ${s.bg}`}
                    >
                        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-[20vh]">
                            <div className="relative z-10 order-2 lg:order-1">
                                <span className="font-mono text-[14px] font-bold text-[#CC5833] uppercase tracking-[0.4em] mb-4 block">Archive Step {s.step}</span>
                                <h3 className="text-4xl md:text-6xl font-black text-[#2E4036] mb-6 uppercase tracking-tight">
                                    {s.title}
                                </h3>
                                <p className="text-xl text-[#2E4036]/60 leading-relaxed font-sans max-w-md">
                                    {s.desc}
                                </p>
                            </div>
                            <div className="relative aspect-square flex items-center justify-center order-1 lg:order-2">
                                {s.artifact}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Final CTA Card */}
                <div className="protocol-card sticky top-0 h-screen w-full flex items-center justify-center p-6 bg-[#2E4036]">
                    <div className="max-w-4xl text-center">
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tight">
                            Protocol Sequence <span className="text-[#CC5833]">Complete.</span>
                        </h3>
                        <p className="text-xl text-white/60 mb-12 font-sans max-w-xl mx-auto">
                            The ecosystem is calibrated. Deploy your research with absolute certainty.
                        </p>
                        <button
                            onClick={() => window.open('/os', '_blank')}
                            className="btn-magnetic bg-[#CC5833] text-white px-12 py-5 shadow-2xl shadow-black/20"
                        >
                            <span>Start Your Sequence</span>
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Card Artifact 1: Rotating Motif ─── */
function RotatingMotif() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#2E4036] opacity-20 animate-[spin_30s_linear_infinite]">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
                    <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border border-[#CC5833]/20 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}

/* ─── Card Artifact 2: Scanning Laser ─── */
function ScanningLaser() {
    return (
        <div className="w-full h-full flex items-center justify-center p-12">
            <div className="w-full max-w-md aspect-video border border-[#2E4036]/10 rounded-2xl relative overflow-hidden bg-white/40 shadow-inner">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-1 p-6">
                    {Array.from({ length: 96 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-[#2E4036]/5 rounded-sm" />
                    ))}
                </div>
                {/* The Scanning Bar */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#CC5833]/10 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#CC5833] shadow-[0_0_15px_#CC5833] animate-[scan_3s_ease-in-out_infinite]" />

                <div className="absolute bottom-4 right-4 font-mono text-[8px] text-[#2E4036]/40 uppercase tracking-widest">
                    Pattern_Recognition_Active
                </div>
            </div>
        </div>
    );
}

/* ─── Card Artifact 3: Pulsing Waveform ─── */
function PulsingWaveform() {
    return (
        <div className="w-full h-full flex items-center justify-center p-12">
            <div className="w-full max-w-md aspect-video bg-[#2E4036]/5 rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#2E4036]/10">
                <svg viewBox="0 0 200 60" className="w-[80%] text-[#CC5833] overflow-visible">
                    {/* Ghost Path */}
                    <path
                        d="M0,30 L40,30 L50,10 L60,50 L70,30 L110,30 L120,45 L130,15 L140,30 L200,30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="opacity-20"
                    />
                    {/* Animating Path */}
                    <path
                        d="M0,30 L40,30 L50,10 L60,50 L70,30 L110,30 L120,45 L130,15 L140,30 L200,30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="400"
                        strokeDashoffset="400"
                        style={{ strokeDashoffset: 400 }}
                        className="animate-[draw_3s_ease-in-out_infinite] drop-shadow-[0_0_5px_rgba(204,88,51,0.5)]"
                    />
                </svg>

                <div className="absolute top-4 left-4 font-mono text-[8px] text-[#2E4036]/40 uppercase tracking-widest">
                    Signal_Veracity_Stable
                </div>
            </div>
        </div>
    );
}
