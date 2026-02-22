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
                <Desktop />
            </main>
        </OSProvider>
    );
}
