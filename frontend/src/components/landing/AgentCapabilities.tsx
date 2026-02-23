"use client";
import React from "react";
import { ChevronDown, Activity, Cpu, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { agentData, AgentModule } from "@/constants/agents";

const ModuleItem = ({ agent, index, activeIndex, setActiveIndex }: { agent: AgentModule, index: number, activeIndex: number | null, setActiveIndex: (i: number | null) => void }) => {
    const isOpen = activeIndex === index;

    return (
        <div className={`max-w-5xl border-l transition-all duration-700 pl-8 md:pl-16 pr-8 md:pr-16 relative mb-4 ${isOpen ? 'border-[#CC5833] bg-[#2E4036]/5 py-10 md:py-16' : 'border-[#2E4036]/10 hover:border-[#2E4036]/30'}`}>
            {/* Functional Icon Side-Indicator */}
            <div className={`absolute -left-[21px] top-6 md:top-10 w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm transition-all duration-700 ${isOpen ? 'border-[#CC5833] rotate-[360deg] shadow-[#CC5833]/20' : 'border-[#2E4036]/10'}`}>
                <agent.icon size={18} className={isOpen ? 'text-[#CC5833]' : 'text-[#2E4036]/40'} />
            </div>

            <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full text-left focus:outline-none cursor-pointer group"
            >
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <span className="font-mono text-[9px] text-[#2E4036]/40 uppercase tracking-[0.3em] block mb-2">Protocol_Module_0{index + 1}</span>
                        <h3 className={`text-xl md:text-3xl font-heading font-black tracking-tighter uppercase transition-colors duration-400 ${isOpen ? 'text-[#CC5833]' : 'text-[#2E4036] group-hover:text-[#CC5833]'}`}>
                            {agent.name} <span className="text-[#2E4036]/20">/</span> {agent.role}
                        </h3>
                    </div>
                    <div className={`mt-4 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#CC5833]' : 'text-[#2E4036]/20 group-hover:text-[#CC5833]'}`}>
                        <ChevronDown size={24} />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-12 pt-12 max-w-4xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <span className="font-mono text-[10px] text-[#CC5833] font-bold uppercase tracking-widest block mb-4">Core Definition</span>
                                    <p className="text-lg md:text-xl text-[#2E4036]/80 font-sans font-medium leading-[1.4] tracking-tight">
                                        {agent.whatItIs}
                                    </p>
                                </div>

                                <div className="p-8 bg-[#2E4036]/5 rounded-2xl border border-[#2E4036]/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Activity size={14} className="text-[#CC5833]" />
                                        <span className="font-mono text-[10px] text-[#2E4036] font-bold uppercase tracking-widest">Deterministic Output</span>
                                    </div>
                                    <p className="text-[11px] md:text-sm text-[#2E4036] leading-relaxed font-bold uppercase tracking-tighter">
                                        {agent.output}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="font-mono text-[10px] text-[#CC5833] font-bold uppercase tracking-widest block mb-4">Functional Capabilities</span>
                                <p className="text-base md:text-lg text-[#2E4036]/60 leading-relaxed font-sans max-w-3xl">
                                    {agent.whatItDoes}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 pt-6 border-t border-[#2E4036]/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#CC5833] animate-pulse" />
                                    <span className="font-mono text-[9px] font-bold text-[#2E4036]/40 uppercase tracking-widest">Calibrated_Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-[#CC5833]" />
                                    <span className="font-mono text-[9px] font-bold text-[#2E4036]/40 uppercase tracking-widest">Security_Protocol_V4</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function AgentCapabilities() {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="agents" className="section-full relative bg-[#F2F0E9] border-y border-[#2E4036]/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-24">
                    <div className="badge-minimal mb-8 inline-flex items-center gap-2">
                        <Cpu size={12} className="text-[#CC5833]" />
                        <span>The Fleet Manifest</span>
                    </div>
                    <h2 className="text-section-title text-[#2E4036] max-w-4xl leading-[0.9]">
                        Technical Specifications <span className="text-[#CC5833]">Catalogue.</span>
                    </h2>
                </div>

                <div className="space-y-4 md:space-y-6 mb-16">
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

                <div className="flex justify-center">
                    <button
                        onClick={() => window.open('/os', '_blank')}
                        className="btn-magnetic bg-[#2E4036] text-white px-12 py-5"
                    >
                        <span>Inspect Framework</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            </div>

            {/* Background Data Matrix */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-[#2E4036]/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(#2E4036 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>
        </section>
    );
}
