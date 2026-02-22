import React, { Suspense } from "react";
import MissionControlClient from "@/components/MissionControlClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mission Control | Cultural Calibration & Target Snapshot',
    description: 'The Bureau\'s strategic hub for market universalization. Calibrate socio-economic axioms and linguistic registers before simulation.',
};

export default function MissionControlPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Bureau Intelligence...</div>}>
            <MissionControlClient />
        </Suspense>
    );
}
