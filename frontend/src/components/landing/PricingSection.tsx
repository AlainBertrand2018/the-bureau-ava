"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface PricingSectionProps {
    currency: any;
    onProtocolOpen: () => void;
    onContactClick: () => void;
    onGenesisClick: () => void;
}

export default function PricingSection({ currency, onProtocolOpen, onContactClick, onGenesisClick }: PricingSectionProps) {
    return (
        <section id="pricing" className="section-full section-tinted relative">
            <div className="max-w-5xl mx-auto px-6 w-full">
                <Reveal className="text-center mb-16">
                    <div className="badge-blue inline-flex items-center gap-2 mb-6">
                        <Sparkles size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            The Commitment
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 font-black uppercase tracking-tight">
                        Commitment Levels
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">Start free. Scale when ready.</p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tier 1 */}
                    <Reveal delay={0}>
                        <div className="card-elevated p-8 h-full bg-white">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Tier 1</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">{currency.symbol}{currency.tiers.tier1.price}</div>
                            <p className="text-xs text-slate-400 font-medium mb-6">Trial Audit</p>
                            <ul className="space-y-3 mb-8">
                                {["1 survey audit", "10 diagnostic personas", "3 questions max", "Structural flags"].map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onProtocolOpen}
                                className="w-full block text-center py-3 px-6 border-2 border-slate-200 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all"
                            >
                                Try Free
                            </button>
                        </div>
                    </Reveal>

                    {/* Tier 2 */}
                    <Reveal delay={0.1}>
                        <div className="card-featured p-8 h-full relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                                Most Popular
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Tier 2</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">
                                {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                {currency.tiers.tier2.price.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-400 font-medium mb-6">Standard Audit</p>
                            <ul className="space-y-3 mb-8">
                                {["Up to 50 personas", "Up to 20 questions", "Full diagnostic report", "All bias & flaw flags", "AI rewrite suggestions", "PDF export"].map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                        <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/mission-control?tier=tier2"
                                className="block text-center py-3 px-6 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    </Reveal>

                    {/* Tier 3 */}
                    <Reveal delay={0.2}>
                        <div className="card-elevated p-8 h-full bg-white">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-3">Tier 3</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">
                                {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                {currency.tiers.tier3.price.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-400 font-medium mb-6">Deep Simulation</p>
                            <ul className="space-y-3 mb-8">
                                {["Up to 200 personas", "Up to 50 questions", "Deep diagnostic analysis", "Demographic cross-tabs", "Priority recommendations"].map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <CheckCircle2 size={14} className="text-violet-500 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/mission-control?tier=tier3"
                                className="block text-center py-3 px-6 bg-violet-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all shadow-sm shadow-violet-600/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.3} className="text-center mt-8 mb-12">
                    <p className="text-slate-400 text-xs font-bold">
                        Enterprise? Custom datasets + API + SLA →{" "}
                        <button onClick={onContactClick} className="text-blue-600 hover:underline">
                            Contact us
                        </button>
                    </p>
                    <p className="text-slate-400 text-[10px] font-bold mt-2 opacity-60">
                        (Enterprise plans do not include Genesis module access)
                    </p>
                </Reveal>

                {/* GENESIS ADD-ON */}
                <Reveal delay={0.4} className="mt-8">
                    <div className="max-w-3xl mx-auto bg-slate-900 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all border border-slate-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                                    <Sparkles size={12} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Creation Module</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Build your Questionnaire</h3>
                                <p className="text-slate-400 text-sm font-medium max-w-md">
                                    Don't have questions yet? Let our AI Architect build a stress-tested 20-item instrument for you.
                                </p>
                                <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-2">The heavylifting is on us.</p>
                            </div>

                            <div className="flex flex-col items-center gap-3 shrink-0">
                                <div className="text-4xl font-black text-white">
                                    {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                    {currency.tiers.genesis.price.toLocaleString()}
                                </div>
                                <button
                                    onClick={onGenesisClick}
                                    className="px-8 py-3 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                                >
                                    Unlock Genesis
                                </button>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

