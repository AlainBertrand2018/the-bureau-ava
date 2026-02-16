"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Sparkles,
    Loader2,
    MapPin,
    Briefcase,
    Brain,
    User,
    Hash,
    Wand2,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import type { Persona } from "./LabShell";

interface PersonasStepProps {
    context: string;
    personas: Persona[];
    setPersonas: (p: Persona[]) => void;
}

export default function PersonasStep({
    context,
    personas,
    setPersonas,
}: PersonasStepProps) {
    const { currentMission } = useMission();
    const [isGenerating, setIsGenerating] = useState(false);
    const [personaCount, setPersonaCount] = useState(10);

    const generatePersonas = async () => {
        setIsGenerating(true);
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_personas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    count: personaCount,
                    context,
                    mission_id: currentMission?.mission_id
                }),
            });
            const data = await resp.json();
            if (Array.isArray(data)) {
                setPersonas(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const traitColor = (trait: string) => {
        const t = trait.toLowerCase();
        if (t.includes("skepti") || t.includes("critical") || t.includes("cautious"))
            return "text-rose-600 bg-rose-50 border-rose-100";
        if (t.includes("optimist") || t.includes("enthusi") || t.includes("open"))
            return "text-emerald-600 bg-emerald-50 border-emerald-100";
        if (t.includes("pragmat") || t.includes("analytic") || t.includes("detail"))
            return "text-blue-600 bg-blue-50 border-blue-100";
        return "text-amber-600 bg-amber-50 border-amber-100";
    };

    return (
        <div className="max-w-6xl mx-auto py-10">
            {/* Section Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Users size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            Diagnostic Respondents
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Select Sample Size (n) & Generate Stress-Test Archetypes
                        </p>
                    </div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                    Each respondent archetype is a{" "}
                    <span className="text-slate-900 font-bold">diagnostic lens</span>{" "}
                    — engineered to stress-test your questionnaire from a different angle.
                    They will expose{" "}
                    <span className="text-blue-600">
                        ambiguity, bias, missing options, and drop-off risks
                    </span>{" "}
                    that different demographic groups uniquely reveal.
                </p>
            </div>

            {/* Controls */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-10 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <Sparkles size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-slate-900">
                                    Archetype Generator
                                </h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    {(currentMission?.config.target_country || "Mauritius")}-Grounded Diagnostic Lenses
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2">
                            <Hash size={14} className="text-slate-400" />
                            <select
                                value={personaCount}
                                onChange={(e) => setPersonaCount(Number(e.target.value))}
                                className="bg-transparent text-slate-900 font-bold text-sm focus:outline-none cursor-pointer"
                            >
                                <option value={5}>n=5 respondents</option>
                                <option value={10}>n=10 respondents</option>
                                <option value={15}>n=15 respondents</option>
                                <option value={20}>n=20 respondents</option>
                                <option value={30}>n=30 respondents</option>
                            </select>
                        </div>

                        <button
                            onClick={generatePersonas}
                            disabled={isGenerating}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isGenerating
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 size={14} />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Persona Grid */}
            {personas.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
                    <Users size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-sm">
                        No diagnostic respondents generated yet
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                        Select your sample size (n) and click &ldquo;Generate&rdquo; to create stress-test archetypes
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Bar */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        {[
                            {
                                label: "Respondents",
                                value: personas.length,
                                color: "text-blue-600",
                            },
                            {
                                label: "Avg Age",
                                value: Math.round(
                                    personas.reduce((sum, p) => sum + (p.age || 30), 0) /
                                    personas.length
                                ),
                                color: "text-emerald-600",
                            },
                            {
                                label: "Locations",
                                value: new Set(personas.map((p) => p.location)).size,
                                color: "text-amber-600",
                            },
                            {
                                label: "Occupations",
                                value: new Set(personas.map((p) => p.occupation)).size,
                                color: "text-indigo-600",
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-100 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm"
                            >
                                <span
                                    className={`text-xl font-black tracking-tighter ${stat.color}`}
                                >
                                    {stat.value}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Persona Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {personas.map((persona, i) => (
                                <motion.div
                                    key={`${persona.name}-${i}`}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-blue-200 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                            <User size={16} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-slate-900 font-black tracking-tight truncate">
                                                {persona.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                <span>{persona.age} yrs</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={10} />
                                                    {persona.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <Briefcase size={12} className="text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-500 font-medium truncate">
                                            {persona.occupation}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {(persona.traits || "")
                                            .split(",")
                                            .slice(0, 3)
                                            .map((trait, j) => (
                                                <span
                                                    key={j}
                                                    className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${traitColor(
                                                        trait.trim()
                                                    )}`}
                                                >
                                                    {trait.trim().slice(0, 18)}
                                                </span>
                                            ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
}
