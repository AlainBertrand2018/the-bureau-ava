import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import SurveyFailIllustrator from "@/components/illustrators/SurveyFailIllustrator";

type Props = {
    params: Promise<{ slug: string }>;
};

const ILLUSTRATORS: Record<string, React.ReactNode> = {
    "why-94-percent-of-surveys-fail": <SurveyFailIllustrator />,
    "why-94-percent-fail": <SurveyFailIllustrator />, // Alias
    "ia-025": <SurveyFailIllustrator />, // Alias
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    if (slug === "why-94-percent-of-surveys-fail" || slug === "why-94-percent-fail" || slug === "ia-025") {
        return {
            title: "AVA Intelligence | What 94% of Failed Surveys Have in Common",
            description: "Internal Audit Archive IA_025: Staggering reality of research instrument design flaws.",
        };
    }

    return { title: "Illustrator Not Found" };
}

export default async function IllustratorPage({ params }: Props) {
    const { slug } = await params;

    const Illustrator = ILLUSTRATORS[slug];

    if (!Illustrator) {
        notFound();
    }

    return (
        <div className="bg-[#0f172a] min-h-screen">
            {Illustrator}
        </div>
    );
}
