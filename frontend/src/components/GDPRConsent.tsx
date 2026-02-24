"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Settings, Check, X } from "lucide-react";
export default function GDPRConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: false
    });

    useEffect(() => {
        const consent = localStorage.getItem("bureau-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const prefs = { essential: true, analytics: true };
        localStorage.setItem("bureau-consent", JSON.stringify(prefs));
        setIsVisible(false);
    };

    const handleDecline = () => {
        const prefs = { essential: true, analytics: false };
        localStorage.setItem("bureau-consent", JSON.stringify(prefs));
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem("bureau-consent", JSON.stringify(preferences));
        setIsVisible(false);
        setShowSettings(false);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 right-4 sm:left-6 sm:right-6 z-[100] max-w-4xl mx-auto"
                    >
                        <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full" />

                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Shield size={24} />
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-slate-900 font-black text-lg mb-2 uppercase tracking-tight">
                                    Precision Ethics & Privacy
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                                    Bureau protocols use session-level telemetry to ensure diagnostic integrity. Your data remains your own, processed under state-of-the-art security.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="w-full sm:w-auto px-6 py-3 text-slate-500 hover:text-slate-900 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                >
                                    <Settings size={14} />
                                    Customize
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="w-full sm:w-auto px-6 py-3 border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Essential Only
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Authorize Full Stack
                                </button>
                            </div>
                        </div>

                        {/* Preferences Modal (Inline) */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute bottom-full mb-4 left-0 right-0 bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-slate-900 font-black text-xl uppercase tracking-tight">
                                            Customize
                                        </h4>
                                        <button
                                            onClick={() => setShowSettings(false)}
                                            className="text-slate-400 hover:text-slate-900 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Essential */}
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="flex-grow">
                                                <p className="text-slate-900 font-bold text-sm mb-1">Mission Critical</p>
                                                <p className="text-slate-500 text-xs leading-relaxed">Necessary for session state and core application architecture.</p>
                                            </div>
                                            <div className="w-12 h-6 bg-slate-200 rounded-full flex items-center px-1 opacity-50 cursor-not-allowed">
                                                <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-6" />
                                            </div>
                                        </div>

                                        {/* Analytics */}
                                        <div
                                            onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${preferences.analytics
                                                ? "bg-blue-50 border-blue-100"
                                                : "bg-white border-slate-100 hover:border-slate-200"
                                                }`}
                                        >
                                            <div className="flex-grow">
                                                <p className="text-slate-900 font-bold text-sm mb-1">Uplink Diagnostics</p>
                                                <p className="text-slate-500 text-xs leading-relaxed">Help the Bureau improve its auditing algorithms via anonymous telemetry.</p>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.analytics ? "bg-blue-600" : "bg-slate-200"
                                                }`}>
                                                <motion.div
                                                    animate={{ x: preferences.analytics ? 24 : 0 }}
                                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSavePreferences}
                                        className="w-full mt-8 py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        Commit Preferences
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Persistent Re-open Toggle */}
            <motion.button
                initial={{ x: -100 }}
                animate={{ x: isVisible ? -100 : 0 }}
                onClick={() => setIsVisible(true)}
                className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-6 z-50 p-4 bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 group"
            >
                <Shield size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest overflow-hidden w-0 group-hover:w-16 transition-all duration-300">
                    Privacy
                </span>
            </motion.button>
        </>
    );
}
