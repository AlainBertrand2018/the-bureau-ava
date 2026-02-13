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
} from "lucide-react";

interface ContextStepProps {
    context: string;
    setContext: (c: string) => void;
}

const PRESETS = [
    {
        icon: <ShoppingCart size={18} />,
        label: "FMCG Product Launch",
        context:
            "We are launching a premium organic delivery service in Mauritius, targeting young professionals aged 22-35 in urban areas. The subscription costs Rs 500/month. We want to understand price sensitivity, brand perception of 'organic' vs 'local', and willingness to switch from traditional markets.",
    },
    {
        icon: <Landmark size={18} />,
        label: "Government Policy",
        context:
            "The Ministry of Education is proposing mandatory digital literacy courses for secondary school students. We need to gauge public opinion across age groups, socioeconomic backgrounds, and regions — particularly understanding resistance from traditional educators and parents in rural areas.",
    },
    {
        icon: <GraduationCap size={18} />,
        label: "Academic Research",
        context:
            "PhD research on consumer trust in fintech applications among Mauritian adults aged 25-50. We're investigating whether factors like local brand ownership, regulatory oversight visibility, and peer recommendations influence adoption rates differently across ethnic communities.",
    },
    {
        icon: <Pill size={18} />,
        label: "Healthcare Survey",
        context:
            "A private hospital chain wants to evaluate patient satisfaction and identify key drivers of loyalty. The survey targets recent patients across income brackets, focusing on wait times, doctor communication quality, pharmacy pricing, and the appeal of a new telemedicine programme.",
    },
];

export default function ContextStep({ context, setContext }: ContextStepProps) {
    return (
        <div className="max-w-5xl mx-auto py-10">
            {/* Section Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Crosshair size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            Mission Brief
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Define The Simulation Parameters
                        </p>
                    </div>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                    Describe the survey you're planning. Include your{" "}
                    <span className="text-white font-bold">target audience</span>,{" "}
                    <span className="text-white font-bold">industry</span>, and{" "}
                    <span className="text-white font-bold">
                        what you're trying to find out
                    </span>
                    . The more detail you provide, the sharper our synthetic agents will
                    be.
                </p>
            </div>

            {/* Main Input */}
            <div className="relative mb-12">
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Example: We are launching a premium organic food subscription service targeting urban Mauritian millennials at Rs 500/month. We want to understand price sensitivity, brand perception, and channel preferences before committing to a full-scale survey..."
                    rows={6}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-3xl p-8 text-white placeholder:text-slate-600 font-medium leading-relaxed focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none text-base"
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <span
                        className={`${context.length > 10 ? "text-emerald-400" : "text-slate-600"
                            }`}
                    >
                        {context.length} chars
                    </span>
                    {context.length > 10 && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-emerald-400 flex items-center gap-1"
                        >
                            ✓ Valid
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Quick Presets */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Lightbulb size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Quick-Load Scenarios
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PRESETS.map((preset, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setContext(preset.context)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${context === preset.context
                                    ? "bg-primary/10 border-primary/30 shadow-lg shadow-blue-500/10"
                                    : "bg-slate-900/50 border-white/5 hover:border-white/10 hover:bg-slate-800/50"
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${context === preset.context
                                            ? "bg-primary/20 text-blue-400"
                                            : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                                        }`}
                                >
                                    {preset.icon}
                                </div>
                                <span
                                    className={`text-xs font-black uppercase tracking-widest ${context === preset.context
                                            ? "text-blue-400"
                                            : "text-slate-400"
                                        }`}
                                >
                                    {preset.label}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                {preset.context.slice(0, 120)}...
                            </p>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
