"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Target } from "lucide-react";
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
                            The Bureau Commitment
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 font-black uppercase tracking-tight">
                        Tactical Pricing
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">Professional-grade intelligence for elite researchers.</p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Sentinel - FREE */}
                    <Reveal delay={0}>
                        <div className="card-elevated p-8 h-full bg-white border border-slate-100">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Market & Audience Reconnaissance</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">FREE</div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Sentinel Protocol</p>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                                Open-source intelligence (OSINT) scanning to synthesize real-time profiles of target market landscapes. Sentinel constructs the foundational cultural context required for rigorous research.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {["Target Market Recon", "Demographic Synthesis", "Persona Archetypes", "Trend Prediction", "Global Market Coverage"].map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onProtocolOpen}
                                className="w-full block text-center py-3 px-6 border-2 border-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-emerald-200 hover:bg-emerald-50 transition-all mt-auto"
                            >
                                Deploy Sentinel
                            </button>
                        </div>
                    </Reveal>

                    {/* Interpreter - €240 */}
                    <Reveal delay={0.1}>
                        <div className="card-elevated p-8 h-full bg-white border border-slate-100 flex flex-col">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Post-Field Data Narrative Synthesis</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">
                                {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                {currency.tiers.interpreter.price.toLocaleString()}
                            </div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Result Interpreter</p>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                                Post-fieldwork data audit and executive briefing generation. Ingestion of raw survey results to identify non-obvious correlations and deliver boardroom-ready briefings.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {["Field Result Processing", "Narrative Report Synthesis", "Psychological Insights", "Cross-tabulation Analysis", "Boardroom Visuals"].map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                        <CheckCircle2 size={12} className="text-blue-500 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/field-interpreter"
                                className="w-full block text-center py-3 px-6 border-2 border-blue-100 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-blue-200 hover:bg-blue-50 transition-all mt-auto"
                            >
                                Open Interpreter
                            </Link>
                        </div>
                    </Reveal>

                    {/* Lab - €300 */}
                    <Reveal delay={0.2}>
                        <div className="card-featured p-8 h-full relative border border-blue-200 flex flex-col">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm whitespace-nowrap">
                                Adversarial Stress Test
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Behavioral Instrument Stress-Testing</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">
                                {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                {currency.tiers.lab.price.toLocaleString()}
                            </div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">The Laboratory</p>
                            <p className="text-slate-700 text-xs font-medium leading-relaxed mb-8">
                                Rigorous neural auditing of existing survey instruments. Ingest and simulate interaction against targeted synthetic populations to identify structural flaws and drop-off risks.
                            </p>
                            <ul className="space-y-3 mb-8 text-left">
                                {[
                                    "Neural Audit Loop",
                                    "Bias & Ambiguity Detection",
                                    "Cognitive Load Audit",
                                    "Multi-Persona Validation",
                                    "Detailed Flaw Heatmap"
                                ].map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                                        <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/lab"
                                className="block text-center py-3 px-6 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 mt-auto"
                            >
                                Initiate Lab Protocol
                            </Link>
                        </div>
                    </Reveal>
                </div>

                {/* GENESIS & ENTERPRISE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {/* GENESIS SECTION */}
                    <Reveal delay={0.3}>
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all border border-slate-800 h-full flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                    <Sparkles size={12} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">AI-Driven Questionnaire Architecture</span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Genesis</h3>
                                <p className="text-slate-400 text-sm font-medium mb-6">
                                    Advanced survey architecture. AVA generates statistically rigorous questionnaires from scratch, calibrated to specific institutional requirements and cultural nuances.
                                </p>
                                <div className="text-4xl font-black text-white mb-8">
                                    {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                    {currency.tiers.genesis.price.toLocaleString()}
                                    <span className="text-xs text-slate-500 font-bold tracking-widest uppercase ml-2">/ one-shot</span>
                                </div>
                                <button
                                    onClick={onGenesisClick}
                                    className="w-full py-4 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                                >
                                    Unlock Genesis Protocol
                                </button>
                            </div>
                        </div>
                    </Reveal>

                    {/* ENTERPRISE SUBSCRIPTION */}
                    <Reveal delay={0.4}>
                        <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all border border-slate-200 h-full flex flex-col justify-between">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-6">
                                    <Target size={12} className="text-slate-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Global Bureau Membership</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Enterprise</h3>
                                <p className="text-slate-500 text-sm font-medium mb-6">
                                    High-volume tactical access for institutional research teams. Provides a managed allowance of 60,000 Bureau Credits per month for continuous validation.
                                </p>
                                <div className="text-4xl font-black text-slate-900 mb-8">
                                    {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                    {currency.tiers.enterprise.price.toLocaleString()}
                                    <span className="text-xs text-slate-400 font-bold tracking-widest uppercase ml-2">/ month</span>
                                </div>
                                <div className="mb-8">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Compute Overage: €0.01 per Credit</p>
                                </div>
                                <button
                                    onClick={onContactClick}
                                    className="w-full py-4 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    Subscribe to Bureau
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.5} className="text-center mt-12">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        Institutional access required for high-volume deployments. Rates adjusted for regional economic indexes.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
