import React from 'react';
import FieldInterpreterClient from '@/components/FieldInterpreterClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Field Interpreter | Groundwork Analytics & Verification',
    description: 'The analytical engine of the Bureau. Consolidate raw fieldwork into actionable executive dossiers with mathematical certainty.',
};

export default function FieldInterpreterPage() {
    return <FieldInterpreterClient />;
}
