import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
    title: "Simulation Lab | The Bureau",
    description:
        "Run real-time synthetic stress tests on your survey using AI agents grounded in Mauritian Census data.",
};

export default function LabPage() {
    return <LabShell />;
}
