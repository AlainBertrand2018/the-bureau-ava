"use client";
import React from "react";
import { Reveal } from "./LandingUtils";
import { ShieldPlus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { agentData, AgentModule } from "@/constants/agents";

const ModuleItem = ({ agent, index, activeIndex, setActiveIndex }: { agent: AgentModule, index: number, activeIndex: number | null, setActiveIndex: (i: number | null) => void }) => {
    const isOpen = activeIndex === index;

    return (
        <div className={`max-w-4xl border-l transition-all duration-500 pl-8 md:pl-16 relative ${isOpen ? 'border-blue-500 bg-blue-50/20 py-8 md:py-12' : 'border-slate-100 hover:border-slate-300'}`}>
            {/* Functional Icon Side-Indicator */}
            <div className={`absolute -left-[21px] top-6 md:top-10 w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm transition-all duration-500 ${isOpen ? 'border-blue-500 rotate-[360deg] shadow-blue-500/20' : 'border-slate-100'}`}>
                <agent.icon size={18} className={isOpen ? 'text-blue-600' : 'text-slate-400'} />
            </div>

            <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full text-left focus:outline-none cursor-pointer group"
            >
                <Reveal delay={0.1}>
                    <div className="flex items-start justify-between gap-6">
                        <h3 className={`text-xl md:text-3xl font-black tracking-tight leading-tight uppercase transition-colors duration-400 ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                            {agent.name} — {agent.role}
                        </h3>
                        <div className={`mt-1 md:mt-2 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                            <ChevronDown size={28} />
                        </div>
                    </div>
                </Reveal>
            </button>

            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
            >
                <div className="space-y-10 pt-10">
                    <div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">What It Is</span>
                        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                            {agent.whatItIs}
                        </p>
                    </div>

                    <div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">What It Does</span>
                        <p className="text-base md:text-lg text-slate-500 leading-relaxed">
                            {agent.whatItDoes}
                        </p>
                    </div>

                    <div className="p-6 md:p-8 bg-white/80 rounded-2xl border border-blue-100 shadow-sm">
                        <p className="text-sm md:text-base text-slate-800 leading-relaxed font-bold uppercase tracking-tight">
                            <span className="text-blue-600 mr-2">Output:</span>
                            {agent.output}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default function AgentCapabilities() {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(0);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="agents" className="section-full relative overflow-hidden bg-white py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="badge-blue inline-flex items-center gap-2 mb-8">
                        <ShieldPlus size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            The Agentic Stack
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-20 md:mb-24">
                        Technical <span className="text-blue-600">Specifications.</span>
                    </h2>
                </Reveal>

                <div className="space-y-4 md:space-y-6">
                    {agentData.map((agent, i) => (
                        <ModuleItem
                            key={i}
                            agent={agent}
                            index={i}
                            activeIndex={mounted ? activeIndex : null}
                            setActiveIndex={setActiveIndex}
                        />
                    ))}
                </div>
            </div>

            {/* AEO Backdrop Elements */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/30 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
        </section>
    );
}
