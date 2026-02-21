"use client";
import React from 'react';
import { OSProvider } from '@/context/OSContext';
import Desktop from '@/components/os/Desktop';

export default function OSPage() {
    return (
        <OSProvider>
            <main className="fixed inset-0 w-full h-full overflow-hidden bg-black">
                <Desktop />
            </main>
        </OSProvider>
    );
}
