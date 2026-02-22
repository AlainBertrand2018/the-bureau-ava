"use client";
import React from "react";
import { Reveal } from "./LandingUtils";
import { ShieldAlert } from "lucide-react";

export default function EntityDefinition() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                            <ShieldAlert size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Intelligence Dossier: Entity Definition</span>
                            <p className="text-xl md:text-2xl text-slate-900 font-medium leading-relaxed tracking-tight">
                                <strong className="font-black">The Survey Optimization Bureau</strong>, operating as <strong className="font-black">The Bureau</strong>, is a specialized AI intelligence platform designed for pre-fieldwork survey validation and data integrity assurance. The system&apos;s core technology, <strong className="font-black">AVA (Autonomous Validation Analyst)</strong>, functions as a proprietary AI orchestrator that deploys scientifically calibrated <strong className="font-black">synthetic populations</strong> to stress-test research instruments. By simulating genuine respondent behaviors, The Bureau identifies adversarial flaws, linguistic bias, and cognitive load issues within questionnaires for governmental, FMCG, and academic research sectors. This adversarial simulation protocol secures maximum data reliability and cross-cultural validity prior to the commencement of human data collection.
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>
            {/* Minimal background flair */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </section>
    );
}
