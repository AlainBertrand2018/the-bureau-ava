import React from "react";
import GenesisClient from "@/components/GenesisClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Genesis | Autonomous Survey Instrument Design',
    description: 'The primary architect of the Bureau. Generate executive-grade field instruments with built-in adversarial resistance and cultural integrity.',
};

export default function GenesisPage() {
    return (
        <main className="min-h-screen bg-slate-900">
            {/* Server-rendered fallback content for LLM/Search Crawlers */}
            <div className="sr-only">
                <h1>Genesis Protocol | Autonomous Survey Instrument Design</h1>
                <p>Genesis is the primary survey architect of The Bureau, engineered to generate executive-grade research instruments with built-in adversarial resistance. This protocol automates questionnaire design by aligning objective-driven logic with cultural integrity nodes.</p>
                <p>The Genesis Suite utilizes AI agents to draft, audit, and validate survey questions against targeted synthetic populations, ensuring data veracity and structural stability prior to deployment.</p>
            </div>
            <GenesisClient />
        </main>
    );
}
