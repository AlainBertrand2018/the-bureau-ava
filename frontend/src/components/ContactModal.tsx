"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Linkedin, MessageSquare, Send, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setFormData({ name: "", email: "", phone: "", linkedin: "", message: "" });
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
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Message Received</h3>
                                <p className="text-slate-500 font-medium">We'll be in touch shortly to discuss your custom access requirements.</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">Contact The Bureau</h2>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Access & Custom Solutions</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Full Name *</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all pl-10"
                                                    placeholder="John Doe"
                                                />
                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Email *</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all pl-10"
                                                        placeholder="john@company.com"
                                                    />
                                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Phone *</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all pl-10"
                                                        placeholder="+123..."
                                                    />
                                                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">LinkedIn URL *</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="url"
                                                    value={formData.linkedin}
                                                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all pl-10"
                                                    placeholder="https://linkedin.com/in/..."
                                                />
                                                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Message *</label>
                                            <div className="relative">
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all pl-10 resize-none"
                                                    placeholder="Tell us about your organization's needs..."
                                                />
                                                <MessageSquare size={16} className="absolute left-3.5 top-5 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group disabled:opacity-70"
                                    >
                                        {isSubmitting ? "Sending..." : "Submit Request"}
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
