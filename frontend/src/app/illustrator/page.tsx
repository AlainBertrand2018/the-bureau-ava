import React from 'react';
import IllustratorClient from '@/components/IllustratorClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | Illustrator',
    description: 'Neural Asset Generation Subsystem for high-end business infographics and mission patches.',
};

export default function IllustratorPage() {
    return (
        <main>
            <IllustratorClient />
        </main>
    );
}
