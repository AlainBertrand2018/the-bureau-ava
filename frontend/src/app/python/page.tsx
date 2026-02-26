import React from 'react';
import PythonInterpreterClient from '@/components/PythonInterpreterClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | Python Kernel',
    description: 'Direct access to the AVA Intelligence Engine. Run adversarial stress tests and data audits via the Bureau Kernel.',
};

export default function PythonInterpreterPage() {
    return (
        <main>
            <PythonInterpreterClient />
        </main>
    );
}
