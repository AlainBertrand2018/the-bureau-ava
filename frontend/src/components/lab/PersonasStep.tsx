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
    const [isGenerating, setIsGenerating] = useState(false);
    const [personaCount, setPersonaCount] = useState(10);

    const generatePersonas = async () => {
        setIsGenerating(true);
        try {
            const resp = await fetch("http://127.0.0.1:8000/generate_personas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count: personaCount, context }),
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
            return "text-rose-400 bg-rose-500/10 border-rose-500/20";
        if (t.includes("optimist") || t.includes("enthusi") || t.includes("open"))
            return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        if (t.includes("pragmat") || t.includes("analytic") || t.includes("detail"))
            return "text-blue-400 bg-blue-500/10 border-blue-500/20";
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    };

    return (
        <div className="max-w-6xl mx-auto py-10">
            {/* Section Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Users size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            Diagnostic Respondents
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Select Sample Size (n) & Generate Stress-Test Archetypes
                        </p>
                    </div>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                    Each respondent archetype is a{" "}
                    <span className="text-white font-bold">diagnostic lens</span>{" "}
                    — engineered to stress-test your questionnaire from a different angle.
                    They will expose{" "}
                    <span className="text-blue-400">
                        ambiguity, bias, missing options, and drop-off risks
                    </span>{" "}
                    that different demographic groups uniquely reveal.
                </p>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-br from-blue-950/50 to-slate-900/50 border border-primary/20 rounded-3xl p-8 mb-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Sparkles size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-white">
                                    Archetype Generator
                                </h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Mauritius-Grounded Diagnostic Lenses
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2">
                            <Hash size={14} className="text-slate-500" />
                            <select
                                value={personaCount}
                                onChange={(e) => setPersonaCount(Number(e.target.value))}
                                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
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
                                ? "bg-white/5 text-slate-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
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
                <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl">
                    <Users size={40} className="text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold text-sm">
                        No diagnostic respondents generated yet
                    </p>
                    <p className="text-slate-700 text-xs mt-1">
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
                                color: "text-blue-400",
                            },
                            {
                                label: "Avg Age",
                                value: Math.round(
                                    personas.reduce((sum, p) => sum + (p.age || 30), 0) /
                                    personas.length
                                ),
                                color: "text-emerald-400",
                            },
                            {
                                label: "Locations",
                                value: new Set(personas.map((p) => p.location)).size,
                                color: "text-amber-400",
                            },
                            {
                                label: "Occupations",
                                value: new Set(personas.map((p) => p.occupation)).size,
                                color: "text-violet-400",
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-slate-900/50 border border-white/5 rounded-xl px-5 py-3 flex items-center gap-3"
                            >
                                <span
                                    className={`text-xl font-black tracking-tighter ${stat.color}`}
                                >
                                    {stat.value}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
                                    className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center shrink-0">
                                            <User size={16} className="text-blue-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-white font-black tracking-tight truncate">
                                                {persona.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                <span>{persona.age} yrs</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={10} />
                                                    {persona.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <Briefcase size={12} className="text-slate-600 shrink-0" />
                                        <span className="text-xs text-slate-400 font-medium truncate">
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
