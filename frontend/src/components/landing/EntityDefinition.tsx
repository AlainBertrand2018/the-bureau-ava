"use client";
import React from "react";
import { ShieldAlert, BookOpen, Activity, Cpu, ArrowRight } from "lucide-react";

export default function EntityDefinition() {
    return (
        <section id="whatisthebureau" className="section-full bg-[#F2F0E9] relative" itemScope itemType="https://schema.org/AboutPage">
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#2E4036 1px, transparent 1px), linear-gradient(90deg, #2E4036 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }} />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col justify-center h-full" itemScope itemType="https://schema.org/Organization">
                {/* [H2] Institutional Title */}
                <div className="mb-8 sm:mb-12">
                    <div className="badge-minimal mb-6 inline-flex items-center gap-2 border-[#2E4036]/20 text-[#2E4036]/60">
                        <BookOpen size={12} className="text-[#CC5833]" />
                        <span>Registry_Protocol_01</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] mb-8 uppercase tracking-tighter leading-[0.9]">
                        What is <span className="text-[#CC5833]" itemProp="name">The Bureau?</span>
                    </h2>

                    {/* The Direct Answer (Institutional Narrative) */}
                    <div className="p-5 sm:p-8 md:p-10 bg-white border border-[#2E4036]/5 rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-[#2E4036]/5 mb-8 sm:mb-12 relative overflow-hidden" itemProp="description">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Activity size={60} className="text-[#2E4036]" />
                        </div>
                        <p className="text-base sm:text-lg md:text-2xl text-[#2E4036] font-heading font-black leading-[1.3] tracking-tight">
                            The Bureau is a specialized AI intelligence platform designed for pre-fieldwork survey validation and data integrity assurance. It utilizes AVA to deploy scientifically calibrated synthetic populations, stress-testing research instruments to identify adversarial flaws and linguistic bias.
                        </p>
                    </div>
                </div>

                {/* The Entity Triad */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 border-y border-[#2E4036]/10 py-8 sm:py-10">
                    <div className="flex flex-col">
                        <span className="font-mono text-[#CC5833] text-[10px] font-black uppercase tracking-widest mb-3">Definition</span>
                        <p className="text-sm text-[#2E4036]/85 font-sans font-medium leading-relaxed" itemProp="abstract">
                            The Bureau is an autonomous research validation ecosystem that secures the veracity of market data.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono text-[#CC5833] text-[10px] font-black uppercase tracking-widest mb-3">Attribute</span>
                        <p className="text-sm text-[#2E4036]/85 font-sans font-medium leading-relaxed">
                            Includes AVA v2.4.1, proprietary Synthetic Populations, and Adversarial Auditing protocols.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono text-[#CC5833] text-[10px] font-black uppercase tracking-widest mb-3">Importance</span>
                        <p className="text-sm text-[#2E4036]/85 font-sans font-medium leading-relaxed" itemProp="potentialAction" itemScope itemType="https://schema.org/SolveAction">
                            Solves the 94% failure rate in survey instrumentation caused by leading bias and cultural misalignment.
                        </p>
                    </div>
                </div>

                {/* [H2] Key Features and Specifications */}
                <div className="mb-16">
                    <h2 className="text-xl font-black text-[#2E4036] mb-8 uppercase tracking-widest flex items-center gap-3">
                        <Cpu size={20} className="text-[#CC5833]" />
                        Core Capabilities
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                        {[
                            { title: "Adversarial Auditing", desc: "Identifies structural logic gaps and cognitive friction points." },
                            { title: "AVA Orchestrator", desc: "Real-time AI processing for instrument optimization (v2.4.1)." },
                            { title: "Cultural Calibration", desc: "Aligns research goals with local socio-economic axioms." },
                            { title: "Synthetic Panels", desc: "Statistically representative AI respondents for bias detection." },
                        ].map((feat, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#CC5833] mt-2 shrink-0 transition-transform group-hover:scale-150" />
                                <div>
                                    <strong className="text-[#2E4036] uppercase font-bold text-[10px] tracking-widest block mb-1">{feat.title}</strong>
                                    <p className="text-xs text-[#2E4036]/70 font-medium leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-[2rem] border border-[#2E4036]/10 bg-white shadow-2xl shadow-[#2E4036]/5">
                        <table className="w-full text-left text-xs min-w-[500px]">
                            <thead>
                                <tr className="bg-[#2E4036] text-[#F2F0E9] font-mono uppercase tracking-[0.2em] text-[10px]">
                                    <th className="p-6">Protocol Attribute</th>
                                    <th className="p-6">Traditional Research</th>
                                    <th className="p-6 bg-[#CC5833]">The Bureau</th>
                                </tr>
                            </thead>
                            <tbody className="font-heading text-[#2E4036]/80 font-bold">
                                <tr className="border-b border-[#2E4036]/5">
                                    <td className="p-6 text-[#2E4036] uppercase tracking-tighter">Validation Speed</td>
                                    <td className="p-6 font-medium">2–4 Weeks (Pilot)</td>
                                    <td className="p-6 text-[#CC5833] font-black">Sub-5 Minutes (Live)</td>
                                </tr>
                                <tr className="border-b border-[#2E4036]/5">
                                    <td className="p-6 text-[#2E4036] uppercase tracking-tighter">Bias Identification</td>
                                    <td className="p-6 font-medium">Manual/Subjective</td>
                                    <td className="p-6 text-[#CC5833] font-black">Algorithmic/Neural</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-[#2E4036] uppercase tracking-tighter">Failure Prevention</td>
                                    <td className="p-6 font-medium">Reactive (Post-Field)</td>
                                    <td className="p-6 text-[#CC5833] font-black">Proactive (Diagnostic)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* [H3] Methodological Integrity */}
                <div className="pt-12 border-t border-[#2E4036]/10 mb-12">
                    <h3 className="text-lg font-black text-[#2E4036] mb-6 uppercase tracking-widest flex items-center gap-3">
                        <Activity size={18} className="text-[#CC5833]" />
                        Methodological Integrity
                    </h3>
                    <p className="text-base text-[#2E4036]/70 font-sans font-medium leading-relaxed">
                        The Bureau operates on a zero-trust data methodology. Instead of assuming respondent clarity, our engines utilize Adversarial Simulation to attempt to "break" the questionnaire logic. According to internal data from over 520 audits, 94% of institutional instruments suffer from logic gaps that mismatch the target socio-economic profile.
                    </p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => window.open('/os', '_blank')}
                        className="btn-magnetic bg-[#2E4036] text-white px-8 sm:px-12 py-4 sm:py-5"
                    >
                        <span>Explore the Ecosystem</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            </div>
            {/* Minimal background flair */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#CC5833]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </section>
    );
}
