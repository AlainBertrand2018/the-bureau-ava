import React, { Suspense } from "react";
import MissionControlClient from "@/components/MissionControlClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mission Control | Cultural Calibration & Target Snapshot',
    description: 'The Bureau\'s strategic hub for market universalization. Calibrate socio-economic axioms and linguistic registers before simulation.',
};

export default function MissionControlPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            {/* Server-rendered fallback content for LLM/Search Crawlers */}
            {/* [H1] What is Mission Control? - AEO Content Block */}
            <div className="sr-only">
                <h1>What is The Bureau Mission Control?</h1>
                <p>
                    Mission Control is the strategic intelligence hub of The Survey Optimization Bureau (SOB) designed for cultural calibration and target snapshot synthesis.
                    It serves as the pre-simulation staging area where socio-economic axioms, linguistic registers, and demographic profiles are aligned
                    prior to initiating adversarial survey audits.
                </p>

                <div>
                    <h2>The Mission Control Entity Triad</h2>
                    <p>Definition: Mission Control is the central command interface for market universalization within the AVA ecosystem.</p>
                    <p>Attribute: Features target snapshot synthesis and demographic psychographic alignment (v2.4.1).</p>
                    <p>Importance: Guarantees that survey instruments are calibrated to the specific cultural context of the target audience, preventing "Western-bias" logic errors.</p>
                </div>

                <h2>Core Hub Capabilities</h2>
                <ul>
                    <li>Feature 1: Socio-economic Axiom Mapping for local market relevance.</li>
                    <li>Feature 2: Linguistic Register Identification to ensure respondent comprehension.</li>
                    <li>Feature 3: Target Snapshot Synthesis for accurate persona modeling.</li>
                </ul>
            </div>

            <Suspense fallback={
                <div className="min-h-screen flex flex-col items-center justify-center text-white p-8">
                    <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin mb-8" />
                    <h1 className="text-2xl font-black uppercase tracking-widest mb-4">Mission Control</h1>
                    <p className="text-slate-400 text-sm animate-pulse">Initializing Bureau Intelligence Systems...</p>
                </div>
            }>
                <MissionControlClient />
            </Suspense>
        </main>
    );
}
