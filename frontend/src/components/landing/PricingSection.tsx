"use client";
import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface PricingSectionProps {
    currency: any;
    onContactClick: () => void;
}

export default function PricingSection({ currency, onContactClick }: PricingSectionProps) {
    const handleLaunchApp = (appId: string) => {
        window.open(`/os?app=${appId}`, '_blank');
    };

    return (
        <section id="pricing" className="section-full bg-white relative">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="mb-20">
                    <div className="badge-minimal mb-6 inline-flex items-center gap-2">
                        <Sparkles size={12} className="text-[#CC5833]" />
                        <span>The Bureau Commitment</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] mb-4">
                        Scientific Tiers.
                    </h2>
                    <p className="text-body-lg text-[#2E4036]/60 max-w-xl font-sans leading-relaxed">
                        Professional-grade intelligence artifacts for institutional research and high-stakes decision making.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Sentinel - FREE */}
                    <PricingCard
                        title="Sentinel Protocol"
                        price="FREE"
                        badge="Module 01: Recon"
                        desc="Open-source intelligence (OSINT) scanning to synthesize real-time profiles of target market landscapes."
                        features={["Target Market Recon", "Demographic Synthesis", "Persona Archetypes", "Trend Prediction"]}
                        cta="Deploy Sentinel"
                        onAction={() => handleLaunchApp('sentinel')}
                        accent="text-[#2E4036]"
                    />

                    {/* Interpreter */}
                    <PricingCard
                        title="Interpreter"
                        price={`${currency.code === 'MUR' ? 'Rs ' : currency.symbol}${currency.tiers.interpreter.price.toLocaleString()}`}
                        badge="Module 02: Analysis"
                        desc="Post-fieldwork data audit and executive briefing generation for high-density psychographic reporting."
                        features={["Field Result Processing", "Narrative Synthesis", "Psychological Insights", "Boardroom Visuals"]}
                        cta="Open Interpreter"
                        onAction={() => handleLaunchApp('interpreter')}
                        accent="text-[#2E4036]"
                    />

                    {/* Lab - Featured */}
                    <PricingCard
                        title="The Lab"
                        price={`${currency.code === 'MUR' ? 'Rs ' : currency.symbol}${currency.tiers.lab.price.toLocaleString()}`}
                        badge="Module 03: Stress-Test"
                        desc="Rigorous neural auditing of existing instruments using targeted synthetic respondent populations."
                        features={["Neural Audit Loop", "Bias Detection", "Cognitive Load Audit", "Flaw Heatmap"]}
                        cta="Initiate Lab Protocol"
                        onAction={() => handleLaunchApp('lab')}
                        featured
                        accent="text-[#CC5833]"
                    />
                </div>

                {/* Additional Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="relative h-full group">
                        {/* Featured Ribbon/Badge */}
                        <div className="absolute top-0 right-0 sm:-top-3 sm:-right-3 z-20">
                            <div className="bg-[#2E4036] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 sm:px-6 rounded-bl-lg sm:rounded-lg shadow-xl shadow-black/20 flex items-center gap-2">
                                <Sparkles size={12} className="text-[#CC5833]" />
                                Featured Offer
                            </div>
                        </div>

                        <div className="p-10 bg-[#CC5833] text-white flex flex-col justify-between h-full rounded-[2.5rem] shadow-2xl shadow-[#CC5833]/40 relative overflow-hidden border-none transition-transform duration-500 group-hover:scale-[1.02]">
                            <div>
                                <span className="font-mono text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-4 block">Institutional Standard</span>
                                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Genesis</h3>
                                <p className="text-white/90 text-sm font-sans mb-8 leading-relaxed max-w-sm font-medium">
                                    Generative design of statistically rigorous research instruments from scratch, calibrated to institutional requirements.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div className="text-4xl font-black text-white">
                                    {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                    {currency.tiers.genesis.price.toLocaleString()}
                                    <span className="text-xs text-white/60 uppercase tracking-widest ml-3">/ One-Shot</span>
                                </div>
                                <button
                                    onClick={() => handleLaunchApp('genesis')}
                                    className="btn-magnetic bg-white text-[#CC5833] hover:bg-[#2E4036] hover:text-white shadow-xl shadow-black/10"
                                >
                                    Unlock Genesis
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card-artifact p-10 bg-[#F2F0E9] flex flex-col justify-between h-full border-[#2E4036]/10">
                        <div>
                            <span className="font-mono text-[11px] font-bold text-[#2E4036]/40 uppercase tracking-[0.2em] mb-4 block">Managed Bureau Allowance</span>
                            <h3 className="text-4xl font-black text-[#2E4036] uppercase tracking-tighter mb-4">Enterprise</h3>
                            <p className="text-[#2E4036]/60 text-sm font-sans mb-8 leading-relaxed max-w-sm">
                                High-volume tactical access for institutional research teams. Continuous validation and priority support.
                            </p>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="text-4xl font-black text-[#2E4036]">
                                {currency.code === 'MUR' ? 'Rs ' : currency.symbol}
                                {currency.tiers.enterprise.price.toLocaleString()}
                                <span className="text-xs text-[#2E4036]/40 uppercase tracking-widest ml-3">/ Month</span>
                            </div>
                            <button
                                onClick={onContactClick}
                                className="btn-magnetic bg-[#2E4036] text-white"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <p className="text-[#2E4036]/30 font-mono text-[10px] uppercase tracking-widest">
                        Rates adjusted for regional economic indexes. Institutional access required for high-volume deployments.
                    </p>
                </div>
            </div>
        </section>
    );
}

function PricingCard({ title, price, badge, desc, features, cta, onAction, featured, accent }: any) {
    return (
        <div className={`card-artifact p-8 h-full flex flex-col border ${featured ? 'border-[#CC5833]/30 shadow-xl shadow-[#CC5833]/5' : 'border-[#2E4036]/5'} bg-[#F8F7F2]`}>
            <span className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-4 ${accent}`}>{badge}</span>
            <h3 className="text-2xl font-black text-[#2E4036] uppercase tracking-tighter mb-1">{title}</h3>
            <div className="text-3xl font-black text-[#2E4036] mb-4">{price}</div>
            <p className="text-xs text-[#2E4036]/60 font-sans leading-relaxed mb-8">
                {desc}
            </p>
            <div className="h-px bg-[#2E4036]/5 w-full mb-8" />
            <ul className="space-y-4 mb-10 mt-auto">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] uppercase font-bold text-[#2E4036]/80 tracking-tight">
                        <CheckCircle2 size={14} className={featured ? "text-[#CC5833]" : "text-[#2E4036]/20"} />
                        {f}
                    </li>
                ))}
            </ul>
            <button
                onClick={onAction}
                className={`btn-magnetic w-full justify-center ${featured ? 'bg-[#CC5833] text-white shadow-lg shadow-[#CC5833]/20' : 'border-2 border-[#2E4036]/10 text-[#2E4036]'}`}
            >
                {cta}
            </button>
        </div>
    );
}
