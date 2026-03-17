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

                    {/* Card 3: Scientific Principles Validator */}
                    <FeatureCard
                        index={3}
                        title="Scientific Veracity"
                        desc="Deterministic validation scores using 100% human-centric synthetic simulation across Tourangeau, Krosnick and Hofstede frameworks."
                        ui={<ScientificPrinciplesValidator />}
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

/* ─── Card 3: Scientific Principles Validator ─── */
function ScientificPrinciplesValidator() {
    const [cycle, setCycle] = useState(0);
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(true);
    const [failedIndex, setFailedIndex] = useState(-1);
    const [validationId, setValidationId] = useState("");

    useEffect(() => {
        setValidationId(Math.floor(1000 + Math.random() * 9000).toString());
    }, []);

    const principles = [
        { name: "Tourangeau", desc: "Cognitive Integrity" },
        { name: "Krosnick", desc: "Response Stability" },
        { name: "Hofstede", desc: "Cultural Context" }
    ];

    useEffect(() => {
        // Start of each cycle
        if (step === 0 && progress === 0) {
            const success = Math.random() > 0.4;
            setIsSuccess(success);
            setFailedIndex(success ? -1 : Math.floor(Math.random() * 3));
            setValidationId(Math.floor(1000 + Math.random() * 9000).toString());
        }

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    if (step < principles.length - 1) {
                        setStep(s => s + 1);
                        return 0;
                    } else {
                        // Finished all principles
                        setStep(principles.length);
                        clearInterval(interval);
                        
                        // Restart cycle after delay
                        setTimeout(() => {
                            setStep(0);
                            setProgress(0);
                            setCycle(c => c + 1);
                        }, 4000);
                        return 100;
                    }
                }
                return p + 4;
            });
        }, 40);

        return () => clearInterval(interval);
    }, [step, cycle, principles.length]);

    const getScore = (idx: number) => {
        if (idx === failedIndex) return (72 + Math.random() * 5).toFixed(1);
        return (95 + Math.random() * 3.7).toFixed(1);
    };

    const isFinal = step === principles.length;

    return (
        <div className="absolute inset-0 p-5 flex flex-col justify-center bg-[#FDFDFB]">
            <div className="space-y-2.5">
                {principles.map((p, i) => {
                    const isActive = step === i;
                    const isDone = step > i;
                    const score = getScore(i);
                    const isFailure = i === failedIndex && (isDone || isFinal);

                    return (
                        <div 
                            key={p.name} 
                            className={`flex flex-col gap-1 transition-all duration-500 ${!isActive && !isDone && !isFinal ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}
                        >
                            <div className="flex justify-between items-end">
                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#2E4036]">
                                    {p.name} <span className="text-[#CC5833]/30 ml-1">Protocol</span>
                                </span>
                                {isDone || isFinal ? (
                                    <span className={`font-mono text-[9px] font-bold ${isFailure ? 'text-red-500' : 'text-[#CC5833]'}`}>
                                        {score}%
                                    </span>
                                ) : isActive ? (
                                    <span className="font-mono text-[8px] font-bold text-[#2E4036]/40 animate-pulse uppercase tracking-tighter">Scanning...</span>
                                ) : null}
                            </div>
                            <div className="h-1 bg-[#2E4036]/5 rounded-full overflow-hidden relative">
                                {isActive && (
                                    <div 
                                        className="absolute inset-0 bg-[#CC5833]"
                                        style={{ width: `${progress}%` }}
                                    />
                                )}
                                {(isDone || isFinal) && (
                                    <div className={`absolute inset-0 ${isFailure ? 'bg-red-500/30' : 'bg-[#CC5833]/20'}`} />
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Dynamic Verdict Node */}
                <div className={`pt-4 border-t border-[#2E4036]/10 mt-1 transition-all duration-700 ${isFinal ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                    <div className={`flex flex-col gap-2 p-2.5 rounded-lg border transition-colors duration-500 ${
                        isSuccess 
                        ? 'bg-[#2E4036]/5 border-[#2E4036]/10' 
                        : 'bg-amber-500/5 border-amber-500/20'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSuccess ? 'bg-[#2E4036]' : 'bg-amber-500'}`} />
                                <span className={`font-mono text-[8px] font-black uppercase tracking-[0.1em] ${isSuccess ? 'text-[#2E4036]' : 'text-amber-600'}`}>
                                    {isSuccess ? 'Scientific Validation' : 'Conflict Detected'}
                                </span>
                            </div>
                            <span className="font-mono text-[9px] font-bold text-[#2E4036]/60">#{validationId}</span>
                        </div>
                        
                        <p className={`font-mono text-[9px] font-bold leading-tight ${isSuccess ? 'text-[#2E4036]/70' : 'text-amber-800'}`}>
                            {isSuccess 
                                ? "» RESPONSE FULLY VALIDATED. DEPLOYMENT READY." 
                                : "» FRICTION AT Q4. REWRITING FOR CULTURAL PARITY."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

