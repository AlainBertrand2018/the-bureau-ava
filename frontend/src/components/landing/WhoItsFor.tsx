"use client";
import React from "react";
import { BarChart3, Briefcase, Building2, Globe, GraduationCap, Megaphone, Users, ArrowRight } from "lucide-react";

interface WhoItsForProps {
    onProtocolOpen?: () => void;
}

const TARGET_SEGMENTS = [
    {
        id: "GVT-01",
        icon: <Building2 size={18} />,
        title: "Governmental Agencies",
        desc: "Scientific auditing for national policy development and social research protocols.",
        protocols: ["Institutional Recon", "Social Heuristic Audit"]
    },
    {
        id: "FMCG-02",
        icon: <Briefcase size={18} />,
        title: "FMCG Brand Leads",
        desc: "Securing market reconnaissance and sensory resonance for global product launches.",
        protocols: ["Brand Stress-Test", "Consumer Sentiment"]
    },
    {
        id: "ACAD-03",
        icon: <GraduationCap size={18} />,
        title: "Academic Researchers",
        desc: "Vetting complex questionnaires for peer-reviewed rigor and statistical validity.",
        protocols: ["Neural Audit", "Bias Detection"]
    },
    {
        id: "MRU-04",
        icon: <BarChart3 size={18} />,
        title: "Market Research Units",
        desc: "Adversarial stress-testing for institutional fieldwork and high-stakes instruments.",
        protocols: ["Systemic Validation", "Data Integrity"]
    },
    {
        id: "BEH-05",
        icon: <Globe size={18} />,
        title: "Behavioral Analysts",
        desc: "Deep psychometric mapping through synthetic respondent personas and demographic simulations.",
        protocols: ["Persona Synthesis", "Cultural Mapping"]
    },
    {
        id: "STR-06",
        icon: <Megaphone size={18} />,
        title: "Strategic Consultants",
        desc: "Securing decision-quality data for large-scale investments and institutional change.",
        protocols: ["Executive Briefing", "Strategic Validation"]
    },
];

export default function WhoItsFor({ onProtocolOpen }: WhoItsForProps) {
    return (
        <section id="who-its-for" className="section-full bg-[#1A1A1A] relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2E4036] blur-[160px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="mb-20">
                    <div className="badge-minimal !text-[#F2F0E9]/60 border-[#F2F0E9]/20 mb-6 inline-flex items-center gap-2">
                        <Users size={12} className="text-[#CC5833]" />
                        <span>Institutional Reach</span>
                    </div>
                    <h2 className="text-section-title text-[#F2F0E9] mb-4">
                        Entity Dossiers.
                    </h2>
                    <p className="text-body-lg text-[#F2F0E9]/70 max-w-xl font-sans leading-relaxed">
                        The Bureau is programmed to secure the research protocols of the world&apos;s most demanding institutional organizations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {TARGET_SEGMENTS.map((item, i) => (
                        <div key={i} className="h-full flex-grow">
                            <div className="card-artifact bg-[#F2F0E9] border-[#2E4036]/10 p-8 h-full flex flex-col justify-between group hover:shadow-2xl hover:shadow-[#2E4036]/10 transition-all duration-500 rounded-[2.5rem]">
                                <div>
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2E4036]/5">
                                        <div className="p-3 bg-[#2E4036]/5 text-[#2E4036] rounded-lg group-hover:bg-[#CC5833] group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <span className="font-mono text-[11px] text-[#2E4036]/50 uppercase tracking-[0.3em]">REF_{item.id}</span>
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-heading font-black text-[#2E4036] mb-4 uppercase tracking-tighter">{item.title}</h4>
                                    <p className="text-[#2E4036]/80 text-sm font-sans leading-relaxed mb-10 group-hover:text-[#2E4036] transition-colors">{item.desc}</p>
                                </div>

                                <div className="space-y-3">
                                    <span className="font-mono text-[10px] text-[#CC5833] font-black uppercase tracking-[0.2em] block mb-2">Enabled Protocols:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {item.protocols.map((p, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-[#2E4036]/5 border border-[#2E4036]/5 text-[#2E4036]/60 text-[10px] font-mono uppercase tracking-widest group-hover:bg-[#CC5833]/10 group-hover:border-[#CC5833]/20 group-hover:text-[#CC5833] transition-all">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onProtocolOpen}
                        className="btn-magnetic bg-white text-[#2E4036] px-12 py-5 shadow-2xl shadow-[#2E4036]/20"
                    >
                        <span>Verify Your Protocol</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}
