"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    Crosshair,
    Lightbulb,
    ShoppingCart,
    Landmark,
    GraduationCap,
    Pill,
    Activity,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";

interface ContextStepProps {
    context: string;
    setContext: (c: string) => void;
}

const PRESETS = [
    {
        icon: <ShoppingCart size={18} />,
        label: "FMCG Product Launch",
        context:
            "We are launching a premium organic delivery service, targeting young professionals aged 22-35 in urban areas. We want to understand price sensitivity, brand perception of 'organic' vs 'local', and willingness to switch from traditional markets.",
    },
    {
        icon: <Landmark size={18} />,
        label: "Government Policy",
        context:
            "The Department of Education is proposing mandatory digital literacy courses for secondary school students. We need to gauge public opinion across age groups, socioeconomic backgrounds, and regions — particularly understanding resistance from traditional educators and parents in rural areas.",
    },
    {
        icon: <GraduationCap size={18} />,
        label: "Academic Research",
        context:
            "PhD research on consumer trust in fintech applications among adults aged 25-50. We're investigating whether factors like local brand ownership, regulatory oversight visibility, and peer recommendations influence adoption rates differently across communities.",
    },
    {
        icon: <Pill size={18} />,
        label: "Healthcare Survey",
        context:
            "A private hospital chain wants to evaluate patient satisfaction and identify key drivers of loyalty. The survey targets recent patients across income brackets, focusing on wait times, doctor communication quality, pharmacy pricing, and the appeal of a new telemedicine programme.",
    },
];

export default function ContextStep({ context, setContext }: ContextStepProps) {
    const { currentMission } = useMission();
    const targetCountry = currentMission?.config.target_country || "Target Market";

    return (
        <div className="max-w-5xl mx-auto py-10 pb-20">
            {/* Section Header */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                        <Crosshair size={22} className="text-teal-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase">
                            Mission Brief
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-0.5 w-8 bg-teal-500 rounded-full" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                Define Research Parameters
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed max-w-2xl text-sm">
                    Describe the survey you're planning. Include your{" "}
                    <span className="text-teal-400 font-bold">target audience</span>,{" "}
                    <span className="text-teal-400 font-bold">industry</span>, and{" "}
                    <span className="text-white font-bold px-2 py-0.5 bg-white/5 rounded mx-1">
                        intended outcomes
                    </span>
                    . The more detail you provide, the sharper our synthetic agents will
                    be.
                </p>
            </div>

            {/* Main Input - Glass Box Style */}
            <div className="relative mb-16 px-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-[2.5rem] blur-xl opacity-30 pointer-events-none" />
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={`Example: We are launching a premium organic delivery service targeting ${targetCountry} professionals. We want to understand price sensitivity, cultural barriers to adoption, and preferred communication channels...`}
                    rows={6}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-[2rem] p-8 text-white placeholder:text-slate-600 font-medium leading-relaxed focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 transition-all resize-none text-base shadow-2xl backdrop-blur-md"
                />
                <div className="absolute bottom-6 right-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span
                        className={`${context.length > 10 ? "text-teal-400" : "text-slate-600"
                            }`}
                    >
                        {context.length} / 1000 Tokens
                    </span>
                    {context.length > 10 && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-teal-400 flex items-center gap-2 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20"
                        >
                            <Activity size={10} className="animate-pulse" />
                            <span>Signal Verified</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Quick Presets */}
            <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/50 rounded-full border border-white/5">
                        <Lightbulb size={12} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                            Pre-Configured Streams
                        </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PRESETS.map((preset, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setContext(preset.context)}
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`text-left p-6 rounded-[1.5rem] border transition-all duration-500 group relative overflow-hidden ${context === preset.context
                                ? "bg-teal-500/10 border-teal-500/30 shadow-[0_20px_40px_rgba(20,184,166,0.1)]"
                                : "bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-900/40"
                                }`}
                        >
                            {context === preset.context && (
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
                            )}

                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${context === preset.context
                                        ? "bg-teal-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                                        : "bg-slate-800 text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-400/10"
                                        }`}
                                >
                                    {preset.icon}
                                </div>
                                <div>
                                    <span
                                        className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${context === preset.context
                                            ? "text-teal-400"
                                            : "text-slate-400 group-hover:text-white"
                                            }`}
                                    >
                                        {preset.label}
                                    </span>
                                    <div className={`h-0.5 mt-1 transition-all duration-500 ${context === preset.context ? "w-full bg-teal-500" : "w-4 bg-slate-700 group-hover:w-8 group-hover:bg-slate-500"}`} />
                                </div>
                            </div>
                            <p className={`text-[11px] font-medium leading-[1.8] transition-colors relative z-10 line-clamp-2 ${context === preset.context ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400"
                                }`}>
                                {preset.context}
                            </p>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
