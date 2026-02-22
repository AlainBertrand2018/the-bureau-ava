import LabShell from "@/components/lab/LabShell";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Lab | Adversarial Population Simulation',
    description: 'Stress-test survey instruments against synthetic populations to identify bias and structural weaknesses.',
};

export default function LabPage() {
    return <LabShell />;
}
