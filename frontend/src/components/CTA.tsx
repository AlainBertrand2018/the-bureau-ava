"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, ShieldAlert, ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section id="rigor" className="min-h-screen flex items-center bg-slate-950 relative overflow-hidden py-24">
            {/* Background Texture similar to Hero */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Methodology Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                    {[
                        { icon: <Target className="text-white" size={28} />, title: "Statistical Rigor", text: "We don't use 'random' agents. Every persona is weighted against the 2022 Census for age, income, and geographical distribution." },
                        { icon: <Users className="text-white" size={28} />, title: "Psychographic Injection", text: "Our agents aren't just data points—they have histories, biases, and fears. They react to your wording like real human beings." },
                        { icon: <ShieldAlert className="text-white" size={28} />, title: "Privacy By Design", text: "Zero PII. Zero cookies. 100% synthetic. Test your most sensitive corporate strategies without exposing them to public panels." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="flex flex-col items-center md:items-start text-center md:text-left group"
                        >
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-sm transition-transform group-hover:scale-110 duration-500">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{item.title}</h4>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* The Power CTA Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-[#0046FF] rounded-[40px] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-blue-500/20"
                >
                    {/* Abstract Background Detail */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute right-0 bottom-0 opacity-10 pointer-events-none"
                    >
                        <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="150" cy="150" r="100" stroke="white" strokeWidth="2" strokeDasharray="10 10" />
                            <circle cx="150" cy="150" r="70" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
                        </svg>
                    </motion.div>

                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-[1.1]"
                        >
                            Ready to secure your certainty?
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-blue-100 font-bold text-lg"
                        >
                            Join 50+ Mauritian brands who never launch without an Audit.
                        </motion.p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-[#0046FF] px-10 py-5 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-slate-50 transition-all shadow-xl whitespace-nowrap"
                        >
                            SECURE MANDATE
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all whitespace-nowrap"
                        >
                            INSTANT AUDIT
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
