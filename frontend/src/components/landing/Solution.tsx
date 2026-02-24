"use client";
import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Target, Zap, ArrowRight, Sparkles, Cpu, Search } from "lucide-react";
import { Reveal } from "./LandingUtils";
import gsap from "gsap";

export default function Solution({ onAuditClick }: { onAuditClick: () => void }) {
    return (
        <section id="solution" className="section-full bg-white relative">
            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <Reveal className="mb-20">
                    <div className="badge-minimal mb-6 inline-flex items-center gap-2">
                        <ShieldCheck size={12} className="text-[#CC5833]" />
                        <span>The Adversarial Protocol</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] mb-8">
                        Secure the scientific outcome.
                        <br />
                        <span className="text-drama text-[#CC5833]">Adversarial auditing at machine speed.</span>
                    </h2>
                    <p className="text-body-lg text-[#2E4036]/60 max-w-2xl leading-relaxed">
                        Bureau protocols utilize agentic AI to deploy synthetic respondent populations against your research instruments. We identify cognitive bias, linguistic friction, and structural flaws before a single human respondent is ever reached.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Card 1: Diagnostic Shuffler */}
                    <FeatureCard
                        index={1}
                        title="Cognitive Bias Auditing"
                        desc="Advanced neural auditing to detect confirmation bias and leading framing."
                        ui={<DiagnosticShuffler />}
                    />

                    {/* Card 2: Telemetry Typewriter */}
                    <FeatureCard
                        index={2}
                        title="Linguistic Integrity"
                        desc="Syntax validation and cultural register calibration across target demographics."
                        ui={<TelemetryTypewriter />}
                    />

                    {/* Card 3: Cursor Protocol Scheduler */}
                    <FeatureCard
                        index={3}
                        title="Scientific Veracity"
                        desc="Deterministic validation scores using 100% human-centric synthetic simulation."
                        ui={<CursorProtocolScheduler />}
                    />
                </div>

                <Reveal delay={0.4} className="flex justify-start">
                    <button
                        onClick={onAuditClick}
                        className="btn-magnetic bg-[#2E4036] text-white shadow-2xl shadow-[#2E4036]/20"
                    >
                        <Zap size={14} className="text-[#CC5833]" />
                        <span>Start Instant Audit</span>
                        <ArrowRight size={14} className="ml-2" />
                    </button>
                </Reveal>
            </div>
        </section>
    );
}

function FeatureCard({ index, title, desc, ui }: { index: number; title: string; desc: string; ui: React.ReactNode }) {
    return (
        <Reveal delay={index * 0.1} className="h-full">
            <div className="card-artifact p-8 h-full flex flex-col border border-[#2E4036]/5 bg-[#F8F7F2]">
                <div className="h-48 mb-8 rounded-2xl overflow-hidden bg-white/50 border border-[#2E4036]/5 relative">
                    {ui}
                </div>
                <div className="mt-auto">
                    <span className="font-mono text-[11px] font-bold text-[#CC5833] uppercase tracking-[0.2em] mb-2 block">Module 0{index}</span>
                    <h3 className="text-xl font-black text-[#2E4036] mb-3 uppercase tracking-tight">{title}</h3>
                    <p className="text-xs font-medium text-[#2E4036]/60 leading-relaxed font-sans">
                        {desc}
                    </p>
                </div>
            </div>
        </Reveal>
    );
}

