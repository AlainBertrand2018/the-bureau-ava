"use client";
import React from "react";
import { TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { Reveal } from "./LandingUtils";

interface SurveyMechanicsProps {
    currency: any;
    onShieldClick: () => void;
}

export default function SurveyMechanics({ currency, onShieldClick }: SurveyMechanicsProps) {
    return (
        <section id="mechanics" className="section-full bg-slate-50 relative overflow-hidden border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <Reveal className="text-center mb-16">
                    <div className="badge-blue inline-flex items-center gap-2 mb-6">
                        <TrendingUp size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            The Economics
                        </span>
                    </div>
                    <h2 className="text-section-title text-slate-900 mb-6 font-black uppercase tracking-tight">
                        Research Intelligence Hub
                    </h2>
                    <p className="text-body-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Deep dives into the economics and heuristics of modern research.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Article (Iceberg) */}
                    <div className="lg:col-span-2">
                        <Reveal className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm h-full flex flex-col">
                            <div className="p-8 md:p-12 border-b border-slate-50 pb-6">
                                <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Featured Analysis</span>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">The Iceberg of Research Costs</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">
                                    Most researchers only see the visible cost of design. The real risk lies beneath the surface — in fieldwork, collection, and the catastrophic cost of bad data.
                                </p>
                            </div>

                            <div className="flex-grow p-8 md:p-12 bg-slate-50/30">
                                {/* The Iceberg Concept */}
                                <div className="relative flex flex-col items-center max-w-2xl mx-auto">
                                    {/* TIP */}
                                    <div className="w-[80%] bg-blue-50 border-x border-t border-blue-100 rounded-t-[2rem] p-6 text-center shadow-sm relative z-20">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Surface Level</span>
                                        <h4 className="text-slate-900 font-bold text-sm tracking-tight mb-1">Design Fees</h4>
                                        <span className="text-blue-600 font-black text-xs">{currency.icebergDesign}</span>
                                    </div>

                                    {/* WATERLINE */}
                                    <div className="w-full h-px bg-blue-200 relative z-30">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-0.5 bg-white border border-blue-100 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">
                                            Visible Cost
                                        </div>
                                    </div>

                                    {/* SUBMERGED */}
                                    <div className="w-full bg-gradient-to-b from-blue-50/50 to-white border-x border-b border-blue-100 rounded-b-[2rem] p-8 space-y-4 shadow-inner">
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 border-b border-blue-100/50 pb-2">
                                            <span>Fieldwork & Sample</span>
                                            <span className="text-slate-900">{currency.icebergRecruitment}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 border-b border-blue-100/50 pb-2">
                                            <span>Data Collection</span>
                                            <span className="text-slate-900">{currency.icebergCollection}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 pb-2">
                                            <span>Post-Analysis</span>
                                            <span className="text-slate-900">{currency.icebergAnalysis}</span>
                                        </div>

                                        <div className="pt-8 text-center">
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
                                                <AlertTriangle size={10} />
                                                Danger Zone
                                            </p>
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">Total Risk Exposure</h4>
                                            <p className="text-slate-400 font-black text-xl tracking-tighter mb-8">{currency.riskRange}</p>
                                            <button
                                                onClick={onShieldClick}
                                                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all group"
                                            >
                                                <ShieldCheck size={14} className="text-blue-400 group-hover:text-white transition-colors" />
                                                Deploy Shield
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Sidebar Blog-like Items */}
                    <div className="space-y-6">
                        <Reveal delay={0.1} className="h-[48%]">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 h-full flex flex-col justify-center">
                                <span className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-4 block">Case Study</span>
                                <h4 className="text-lg font-black text-slate-900 mb-3 leading-tight">The Psychology of Survey Fatigue</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                                    How cognitive load impacts response quality across different demographics in East Africa.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Read Article →</span>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.2} className="h-[48%]">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 h-full flex flex-col justify-center">
                                <span className="text-violet-600 text-[9px] font-black uppercase tracking-widest mb-4 block">Methodology</span>
                                <h4 className="text-lg font-black text-slate-900 mb-3 leading-tight">Census-Weighting Protocols</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                                    Using synthetic personas to validate demographic representation before fieldwork.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Read Article →</span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
