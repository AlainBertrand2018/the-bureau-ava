"use client";
import React from "react";
import { Zap, ArrowRight, ShieldCheck } from "lucide-react";

interface FinalCTASectionProps {
    onEntryOpen: () => void;
}

export default function FinalCTASection({ onEntryOpen }: FinalCTASectionProps) {
    return (
        <section id="contact" className="section-full relative bg-[#F2F0E9] border-t border-[#2E4036]/5 shadow-inner">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#CC5833]/10 blur-[160px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto px-6 w-full text-center relative z-10">
                <div className="badge-minimal text-[#2E4036]/60 border-[#2E4036]/10 mb-8 inline-flex items-center gap-2">
                    <ShieldCheck size={12} className="text-[#CC5833]" />
                    <span>The Deployment Threshold</span>
                </div>

                <div className="card-artifact bg-white border border-[#2E4036]/10 rounded-[3rem] p-12 md:p-24 relative overflow-hidden group shadow-2xl shadow-[#2E4036]/5">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(#2E4036 1px, transparent 1px), linear-gradient(90deg, #2E4036 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }} />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-section-title text-[#2E4036] mb-8 uppercase leading-[0.9]">
                            Zero tolerance for <span className="text-[#CC5833]">contaminants.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-[#2E4036]/80 font-sans leading-relaxed max-w-xl mx-auto mb-16 font-medium">
                            Deploy your research on a foundation of scientific certainty. Run your first adversarial audit now — calibrated and processed in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={onEntryOpen}
                                className="btn-magnetic bg-[#2E4036] text-white px-12 py-5 shadow-2xl shadow-[#2E4036]/20 group border-none"
                            >
                                <Zap size={20} className="text-[#CC5833]" />
                                <span>Initiate First Audit</span>
                                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="font-mono text-[10px] text-[#CC5833] font-black uppercase tracking-widest">Bureau Status</span>
                                    <span className="font-mono text-[12px] text-[#2E4036] font-black uppercase">Ready_to_Deploy</span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-[#CC5833] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <p className="font-mono text-[10px] text-[#2E4036]/30 uppercase tracking-[0.4em] font-bold">
                        // FINAL_CALIBRATION_COMPLETE // SYSTEM_READY
                    </p>
                </div>
            </div>
        </section>
    );
}
