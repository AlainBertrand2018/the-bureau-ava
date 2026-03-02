"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Rocket,
    Activity,
    Lock
} from "lucide-react";

interface ServiceConfig {
    id: string;
    title: string;
    description: string;
    credits: string;
    price: string;
    features: string[];
    accent: string;
    icon: React.ReactNode;
}

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (serviceId: string) => void;
    service: ServiceConfig | null;
    userCredits: number;
}

export default function PaywallModal({ isOpen, onClose, onConfirm, service, userCredits }: PaywallModalProps) {
    const [accepted, setAccepted] = useState(false);

    if (!service) return null;

    const creditsRequired = parseInt(service.credits.replace(/,/g, '')) || 0;
    const hasEnoughCredits = userCredits >= creditsRequired || service.id === 'enterprise';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header Decoration */}
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-${service.accent.includes('emerald') ? 'emerald' : service.accent.includes('blue') ? 'blue' : service.accent.includes('purple') ? 'purple' : 'amber'}-500/50 to-transparent`} />

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-10 p-2"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 md:p-12">
                            {/* Icon & Title */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${service.accent.includes('emerald') ? 'bg-emerald-500/10 text-emerald-500' : service.accent.includes('blue') ? 'bg-blue-500/10 text-blue-500' : service.accent.includes('purple') ? 'bg-purple-500/10 text-purple-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {service.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                            Unlock {service.title}
                                        </h3>
                                        {service.id === 'enterprise' && (
                                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest border border-amber-500/20">
                                                Unrestricted
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Institutional Clearance Required</p>
                                </div>
                            </div>

                            {/* Service Description & Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                        {service.description}
                                    </p>
                                    <div className="space-y-3 pt-4">
                                        {service.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                                                <CheckCircle2 size={12} className="text-slate-600" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization Cost</div>
                                        <div className="text-3xl font-black text-white">
                                            {service.credits} <span className="text-xs text-slate-500 ml-1">Credits</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">Value Estimate: {service.price}</div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-800">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Account Balance</div>
                                        <div className={`text-xl font-black ${hasEnoughCredits ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {userCredits.toLocaleString()} <span className="text-[10px] text-slate-500 ml-1 font-bold">CR available</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acceptance Checkbox */}
                            <div className="mb-8 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 group cursor-pointer" onClick={() => setAccepted(!accepted)}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${accepted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 bg-slate-950'}`}>
                                        {accepted && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[11px] font-black text-white uppercase tracking-tight leading-relaxed">
                                            I understand that this action will consume <span className="text-amber-500">{service.credits} Sovereign Credits</span> from my balance and I authorize the Bureau to initiate the relevant diagnostic sequence.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={() => onConfirm(service.id)}
                                    disabled={!accepted}
                                    className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${accepted
                                        ? "bg-white text-slate-950 hover:bg-emerald-400 shadow-white/10"
                                        : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                                        }`}
                                >
                                    {hasEnoughCredits ? <Lock size={16} /> : <Zap size={16} className="text-emerald-500" />}
                                    {hasEnoughCredits ? "Authorize Mission Deployment" : "Confirm Payment"}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                {!hasEnoughCredits && service.id !== 'enterprise' && (
                                    <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest text-center sm:text-left">
                                        Allocation required to proceed.
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                                    <ShieldCheck size={10} />
                                    Bureau Protocol Verification Active
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
