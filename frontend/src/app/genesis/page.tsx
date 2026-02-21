"use client";

import dynamic from "next/dynamic";

const SurveyArchitect = dynamic(() => import("@/components/architect/SurveyArchitect"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    )
});

export default function GenesisPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
            <SurveyArchitect mode="app" />
        </div>
    );
}
