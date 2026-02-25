"use client";
import React from "react";
import { Building2, TrendingUp, BarChart3, AlertTriangle, Fingerprint, Activity, ArrowRight } from "lucide-react";

interface PainPointsProps {
    onAuditClick?: () => void;
}

const FRICTION_POINTS = [
    {
        id: "RISK-01",
        icon: <Building2 size={18} />,
        tag: "Institutional Failure",
        title: "Structural Bias",
        desc: "Deploying government policy or 8-figure FMCG investments based on biased feedback loops is a systemic failure, not a strategy.",
        diagnosis: "CONTAMINATED_FEEDBACK_LOOP"
    },
    {
        id: "RISK-02",
        icon: <TrendingUp size={18} />,
        tag: "Data Veracity",
        title: "Authority Erosion",
        desc: "Once stakeholders identify structural flaws in your research designs, the institutional authority of your intelligence unit evaporates.",
        diagnosis: "INTEGRITY_COMPROMISE"
    },
    {
        id: "RISK-03",
        icon: <BarChart3 size={18} />,
        tag: "Blindspots",
        title: "Intelligence Deficit",
        desc: "You aren't just losing capital; you are failing to identify the non-obvious market shifts currently being captured by adversarial competitors.",
        diagnosis: "SYNAPTIC_NOISE_FLUX"
    },
];

export default function PainPoints({ onAuditClick }: PainPointsProps) {
    return (
        <section id="painpoints" className="section-full relative bg-[#F2F0E9] border-y border-[#2E4036]/5">
            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="mb-20">
                    <div className="badge-minimal mb-6 inline-flex items-center gap-2">
                        <AlertTriangle size={12} className="text-[#CC5833]" />
                        <span>The Friction Matrix</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                        <h2 className="text-section-title text-[#2E4036]">
                            Modern Research is <span className="text-[#CC5833]">Compromised.</span>
                        </h2>
                        <div className="max-w-xl">
                            <p className="text-[#2E4036] font-bold text-xl mb-4 leading-tight">94% of failed surveys happen due to lack of Stress Tests. Enterprises lose millions annually to contaminated datasets and flawed instrumentation.</p>
                            <p className="text-[#2E4036]/60 font-sans text-sm leading-relaxed">
                                Fragmented logic, leading language, and cognitive load issues corrupt respondent integrity, resulting in decision-making based on statistical noise rather than market truth.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {FRICTION_POINTS.map((item, i) => (
                        <div key={i}>
                            <div className="card-artifact p-8 bg-white border border-[#2E4036]/5 hover:border-[#CC5833]/30 transition-all group h-full flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-[#2E4036]/5 text-[#2E4036] flex items-center justify-center group-hover:bg-[#CC5833] group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <span className="font-mono text-[10px] text-[#2E4036]/40 uppercase tracking-[0.3em]">{item.id}</span>
                                </div>

                                <span className="font-mono text-[11px] text-[#CC5833] font-bold uppercase tracking-widest mb-2 block">{item.tag}</span>
                                <h3 className="text-2xl font-heading font-black text-[#2E4036] uppercase tracking-tighter mb-4">{item.title}</h3>
                                <p className="text-[#2E4036]/60 text-xs font-sans leading-relaxed mb-12 flex-grow">{item.desc}</p>

                                <div className="pt-6 border-t border-[#2E4036]/5 flex items-center gap-3">
                                    <Activity size={12} className="text-[#CC5833] opacity-40" />
                                    <span className="font-mono text-[11px] text-[#2E4036]/30 uppercase font-bold tracking-widest">Diagnosis: {item.diagnosis}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-12">
                    <button
                        onClick={onAuditClick}
                        className="btn-magnetic bg-[#CC5833] text-white px-12 py-5 shadow-2xl shadow-[#CC5833]/20"
                    >
                        <span>Calculate Risk Exposure</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>

                    <div className="w-full p-10 bg-[#2E4036] rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <Fingerprint size={300} className="absolute -right-20 -bottom-20 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl text-center md:text-left">
                                <h4 className="text-2xl font-heading font-black text-[#F2F0E9] uppercase tracking-tighter mb-2">Zero-Veracity Shield.</h4>
                                <p className="text-[#F2F0E9]/60 text-sm font-sans leading-relaxed">I identify structural flaws before you deploy, securing the integrity of your institutional data against the friction of human cognitive error.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="font-mono text-[11px] text-[#CC5833] font-bold uppercase tracking-widest">System Status</span>
                                    <span className="font-mono text-[11px] text-[#F2F0E9] font-bold uppercase">Active_Calibration</span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="h-3 w-3 rounded-full bg-[#CC5833] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
