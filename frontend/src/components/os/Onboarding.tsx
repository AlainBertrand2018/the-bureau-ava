"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HUD_STEPS = [
    {
        id: 'dock',
        title: 'SYSTEM: COMMAND',
        description: 'Launch tools via the primary dock.',
        position: 'bottom-44 left-1/2 -translate-x-1/2',
        arrowPath: 'M 10 0 L 10 40 L 0 30 M 10 40 L 20 30', // Simple downward arrow
        arrowPos: 'bottom-[-50px] left-1/2 -translate-x-1/2'
    },
    {
        id: 'widgets',
        title: 'SYSTEM: INTELLIGENCE',
        description: 'Live mission data & system status.',
        position: 'top-1/3 left-[28rem]',
        arrowPath: 'M 40 10 L 0 10 L 10 0 M 0 10 L 10 20', // Simple leftward arrow
        arrowPos: 'left-[-60px] top-1/2 -translate-y-1/2'
    },
    {
        id: 'workspace',
        title: 'SYSTEM: READY',
        description: 'Interactive workspace initialized. Drag to organize.',
        position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        arrowPath: '',
        arrowPos: ''
    }
];

const Onboarding: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('ava-os-onboarding-v2');
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const nextStep = () => {
        if (currentStep < HUD_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            complete();
        }
    };

    const complete = () => {
        setIsVisible(false);
        localStorage.setItem('ava-os-onboarding-v2', 'true');
    };

    if (!isVisible) return null;

    const step = HUD_STEPS[currentStep];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center cursor-pointer select-none" onClick={nextStep}>
            {/* Ghost Dimmer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* HUD Info Row */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className={`absolute ${step.position} flex flex-col items-center text-center`}
                >
                    {/* Subtle Arrow HUD Component */}
                    {step.arrowPath && (
                        <div className={`absolute ${step.arrowPos}`}>
                            <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-40">
                                <path d={step.arrowPath} fill="none" stroke="#10b981" strokeWidth="1.5" />
                            </svg>
                        </div>
                    )}

                    <div className="flex flex-col gap-1 items-center">
                        <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] opacity-80 mb-1">
                            {step.title}
                        </h2>
                        <p className="text-white text-sm font-light tracking-wide max-w-[280px]">
                            {step.description}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Global Interface Hints */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] animate-pulse">
                    Tap anywhere to advance handover
                </span>
                <div className="flex gap-4">
                    {HUD_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-[2px] transition-all duration-700 ${i === currentStep ? 'w-12 bg-emerald-500' : 'w-4 bg-white/10'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
