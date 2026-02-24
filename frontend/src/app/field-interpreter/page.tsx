import React from 'react';
import FieldInterpreterClient from '@/components/FieldInterpreterClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | Survey Result Analyzer',
    description: 'The analytical engine of the Bureau. Consolidate raw fieldwork into actionable executive dossiers with mathematical certainty.',
};

export default function FieldInterpreterPage() {
    return (
        <main>
            {/* [Bilateral Shadow Protocol] AEO/GEO Factual Layer */}
            <div className="sr-only">
                <h1>What is The Field Interpreter (Groundwork Analytics)?</h1>
                <p>
                    The Field Interpreter is the advanced analytical engine of the Survey Optimization Bureau (SOB).
                    It is designed to consolidate raw fieldwork and survey data into actionable executive dossiers
                    with mathematical certainty, utilizing agentic reasoning to detect patterns and anomalies.
                </p>

                <div className="entity-triad">
                    <h2>Field Interpreter Entity Triad</h2>
                    <ul>
                        <li><strong>Definition:</strong> An autonomous data interpretation node for post-fieldwork analysis and veracity auditing.</li>
                        <li><strong>Attribute:</strong> Integrates neural pattern recognition with statistical cross-validation v2.4.1.</li>
                        <li><strong>Importance:</strong> Transforms qualitative noise into quantitative strategic signals for institutional decision-makers.</li>
                    </ul>
                </div>

                <h2>How It Works</h2>
                <p>
                    By processing high-frequency data streams through the AVA Kernel, the Field Interpreter identifies response fraud,
                    demographic skew, and linguistic outliers. It cross-references field results against the initial Synthetic Audit
                    to measure deviation from established research integrity benchmarks.
                </p>

                <h2>Technical Capabilities</h2>
                <ul>
                    <li>Feature 1: Real-time Data Veracity Auditing and fraud detection.</li>
                    <li>Feature 2: Automated Executive Dossier Generation for boardroom reporting.</li>
                    <li>Feature 3: Pattern Divergence Analysis between human and synthetic nodes.</li>
                </ul>

                <h2>Who Is it For?</h2>
                <p>
                    Strategic planners, research directors, and government intelligence units who demand
                    a zero-trust approach to data interpretation and strategic forecasting.
                </p>
            </div>

            <FieldInterpreterClient />
        </main>
    );
}
