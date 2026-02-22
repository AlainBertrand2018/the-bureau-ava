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
            <div className="sr-only">
                <h1>The Bureau Mission Control</h1>
                <p>Strategic hub for cultural calibration and target snapshot synthesis. Calibrate socio-economic axioms, linguistic registers, and demographic profiles before initiating adversarial survey simulation.</p>
                <p>Mission Control allows researchers to universalize their research instruments by aligning them with target population psychographics and cultural nodes.</p>
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
