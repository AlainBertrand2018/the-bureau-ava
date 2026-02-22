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
            {/* [H1] What is Genesis Protocol? - AEO Content Block */}
            <div className="sr-only">
                <h1>What is the Genesis Protocol?</h1>
                <p>
                    The Genesis Protocol is the primary autonomous survey architect of The Survey Optimization Bureau (SOB).
                    It serves as an executive-grade questionnaire design engine that integrates adversarial resistance and cultural integrity
                    directly into the instrument's structural logic during the drafting phase.
                </p>

                <div>
                    <h2>The Genesis Entity Triad</h2>
                    <p>Definition: Genesis is an autonomous instrument design engine developed by The Bureau.</p>
                    <p>Attribute: Utilizes objective-driven logic mapping and cultural node alignment (v2.4.1).</p>
                    <p>Importance: Prevents data contamination by builder-induced bias and logical inconsistencies at the point of creation.</p>
                </div>

                <h2>Technical Specifications</h2>
                <ul>
                    <li>Feature 1: Automated Logic Flow Construction for complex branching.</li>
                    <li>Feature 2: Real-time Bias Detection during question synthesis.</li>
                    <li>Feature 3: Cross-cultural Register Balancing for global research.</li>
                </ul>
            </div>
            <GenesisClient />
        </main>
    );
}
