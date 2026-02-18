"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";

interface LaboratoryEntryProtocolProps {
    isOpen: boolean;
    targetName?: string;
    onComplete: () => void;
}

export default function LaboratoryEntryProtocol({ isOpen, targetName = "Unknown", onComplete }: LaboratoryEntryProtocolProps) {
    const [step, setStep] = useState(0);
    const [text, setText] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            return;
        }

        const sequence = [
            { txt: "Authenticating Clearance...", delay: 800 },
            { txt: `Loading Parameters: ${targetName}...`, delay: 1200 },
            { txt: "Calibrating Simulation Layer...", delay: 1500 },
            { txt: "Access Granted.", delay: 800 }
        ];

        let currentStep = 0;
        let timeout: NodeJS.Timeout;

        const runSequence = () => {
            if (currentStep < sequence.length) {
                setText(sequence[currentStep].txt);
                setStep(currentStep + 1);
                timeout = setTimeout(() => {
                    currentStep++;
                    runSequence();
                }, sequence[currentStep].delay);
            } else {
                onComplete();
            }
        };

        runSequence();

        return () => clearTimeout(timeout);
    }, [isOpen, targetName, onComplete]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 text-white font-mono"
                >
                    <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10 pointer-events-none" />

                    <div className="relative text-center space-y-8 max-w-md w-full px-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 mx-auto border border-blue-500/30 bg-blue-500/10 rounded-full flex items-center justify-center relative"
                        >
                            <div className="absolute inset-0 border border-blue-400/50 rounded-full animate-ping opacity-20" />
                            <Cpu size={32} className="text-blue-400 animate-pulse" />
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">
                                Bureau Laboratory Protocol
                            </h2>
                            <div className="h-12 flex items-center justify-center">
                                <motion.p
                                    key={text}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-lg md:text-xl font-bold tracking-tight"
                                >
                                    {text}
                                </motion.p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4.5, ease: "linear" }}
                                className="h-full bg-gradient-to-r from-blue-600 to-emerald-400"
                            />
                        </div>

                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                            <span>System Integrity</span>
                            <span className="text-emerald-500">100%</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
