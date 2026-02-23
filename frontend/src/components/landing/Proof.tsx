"use client";
import React from "react";
import { ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { AnimatedCounter } from "./LandingUtils";

interface ProofProps {
    pubStats: any;
}

export default function Proof({ pubStats }: ProofProps) {
    return (
        <section id="proof" className="section-full bg-[#F2F0E9] relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(#2E4036 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="text-center mb-24">
                    <div className="badge-minimal mb-8 inline-flex items-center gap-2 border-[#2E4036]/20 text-[#2E4036]/60">
                        <ShieldCheck size={12} className="text-[#CC5833]" />
                        <span>The Verification Ledger</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] mb-8 leading-[0.9]">
                        Validated Intelligence. <br /><span className="text-[#CC5833]">Quantified.</span>
                    </h2>
                    <p className="text-body-lg text-[#2E4036]/60 max-w-xl mx-auto font-sans">
                        AVA provides deterministic outcomes by stress-testing instruments against massive synthetic datasets.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        {
                            target: pubStats?.total_questions_processed || 520,
                            label: "Protocol Elements Processed",
                            suffix: "+",
                            id: "DATA_NODE_01"
                        },
                        {
                            target: pubStats?.average_quality_score || 98,
                            label: "Mean Veracity Index",
                            suffix: "/100",
                            id: "DATA_NODE_02"
                        },
                        {
                            target: pubStats?.total_audits || 12,
                            label: "Institutional Audits",
                            suffix: "+",
                            id: "DATA_NODE_03"
                        },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="card-artifact p-10 bg-white border-[#2E4036]/5 hover:border-[#CC5833]/30 transition-all text-center">
                                <span className="font-mono text-[8px] text-[#2E4036]/30 uppercase tracking-[0.3em] block mb-6">{stat.id}</span>
                                <div className="text-6xl font-heading font-black text-[#2E4036] mb-4 tracking-tighter">
                                    <AnimatedCounter target={stat.target} suffix={stat.suffix} className="font-mono" />
                                </div>
                                <div className="h-px w-12 bg-[#CC5833]/20 mx-auto mb-6" />
                                <p className="text-[#2E4036]/40 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-12">
                    <button
                        onClick={() => window.open('/os', '_blank')}
                        className="btn-magnetic bg-[#2E4036] text-white px-12 py-5"
                    >
                        <span>Join 500+ Managed Audits</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>

                    <div className="w-full pt-12 border-t border-[#2E4036]/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-[#2E4036]" />
                                <span className="font-mono text-[9px] uppercase font-bold tracking-[0.2em] text-[#2E4036]">Verified_Logic_Streams</span>
                            </div>
                            <p className="text-[#2E4036] text-[10px] font-bold uppercase tracking-widest text-center md:text-right">
                                Structural flaws identified and neutralised <span className="text-[#CC5833]">pre-deployment.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
