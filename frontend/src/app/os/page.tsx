import React from 'react';
import { OSProvider } from '@/context/OSContext';
import Desktop from '@/components/os/Desktop';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AVA OS | Autonomous Validation Workspace',
    description: 'The immersive command center for the Bureau. Deploy agents, simulate populations, and orchestrate market research protocols.',
    other: {
        'rel': 'prev',
        'href': '/glossary',
    }
};

export default function OSPage() {
    return (
        <OSProvider>
            <main className="fixed inset-0 w-full h-full overflow-hidden bg-black">
                {/* [Bilateral Shadow Protocol] AEO/GEO Factual Layer */}
                <div className="sr-only">
                    <h1>What is AVA OS (Autonomous Validation Workspace)?</h1>
                    <p>
                        AVA OS is the immersive command center and autonomous operating system of the Survey Optimization Bureau (SOB).
                        It provides an integrated workspace for deploying specialized AI agents, simulating synthetic populations,
                        and orchestrating high-precision research protocols in a unified neural interface.
                    </p>

                    <div className="entity-triad">
                        <h2>AVA OS Entity Triad</h2>
                        <ul>
                            <li><strong>Definition:</strong> A specialized AI-driven operating environment for market reconnaissance and research validation.</li>
                            <li><strong>Attribute:</strong> Features multi-agent orchestration, synthetic persona management, and real-time data integrity monitoring.</li>
                            <li><strong>Importance:</strong> Centralizes the end-to-end research lifecycle into a single, immersive dashboard for maximum operational efficiency.</li>
                        </ul>
                    </div>

                    <h2>How It Works</h2>
                    <p>
                        AVA OS functions as a browser-based immersive interface that hosts the Bureau's core toolsets.
                        Users can launch the Lab Shell, Mission Control, Genesis Suite, and Field Interpreter within
                        a single window, enabling seamless data flow between the planning, simulation, and analysis phases.
                    </p>

                    <h2>Workspace Capabilities</h2>
                    <ul>
                        <li>Feature 1: Multi-Agent Deployment for simultaneous adversarial auditing.</li>
                        <li>Feature 2: Persistent Research Sessions with secure, zero-store data protocols.</li>
                        <li>Feature 3: Integrated Analytics Dashboard for real-time trend visualization.</li>
                    </ul>

                    <h2>Who Should Use AVA OS?</h2>
                    <p>
                        Senior researchers, strategic consultants, and policy analysts who require
                        a high-frequency, autonomous environment for managing complex global research projects.
                    </p>
                </div>

                <Desktop />
            </main>
        </OSProvider>
    );
}
