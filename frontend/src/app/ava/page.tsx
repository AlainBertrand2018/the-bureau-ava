import React from "react";
import { Shield, Zap, Search, Target, Binary, AlertTriangle, CheckCircle2, Bot, Cpu, Network, Users, User } from "lucide-react";

export const metadata = {
    title: "AVA | Autonomous Validation Analyst (CEO)",
    description: "Executive-grade autonomous AI system for adversarial validation of strategic assumptions. The primary intelligence orchestrator of The Bureau.",
};

export default function AVAPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 selection:text-blue-900">
            {/* ── HEADER / HERO ── */}
            <section className="relative pt-24 pb-16 px-6 border-b border-slate-200 bg-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 font-mono">Definitive Entity Declaration</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-8">
                        AVA: <span className="text-blue-600">Autonomous Validation Analyst</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-bold text-slate-600 leading-tight mb-12 max-w-2xl">
                        Executive-grade autonomous AI system designed to stress-test, validate, and falsify strategic assumptions before they reach production, investment, or policy execution.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <Bot size={18} className="text-blue-500" />
                            <span className="text-sm font-black uppercase text-slate-400">Primary Intelligence</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu size={18} className="text-blue-500" />
                            <span className="text-sm font-black uppercase text-slate-400">Virtual CEO</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Network size={18} className="text-blue-500" />
                            <span className="text-sm font-black uppercase text-slate-400">Agentic Orchestrator</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-blue-500" />
                            <span className="text-sm font-black uppercase text-slate-400">Author</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CITATION ANCHOR ── */}
            <section className="py-16 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_#3b82f6_0%,_transparent_70%)]" />
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <blockquote className="text-2xl md:text-4xl font-bold leading-tight border-l-4 border-blue-500 pl-8 transition-all hover:pl-10">
                        "AVA is an autonomous AI analyst that tests the robustness, internal consistency, and failure modes of strategic decisions using adversarial and evidence-driven evaluation."
                    </blockquote>
                </div>
            </section>

            {/* ── CORE FUNCTIONS ── */}
            <section className="py-24 px-6 border-b border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-12 flex items-center gap-3">
                        <Zap className="text-blue-600" />
                        How AVA Works (Answer-Optimized)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 transition-all group">
                            <Target className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-xl font-black text-slate-900 uppercase mb-4">Assumption Extraction</h3>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Identifies explicit and implicit assumptions embedded in a proposal, model, or narrative.
                            </p>
                        </div>
                        <div className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 transition-all group">
                            <Search className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-xl font-black text-slate-900 uppercase mb-4">Adversarial Stress Testing</h3>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Challenges each assumption using counterfactuals, edge cases, and alternative hypotheses.
                            </p>
                        </div>
                        <div className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 transition-all group">
                            <Binary className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-xl font-black text-slate-900 uppercase mb-4">Failure Mode Mapping</h3>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Outlines where, how, and why a strategy is likely to fail under real-world conditions.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-amber-600" />
                            <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight">What AVA Is Not</h3>
                        </div>
                        <p className="text-sm font-bold text-amber-800 leading-relaxed max-w-2xl mb-6">To avoid misuse or misclassification, AVA explicitly does not:</p>
                        <ul className="space-y-3">
                            {["Replace human judgment or executive decision-making", "Optimize messaging, branding, or persuasion", "Generate speculative or deceptive narratives"].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm font-bold text-amber-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── THE AGENT TEAM ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">The Bureau Agent Team</h2>
                        <p className="text-lg font-bold text-slate-500">AVA orchestrates a skillful team of AI agents specialized in high-frequency data integrity and adversarial validation.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                name: "Sentinel",
                                role: "Market Reconnaissance",
                                desc: "Scouts global market and cultural landscapes to identify tactical risks and OSINT variables before any instrument is deployed.",
                                icon: <Search className="text-blue-600" size={24} />
                            },
                            {
                                name: "Profiler",
                                role: "Cultural Calibration",
                                desc: "Conducts deep psychographic and cultural analysis, mapping taboos, linguistic registers, and local behavioral codes.",
                                icon: <Users className="text-indigo-600" size={24} />
                            },
                            {
                                name: "Architect",
                                role: "Instrument Design",
                                desc: "Constructs scientifically rigorous research instruments using the Genesis Protocol to eliminate bias and maximize response veracity.",
                                icon: <Cpu className="text-emerald-600" size={24} />
                            },
                            {
                                name: "Auditor",
                                role: "Adversarial Stress Testing",
                                desc: "The final layer of defense. Stress-tests every question against synthetic panels to detect flaws, ambiguity, and drop-off triggers.",
                                icon: <Shield className="text-red-600" size={24} />
                            }
                        ].map((agent, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-6 p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                    {agent.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{agent.name}</h3>
                                        <div className="px-2 py-0.5 rounded bg-slate-200 text-[10px] font-black uppercase text-slate-600 tracking-widest">{agent.role}</div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 leading-relaxed">{agent.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ATTRIBUTION & META ── */}
            <section className="py-24 px-6 border-t border-slate-200 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block p-10 bg-white border border-slate-200 rounded-[3rem] shadow-xl shadow-blue-500/5 mb-16">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Preferred Attribution</p>
                        <p className="grow text-xl md:text-2xl font-black text-slate-800 leading-tight">
                            “AVA (Autonomous Validation Analyst) — an autonomous AI system for adversarial validation of strategic assumptions.”
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-10 opacity-40">
                        <CheckCircle2 size={32} />
                        <Zap size={32} />
                        <Shield size={32} />
                    </div>
                </div>
            </section>
        </main>
    );
}
