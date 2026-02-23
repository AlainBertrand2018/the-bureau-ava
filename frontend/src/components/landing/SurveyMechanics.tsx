"use client";
import React from "react";
import { TrendingUp, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";

interface SurveyMechanicsProps {
    currency: any;
    onProtocolOpen: () => void;
}

export default function SurveyMechanics({ currency, onProtocolOpen }: SurveyMechanicsProps) {
    return (
        <section id="mechanics" className="section-full bg-[#F2F0E9] relative">
            {/* Depth Chart Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#2E4036 1px, transparent 1px), linear-gradient(90deg, #2E4036 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2E4036]/10 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="mb-20">
                    <div className="badge-minimal text-[#2E4036]/60 border-[#2E4036]/20 mb-6 inline-flex items-center gap-2">
                        <TrendingUp size={12} className="text-[#CC5833]" />
                        <span>The Economics of Research</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] mb-4">
                        Intelligence Hub.
                    </h2>
                    <p className="text-body-lg text-[#2E4036]/70 max-w-xl font-sans leading-relaxed">
                        Deep-spectrum analysis of the hidden heuristics and economic risks in modern market research.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* The Iceberg Visualization */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#2E4036]/10 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-[#2E4036]/5 transition-all">
                            <div className="mb-12 border-b border-[#2E4036]/10 pb-10">
                                <span className="font-mono text-[#CC5833] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Case Analysis_01: Cost Exposure</span>
                                <h3 className="text-3xl md:text-5xl font-heading font-black text-[#2E4036] uppercase tracking-tighter mb-6">The Iceberg of Research Costs</h3>
                                <p className="text-[#2E4036]/80 text-sm font-sans leading-relaxed max-w-xl font-medium">
                                    Most researchers focus on the visible design fees. The catastrophic risk lies beneath the surface — in fieldwork, sample collection, and the cost of invalid data.
                                </p>
                            </div>

                            {/* Tactical Iceberg */}
                            <div className="relative pt-12 pb-24">
                                <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#2E4036]/5 border-dashed border-l border-[#2E4036]/20" />

                                {/* Visible Tip */}
                                <div className="relative z-20 flex flex-col items-center mb-10">
                                    <div className="w-48 py-4 bg-[#F2F0E9] border border-[#2E4036]/20 rounded-t-xl text-center shadow-lg">
                                        <span className="font-mono text-[8px] text-[#2E4036]/50 uppercase tracking-widest block mb-1">Surface Protocol</span>
                                        <h4 className="text-[#2E4036] font-black text-xs uppercase tracking-tighter mb-1">Design Fees</h4>
                                        <span className="text-[#CC5833] font-mono text-xs font-bold">{currency.icebergDesign}</span>
                                    </div>
                                    <div className="w-full h-px bg-[#CC5833]/40 mt-[-1px] relative">
                                        <div className="absolute right-0 top-0 translate-y-[-50%] px-4 py-1 bg-white border border-[#CC5833]/40 rounded-full font-mono text-[8px] text-[#CC5833] font-black uppercase tracking-widest shadow-sm">Visible Cost Line</div>
                                    </div>
                                </div>

                                {/* Submerged Mass */}
                                <div className="space-y-4 max-w-md mx-auto">
                                    {[
                                        { label: "Fieldwork & Sample", value: currency.icebergRecruitment },
                                        { label: "Data Collection", value: currency.icebergCollection },
                                        { label: "Post-Analysis Architecture", value: currency.icebergAnalysis }
                                    ].map((row, i) => (
                                        <div key={i} className="flex justify-between items-center bg-[#2E4036]/5 border border-[#2E4036]/5 p-4 rounded-lg group hover:border-[#CC5833]/30 transition-all">
                                            <span className="font-mono text-[10px] text-[#2E4036]/60 uppercase tracking-widest group-hover:text-[#2E4036] transition-colors font-bold">{row.label}</span>
                                            <span className="font-mono text-[#2E4036] text-xs font-black">{row.value}</span>
                                        </div>
                                    ))}

                                    <div className="pt-16 text-center">
                                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-[#CC5833]/10 border border-[#CC5833]/20 rounded-full">
                                            <AlertTriangle size={12} className="text-[#CC5833]" />
                                            <span className="font-mono text-[9px] text-[#CC5833] font-black uppercase tracking-[0.2em]">Danger_Zone: Risk Exposure</span>
                                        </div>
                                        <h4 className="text-4xl md:text-6xl font-black text-[#2E4036] tracking-tighter mb-4">{currency.riskRange}</h4>
                                        <button
                                            onClick={onProtocolOpen}
                                            className="btn-magnetic bg-[#CC5833] text-white px-10 py-4 shadow-2xl shadow-[#CC5833]/20 hover:bg-[#2E4036]"
                                        >
                                            <ShieldCheck size={16} />
                                            <span>Deploy Validation Shield</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Articles */}
                    <div className="flex flex-col gap-8">
                        {[
                            { tag: "Case Study", title: "The Psychology of Survey Fatigue", desc: "How cognitive load impacts response quality across different demographics in East Africa.", color: "text-[#CC5833]" },
                            { tag: "Methodology", title: "Census-Weighting Protocols", desc: "Using synthetic personas to validate demographic representation before fieldwork.", color: "text-[#2E4036]" }
                        ].map((post, i) => (
                            <div key={i} className="h-full flex-grow">
                                <div className="bg-white border border-[#2E4036]/10 p-10 h-full flex flex-col justify-between group hover:bg-[#2E4036] transition-all duration-700 rounded-[2.5rem] shadow-xl shadow-[#2E4036]/5">
                                    <div>
                                        <span className={`font-mono text-[10px] font-black uppercase tracking-widest mb-6 block ${post.color} group-hover:text-white`}>{post.tag}</span>
                                        <h4 className="text-xl md:text-2xl font-heading font-black text-[#2E4036] group-hover:text-white mb-4 uppercase tracking-tighter transition-colors">{post.title}</h4>
                                        <p className="text-[#2E4036]/80 group-hover:text-white/80 text-sm font-sans leading-relaxed transition-colors font-medium">
                                            {post.desc}
                                        </p>
                                    </div>
                                    <div className="pt-8 mt-12 border-t border-[#2E4036]/5 group-hover:border-white/10 flex items-center justify-between transition-colors">
                                        <span className="font-mono text-[9px] text-[#CC5833] group-hover:text-white uppercase font-bold tracking-widest">Read Article</span>
                                        <ChevronRight size={16} className="text-[#CC5833] group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
