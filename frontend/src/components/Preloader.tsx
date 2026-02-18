"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState("Initializing Core...");

    useEffect(() => {
        // 1. Simulate fast initial load
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }

                // Dynamic speed based on progress (Slower for better visibility)
                let increment = 1;
                if (prev < 30) increment = Math.random() * 3 + 1; // Slower start
                else if (prev < 70) increment = Math.random() * 1 + 0.5; // Steady middle
                else increment = Math.random() * 0.3 + 0.1; // Very slow finish for suspense

                return Math.min(prev + increment, 100);
            });
        }, 50);

        // 2. Stage Updates
        const stageTimeouts = [
            setTimeout(() => setStage("Warming Up Engines..."), 800),
            setTimeout(() => setStage("Loading Asset Library..."), 1500),
            setTimeout(() => setStage("Calibrating AVA..."), 2400),
        ];

        // 3. Engine Warm-up (Silent Ping)
        // We fire a request to the backend to wake it up if it's sleeping (common on serverless)
        fetch("http://127.0.0.1:8000/", { method: "GET" }).catch(() => { });

        // 4. Image Preloading
        // We preload the heavy hero image so it pops instantly
        const img = new Image();
        img.src = "/ava-portrait.png"; // Adjust path if needed

        return () => {
            clearInterval(interval);
            stageTimeouts.forEach(clearTimeout);
        };
    }, []);

    const [startTime] = useState(Date.now());

    // Trigger completion when progress hits 100 AND minimum time has passed
    useEffect(() => {
        if (progress >= 100) {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 2000 - elapsed);

            const timer = setTimeout(() => {
                onComplete();
            }, remaining + 500); // Add extra 500ms for that "satisfaction" pause at 100%

            return () => clearTimeout(timer);
        }
    }, [progress, onComplete, startTime]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white"
        >
            {/* ─── Center Logo / Icon ─── */}
            <div className="relative mb-12">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
                />
                <ShieldCheck size={64} className="text-blue-500 relative z-10" />
            </div>

            {/* ─── TEXT & PERCENTAGE ─── */}
            <div className="w-64 space-y-2">
                <div className="flex justify-between items-end text-xs font-mono text-slate-400 uppercase tracking-widest">
                    <span>{stage}</span>
                    <span className="text-white font-bold">{Math.round(progress)}%</span>
                </div>

                {/* ─── PROGRESS BAR ─── */}
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                        layoutId="progress-bar"
                    />
                </div>
            </div>

            {/* ─── FOOTER SEAL ─── */}
            <div className="absolute bottom-12 text-[10px] text-slate-600 font-mono tracking-[0.3em] uppercase opacity-50">
                Survey Optimization Bureau V 2.4.1 • EST 2026
            </div>

        </motion.div>
    );
}
