"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Linkedin, MessageSquare, Send, CheckCircle2, Shield, Globe, Briefcase } from "lucide-react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate secure submission protocol
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setFormData({ name: "", email: "", phone: "", company: "", message: "" });
            onClose();
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-xl"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-2xl bg-[#1A1A1A] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5"
                    >
                        {/* Aesthetic Sidebar (Decorative) */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC5833]/10 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2E4036]/10 blur-[60px] rounded-full -ml-16 -mb-16 pointer-events-none" />

                        {isSuccess ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-[#2E4036]/20 rounded-3xl flex items-center justify-center mb-4 border border-[#2E4036]/30"
                                >
                                    <CheckCircle2 size={40} className="text-[#CC5833]" />
                                </motion.div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Transmission Received</h3>
                                <p className="text-white/40 font-medium max-w-md">
                                    Your enquiry has been logged in The Bureau's secure ledger. AVA is currently processing your parameters. Expect a response via secure channels.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row">
                                {/* Left Info Panel */}
                                <div className="md:w-[220px] bg-[#2E4036]/5 p-10 border-r border-white/5 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-[#2E4036] flex items-center justify-center mb-8">
                                            <Shield size={20} className="text-[#CC5833]" />
                                        </div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                                            Institutional <br /> Enquiry
                                        </h2>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                                            Establish direct communication with The Bureau's technical lead.
                                        </p>
                                    </div>
                                    <div className="space-y-4 pt-10">
                                        <div className="flex items-center gap-3 text-white/20 hover:text-[#CC5833] transition-colors cursor-pointer">
                                            <Globe size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Global Ops</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/20 hover:text-[#CC5833] transition-colors cursor-pointer">
                                            <Briefcase size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">HQ Sector 7</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Section */}
                                <div className="flex-1 p-10 md:p-12 relative">
                                    <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors group">
                                        <X size={20} className="text-white/20 group-hover:text-white" />
                                    </button>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#CC5833] ml-1">Identity</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/50 transition-all placeholder:text-white/10"
                                                        placeholder="Name / Entity"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#CC5833] ml-1">Communication</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/50 transition-all placeholder:text-white/10"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#CC5833] ml-1">Organization</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.company}
                                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/50 transition-all placeholder:text-white/10"
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#CC5833] ml-1">Secure Line</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/50 transition-all placeholder:text-white/10"
                                                        placeholder="Phone Number (Optional)"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-[#CC5833] ml-1">Mission Query</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CC5833]/20 focus:border-[#CC5833]/50 transition-all placeholder:text-white/10 resize-none"
                                                    placeholder="Define your enquiry parameters..."
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-5 bg-[#CC5833] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#B34D2D] transition-all shadow-xl shadow-[#CC5833]/10 flex items-center justify-center gap-4 group disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                                    Syncing...
                                                </span>
                                            ) : (
                                                <>
                                                    <span>Submit Enquiry</span>
                                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                                            Secure E2E Encrypted Transmission Mode Active
                                        </p>
                                    </form>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
