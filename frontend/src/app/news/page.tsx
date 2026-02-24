"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { Megaphone, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const ContactModal = dynamic(() => import("@/components/ContactModal"), { ssr: false });
const BusinessOnboardingModal = dynamic(() => import("@/components/BusinessOnboardingModal"), { ssr: false });

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | News Feed',
    description: 'The latest operational updates, system enhancements, and strategic deployments from the Survey Optimization Bureau.',
};

export default function NewsPage() {
    const [isContactOpen, setIsContactOpen] = React.useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

    return (
        <main className="min-h-screen bg-[#F2F0E9] flex flex-col pt-32">
            <Navbar
                onContactClick={() => setIsContactOpen(true)}
                onOnboardingClick={() => setIsOnboardingOpen(true)}
            />
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
                    <div className="badge-minimal mb-6 inline-flex items-center gap-2">
                        <Megaphone size={12} className="text-[#CC5833]" />
                        <span>Intelligence Feed</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#2E4036] uppercase tracking-tighter mb-6">
                        Latest <span className="text-[#CC5833]">Updates.</span>
                    </h1>
                    <p className="text-xl text-[#2E4036]/60 max-w-2xl mx-auto font-sans">
                        Real-time updates on architectural shifts, agent upgrades, and institutional deployments.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-6 space-y-8 mb-32">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-8 bg-white border border-[#2E4036]/5 rounded-[2.5rem] hover:border-[#CC5833]/30 transition-all group">
                            <span className="font-mono text-[10px] text-[#CC5833] font-bold uppercase tracking-widest mb-4 block">Archive_Log_00{i}</span>
                            <h2 className="text-2xl font-black text-[#2E4036] mb-4 uppercase tracking-tight group-hover:text-[#CC5833] transition-colors">
                                AVA v2.4.1 Architectural Expansion
                            </h2>
                            <p className="text-[#2E4036]/60 font-sans leading-relaxed mb-6">
                                Implementing new cross-cultural intelligence nodes to enhance adversarial simulation accuracy in emerging markets.
                            </p>
                            <div className="flex items-center gap-2 text-[#CC5833] font-black text-[10px] uppercase tracking-widest">
                                <span>Read Full Log</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer dark={false} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <BusinessOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
        </main>
    );
}
