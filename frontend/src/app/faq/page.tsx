"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/landing/FAQSection";
import { HelpCircle } from "lucide-react";

import Link from "next/link";
import dynamic from "next/dynamic";

const ContactModal = dynamic(() => import("@/components/ContactModal"), { ssr: false });
const BusinessOnboardingModal = dynamic(() => import("@/components/BusinessOnboardingModal"), { ssr: false });

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | FAQ',
    description: 'Frequently asked questions regarding autonomous survey validation, the AVA orchestrator, and The Bureau\'s methodologies.',
};

export default function FAQPage() {
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
                        <HelpCircle size={12} className="text-[#CC5833]" />
                        <span>Support Center</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#2E4036] uppercase tracking-tighter mb-6">
                        Technical <span className="text-[#CC5833]">FAQ.</span>
                    </h1>
                    <p className="text-xl text-[#2E4036]/60 max-w-2xl mx-auto font-sans">
                        Comprehensive documentation and answers to technical enquiries regarding AVA and The Bureau's protocols.
                    </p>
                </div>
                <FAQSection isFullPage={true} />
            </div>
            <Footer dark={false} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <BusinessOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
        </main>
    );
}
