import React from "react";
import GenesisClient from "@/components/GenesisClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Genesis | Autonomous Survey Instrument Design',
    description: 'The primary architect of the Bureau. Generate executive-grade field instruments with built-in adversarial resistance and cultural integrity.',
};

export default function GenesisPage() {
    return <GenesisClient />;
}
