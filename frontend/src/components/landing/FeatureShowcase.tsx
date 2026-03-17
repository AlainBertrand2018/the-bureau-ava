"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, ArrowRight, X, Maximize2 } from "lucide-react";

export interface FeatureItem {
    id: string;
    tabLabel: string;
    title: string;
    description: string;
    features: string[];
    videoUrl?: string;
    videoPlaceholder?: string;
    toolPath: string;
}

interface FeatureShowcaseProps {
    items: FeatureItem[];
}

export default function FeatureShowcase({ items }: FeatureShowcaseProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCinemaMode, setIsCinemaMode] = useState(false);

    const handleTryTool = () => {
        window.open(items[activeIndex].toolPath, "_blank");
    };

    return (
        <div className="w-full">
            {/* Tabs Navigation */}
            <div className="flex justify-center mb-12 sm:mb-20">
                <div className="inline-flex p-1 bg-[#2E4036]/5 rounded-2xl border border-[#2E4036]/10 backdrop-blur-sm">
                    {items.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                                activeIndex === idx
                                    ? "text-white"
                                    : "text-[#2E4036]/40 hover:text-[#2E4036]"
                            }`}
                        >
                            {activeIndex === idx && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-[#2E4036] rounded-xl shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.tabLabel}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Display Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                {/* Visual Side (Video/Simulation) */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={items[activeIndex].id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            onClick={() => setIsCinemaMode(true)}
                            className="relative aspect-video bg-[#1A1A1A] rounded-[2rem] overflow-hidden shadow-2xl border border-[#2E4036]/20 group cursor-zoom-in"
                        >
                            {/* Video / Simulation Layer */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {items[activeIndex].videoUrl ? (
                                    <video
                                        key={items[activeIndex].videoUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    >
                                        <source src={items[activeIndex].videoUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#2E4036]/40 to-[#CC5833]/10 opacity-30 group-hover:opacity-50 transition-all duration-700 font-mono" />
                                        
                                        {/* Animated Pulse UI */}
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#CC5833] rounded-full blur-2xl opacity-20 group-hover:opacity-40 animate-pulse transition-all" />
                                            <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:scale-110 transition-all duration-500">
                                                <Play className="text-white fill-white ml-1" size={32} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-[#2E4036]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                                            <Maximize2 className="text-white" size={24} />
                                        </div>
                                        <span className="text-white font-mono text-[10px] uppercase tracking-[0.3em] font-black">Expand_Intelligence_View</span>
                                    </div>
                                </div>

                                {/* Simulation HUD Overlay */}
                                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                                <div className="absolute top-6 left-6 font-mono text-[9px] text-white/60 uppercase tracking-[0.3em] bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    Active_Simulation: {items[activeIndex].tabLabel}_OS
                                </div>
                                <div className="absolute bottom-6 right-6 font-mono text-[9px] text-[#CC5833] uppercase tracking-[0.3em] font-black bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#CC5833]/20">
                                    Deterministic_Logic_Feed
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={items[activeIndex].id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-[#CC5833]" />
                                <span className="font-mono text-[10px] text-[#CC5833] font-black uppercase tracking-[0.3em]">
                                    Module_{items[activeIndex].id}
                                </span>
                            </div>
                            
                            <h3 className="text-4xl sm:text-5xl font-heading font-black text-[#2E4036] uppercase tracking-tighter mb-6">
                                {items[activeIndex].title}
                            </h3>
                            
                            <p className="text-[#2E4036]/70 text-lg sm:text-xl font-sans leading-relaxed mb-10">
                                {items[activeIndex].description}
                            </p>

                            <div className="space-y-4">
                                {items[activeIndex].features.map((feature, fIdx) => (
                                    <motion.div 
                                        key={fIdx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + fIdx * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <CheckCircle2 size={20} className="text-[#CC5833] shrink-0 mt-0.5" />
                                        <span className="text-[#2E4036] font-bold text-sm tracking-tight">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={handleTryTool}
                                className="mt-12 group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-[#2E4036] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#CC5833] transition-all duration-300 shadow-xl shadow-[#2E4036]/10"
                            >
                                <span>Try The Tool</span>
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Cinema Mode Modal */}
            <AnimatePresence>
                {isCinemaMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 pointer-events-auto"
                    >
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCinemaMode(false)}
                            className="absolute inset-0 bg-[#2E4036]/90 backdrop-blur-2xl"
                        />
                        
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsCinemaMode(false)}
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all z-50 group"
                            >
                                <X className="group-hover:rotate-90 transition-transform duration-300" size={24} />
                            </button>

                            {/* HUD Top Bar */}
                            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none z-10">
                                <div className="space-y-1">
                                    <div className="font-mono text-[10px] text-[#CC5833] font-black uppercase tracking-widest">Bureau_OS // Cinema_Feed</div>
                                    <div className="font-mono text-[9px] text-white/40 uppercase tracking-[0.3em]">Protocol_Visualizer_v.2.4.1</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-[10px] text-white font-black uppercase tracking-widest">{items[activeIndex].title}</div>
                                    <div className="font-mono text-[9px] text-white/40 uppercase tracking-[0.3em]">{items[activeIndex].id} // LOGIC_STREAM_ACTIVE</div>
                                </div>
                            </div>

                            {/* Fullscreen Video */}
                            {items[activeIndex].videoUrl ? (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src={items[activeIndex].videoUrl} type="video/mp4" />
                                </video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 font-mono text-white/20 text-xs tracking-[0.5em] uppercase">
                                    Simulation_Data_Processing
                                </div>
                            )}

                            {/* Bottom HUD Bar */}
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end border-t border-white/10 pt-6 pointer-events-none opacity-40">
                                <div className="font-mono text-[8px] text-white uppercase tracking-[0.4em]">
                                    Deterministic_Logic_Active // {new Date().toLocaleTimeString()}
                                </div>
                                <div className="font-mono text-[8px] text-white uppercase tracking-[0.4em]">
                                    Bureau_Institutional_Shield_v9.2
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

