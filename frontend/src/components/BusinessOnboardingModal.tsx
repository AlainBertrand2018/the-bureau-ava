"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe, Users, Send, CheckCircle2, ClipboardCheck } from "lucide-react";

interface BusinessOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BusinessOnboardingModal({ isOpen, onClose }: BusinessOnboardingModalProps) {
    const [formData, setFormData] = useState({
        company: "",
        industry: "",
        size: "",
        objective: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 2500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
                    >
                        {isSuccess ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-[#CC5833]/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={32} className="text-[#CC5833]" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase">Onboarding Initiated</h3>
                                <p className="text-slate-500 font-medium">Your organizational profile is being calibrated. An advisor will contact you within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-[#2E4036]/5">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#2E4036] uppercase tracking-tight">Business Onboarding</h2>
                                        <p className="text-[13px] font-bold text-[#CC5833] uppercase tracking-widest mt-1">Institutional Integration Protocol</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Company Entity</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.company}
                                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833] transition-all pl-12"
                                                    placeholder="Global Research Corp"
                                                />
                                                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Industry</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.industry}
                                                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833] transition-all pl-12"
                                                        placeholder="FMCG / Tech"
                                                    />
                                                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Organization Size</label>
                                                <div className="relative">
                                                    <select
                                                        required
                                                        value={formData.size}
                                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833] transition-all pl-12 appearance-none"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="1-50">1-50 members</option>
                                                        <option value="51-200">51-200 members</option>
                                                        <option value="201-1000">201-1000 members</option>
                                                        <option value="1000+">1000+ members</option>
                                                    </select>
                                                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Primary Objective</label>
                                            <div className="relative">
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={formData.objective}
                                                    onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833] transition-all pl-12 resize-none"
                                                    placeholder="Structural survey audit / Synthetic panel access..."
                                                />
                                                <ClipboardCheck size={16} className="absolute left-3.5 top-5 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-[#2E4036] text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#CC5833] transition-all shadow-lg shadow-[#2E4036]/20 flex items-center justify-center gap-2 group disabled:opacity-70"
                                    >
                                        {isSubmitting ? "Initiating..." : "Initiate Onboarding"}
                                        {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