/* ─── Card 1: Diagnostic Shuffler ─── */
function DiagnosticShuffler() {
    const [cards, setCards] = useState(["Bias Detected", "Leading Frame", "Structural Flaw"]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCards(prev => {
                const next = [...prev];
                const last = next.pop()!;
                next.unshift(last);
                return next;
            });
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {cards.map((text, i) => (
                <div
                    key={text}
                    className="absolute w-[80%] py-3 px-4 rounded-xl border border-[#2E4036]/10 bg-white font-mono text-[10px] text-[#2E4036] shadow-sm flex items-center justify-between"
                    style={{
                        transform: `translateY(${(i - 1) * 45}px) scale(${1 - Math.abs(i - 1) * 0.1})`,
                        opacity: 1 - Math.abs(i - 1) * 0.5,
                        zIndex: 10 - Math.abs(i - 1),
                        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    <span className="font-bold uppercase tracking-widest">{text}</span>
                    <Cpu size={12} className={i === 1 ? 'text-[#CC5833]' : 'text-[#2E4036]/20'} />
                </div>
            ))}
        </div>
    );
}

/* ─── Card 2: Telemetry Typewriter ─── */
function TelemetryTypewriter() {
    const messages = [
        "> AUDITING LINGUISTIC REGISTER...",
        "> 84% CULTURAL RESONANCE DETECTED",
        "> SYNTAX ANOMALY AT Q12",
        "> RECALIBRATING INSTRUMENT...",
        "> CALIBRATION COMPLETE"
    ];
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const currentMessage = messages[index];

        if (isDeleting) {
            timeout = setTimeout(() => {
                setText(prev => prev.slice(0, -1));
                if (text === "") {
                    setIsDeleting(false);
                    setIndex(prev => (prev + 1) % messages.length);
                }
            }, 50);
        } else {
            timeout = setTimeout(() => {
                setText(currentMessage.slice(0, text.length + 1));
                if (text === currentMessage) {
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            }, 100);
        }
        return () => clearTimeout(timeout);
    }, [text, isDeleting, index]);

    return (
        <div className="absolute inset-0 p-6 flex flex-col justify-center bg-[#1A1A1A]">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#CC5833] animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-[#CC5833] uppercase tracking-widest">Live Audit Feed</span>
            </div>
            <p className="font-mono text-[11px] text-[#F2F0E9]/90 leading-relaxed min-h-[40px]">
                {text}
                <span className="inline-block w-1.5 h-3 bg-[#CC5833] ml-1 animate-[blink_1s_infinite]" />
            </p>
        </div>
    );
}

/* ─── Card 3: Cursor Protocol Scheduler ─── */
function CursorProtocolScheduler() {
    const cursorRef = useRef<SVGSVGElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });
            const cells = gridRef.current?.querySelectorAll('.grid-cell')!;

            tl.to(cursorRef.current, { x: 40, y: 30, duration: 1, delay: 0.5 })
                .to(cells[2], { backgroundColor: '#CC5833', opacity: 0.8, duration: 0.2 })
                .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to(cursorRef.current, { x: 100, y: 80, duration: 1, delay: 0.5 })
                .to('.save-btn', { backgroundColor: '#2E4036', color: 'white', duration: 0.2 })
                .to(cursorRef.current, { opacity: 0, duration: 0.5, delay: 0.5 });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center pointer-events-none">
            <div ref={gridRef} className="grid grid-cols-7 gap-1 mb-4 w-full">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="font-mono text-[10px] text-[#2E4036]/40">{day}</span>
                        <div className="grid-cell w-full aspect-square border border-[#2E4036]/10 rounded-sm bg-[#2E4036]/5" />
                    </div>
                ))}
            </div>
            <div className="save-btn w-full py-2 border border-[#2E4036]/20 rounded-lg flex items-center justify-center gap-2">
                <Search size={10} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Execute Protocol</span>
            </div>
            {/* SVG Cursor */}
            <svg
                ref={cursorRef}
                viewBox="0 0 24 24"
                className="absolute top-0 left-0 w-5 h-5 text-[#CC5833] fill-current drop-shadow-md"
                style={{ transform: 'translate(0, 0)' }}
            >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.83-4.83 2.3 5.17c.14.33.52.48.85.34l2.27-1.01c.33-.14.48-.52.34-.85l-2.3-5.17 6.46-.61c.45-.04.66-.59.34-.9L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>
        </div>
    );
}

