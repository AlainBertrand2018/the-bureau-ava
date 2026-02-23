"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, ShieldCheck, PieChart, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const ContactModal = dynamic(() => import("@/components/ContactModal"), { ssr: false });
const BusinessOnboardingModal = dynamic(() => import("@/components/BusinessOnboardingModal"), { ssr: false });

export default function InvestorsPage() {
    const [isContactOpen, setIsContactOpen] = React.useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-[#F2F0E9] flex flex-col pt-32">
            <Navbar
                onContactClick={() => setIsContactOpen(true)}
                onOnboardingClick={() => setIsOnboardingOpen(true)}
            />
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto px-6 mb-32 text-center">
                    <div className="badge-minimal mb-6 inline-flex items-center gap-2 border-white/10 text-white/60">
                        <TrendingUp size={12} className="text-[#CC5833]" />
                        <span>Capital Relations</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
                        Investor <span className="text-[#CC5833]">Relations.</span>
                    </h1>
                    <p className="text-xl text-white/40 max-w-2xl mx-auto font-sans">
                        Technical overview of The Bureau's economic architecture, market penetration and scalability protocols.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { icon: <ShieldCheck className="text-[#CC5833]" />, title: "Market Moat", desc: "Proprietary adversarial AI that cannot be easily replicated by generic LLMs." },
                        { icon: <TrendingUp className="text-[#CC5833]" />, title: "Scalability", desc: "Synthetic population nodes allowing for infinite concurrent mission executions." },
                        { icon: <PieChart className="text-[#CC5833]" />, title: "Efficiency", desc: "98% reduction in validation timelines compared to traditional methodologies." },
                    ].map((card, i) => (
                        <div key={i} className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mx-auto mb-8">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">{card.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed font-sans">{card.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center mb-32">
                    <div className="p-12 bg-[#CC5833] rounded-[3rem] shadow-2xl shadow-[#CC5833]/20">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Request Access to Private Ledger</h2>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="bg-[#1A1A1A] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-4 mx-auto"
                        >
                            <span>Begin Verification</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <Footer dark={true} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <BusinessOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
        </main>
    );
}
