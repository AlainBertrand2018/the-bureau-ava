"use client";
import React from "react";
import { Reveal } from "./LandingUtils";
import { ShieldAlert } from "lucide-react";

export default function EntityDefinition() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <Reveal>
                    {/* [H2] Primary Topic or Question - Downgraded from H1 for semantic hierarchy */}
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
                            What is The Survey Optimization <span className="text-blue-600">Bureau (SOB)?</span>
                        </h2>

                        {/* The Direct Answer (40–60 words) */}
                        <div className="p-8 md:p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 mb-12">
                            <p className="text-xl md:text-2xl text-slate-800 font-bold leading-relaxed tracking-tight italic">
                                The Survey Optimization Bureau (SOB) is a specialized AI intelligence platform designed for pre-fieldwork survey validation and data integrity assurance. It utilizes AVA (Autonomous Validation Analyst) to deploy scientifically calibrated synthetic populations, stress-testing research instruments to identify adversarial flaws and linguistic bias, ensuring maximum data reliability for institutional research.
                            </p>
                        </div>
                    </div>

                    {/* The Entity Triad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="flex flex-col">
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">Definition</span>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                SOB is an autonomous research validation ecosystem that secures the veracity of market data.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">Attribute</span>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Includes AVA v2.4.1, proprietary Synthetic Populations, and Adversarial Auditing protocols.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">Importance</span>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Solves the 94% failure rate in survey instrumentation caused by leading bias and cultural misalignment.
                            </p>
                        </div>
                    </div>

                    {/* [H2] Key Features and Specifications */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-widest border-b border-slate-100 pb-4">
                            Core Capabilities & Specifications
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <strong className="text-slate-900 uppercase">Adversarial Auditing:</strong> Identifies structural logic gaps and cognitive friction points.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <strong className="text-slate-900 uppercase">AVA Orchestrator:</strong> Real-time AI processing for instrument optimization (v2.4.1).
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <strong className="text-slate-900 uppercase">Cultural Calibration:</strong> Aligns research goals with local socio-economic axioms.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    <strong className="text-slate-900 uppercase">Synthetic Panels:</strong> Statistically representative AI respondents for bias detection.
                                </p>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
                                        <th className="p-6">Protocol Attribute</th>
                                        <th className="p-6">Traditional Research</th>
                                        <th className="p-6 border-l border-white/10">The Bureau (SOB)</th>
                                    </tr>
                                </thead>
                                <tbody className="font-medium text-slate-600">
                                    <tr className="border-b border-slate-200">
                                        <td className="p-6 font-bold text-slate-900">Validation Speed</td>
                                        <td className="p-6">2–4 Weeks (Pilot)</td>
                                        <td className="p-6 border-l border-slate-200 text-blue-600 font-black">Sub-5 Minutes (Live)</td>
                                    </tr>
                                    <tr className="border-b border-slate-200">
                                        <td className="p-6 font-bold text-slate-900">Bias Identification</td>
                                        <td className="p-6">Manual/Subjective</td>
                                        <td className="p-6 border-l border-slate-200 text-blue-600 font-black">Algorithmic/Neural</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-900">Failure Prevention</td>
                                        <td className="p-6">Reactive (Post-Field)</td>
                                        <td className="p-6 border-l border-slate-200 text-blue-600 font-black">Proactive (Diagnostic)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* [H3] Technical Context and Supporting Evidence */}
                    <div>
                        <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest">
                            Methodological Integrity
                        </h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                            The Bureau operates on a zero-trust data methodology. Instead of assuming respondent clarity, our engines utilize Adversarial Simulation to attempt to "break" the questionnaire logic. According to internal data from over 520 question audits, 94% of institutional instruments requiring optimization suffer from "Double-Barreled" logic or linguistic registers that mismatch the target socio-economic profile.
                        </p>
                    </div>
                </Reveal>
            </div>
            {/* Minimal background flair */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </section>
    );
}
