import React from "react";
import SovereignDashboardClient from "@/components/SovereignDashboardClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | Sovereign Command',
    description: 'The Apex Command Center for the Survey Optimization Bureau. Orchestrate missions, verify integrity, and secure institutional research dominance.',
};

export default function SovereignPage() {
    return (
        <main className="min-h-screen bg-[#020617] overflow-hidden">
            <SovereignDashboardClient />
        </main>
    );
}
