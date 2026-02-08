"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Target, Users, ShieldAlert, BadgeCheck, BarChart3, GraduationCap, Building2, TrendingUp, MessageSquare, Send, X, ChevronRight } from 'lucide-react';
import Modal from '@/components/Modal';

const SECTORS = [
    {
        title: "Government & Policy",
        icon: <Building2 className="text-primary" />,
        story: "Test policy reception with synthetic citizens. Predict public sentiment and mitigate backlash before official announcements are made.",
        pride: "Approval Index",
        image: "/images/credibility Card 1.webp"
    },
    {
        title: "FMCG & Retail",
        icon: <TrendingUp className="text-primary" />,
        story: "Stop launching products that fail. We stress-test pricing and packaging against synthetic consumers to secure your ROI.",
        pride: "Budget Optimization",
        image: "/images/credibility Card 2.webp"
    },
    {
        title: "Academia & Research",
        icon: <GraduationCap className="text-primary" />,
        story: "Secure your thesis. We validate questionnaire logic and sampling robustness via synthetic pilot studies to guarantee methodological rigor.",
        pride: "Methodology Validation",
        image: "/images/credibility Card 3.webp"
    }
];

export default function Credibility() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id="clients" className="min-h-screen flex items-center bg-slate-50 overflow-hidden py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Industry Stories - The Pride of Success */}
                <div className="mb-32">
                    <div className="max-w-2xl mb-16">
                        <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-4">We Deliver</h2>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[0.95]">
                            Meaningful results for<br />
                            <span className="text-slate-400">Meaningful Missions.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {SECTORS.map((sector, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative h-[450px] bg-slate-50 rounded-[40px] border border-slate-100 p-8 flex flex-col justify-end overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all"
                            >
                                {/* Sector Image */}
                                <img
                                    src={sector.image}
                                    alt={sector.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10 opacity-80" />

                                <div className="absolute top-0 left-0 p-8 z-20">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        {sector.icon}
                                    </div>
                                </div>

                                <div className="relative z-20 text-white">
                                    <span className="text-[10px] font-black tracking-widest text-primary uppercase mb-2 block">{sector.pride}</span>
                                    <h4 className="text-2xl font-black mb-4 tracking-tighter">{sector.title}</h4>
                                    <p className="text-sm text-slate-300 font-medium leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        {sector.story}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-16">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsModalOpen(true)}
                            className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl"
                        >
                            Inquire How <ChevronRight size={16} />
                        </motion.button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Strategic Inquiry Mandate"
                size="md"
            >
                <div className="space-y-6">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Request a formal methodology brief or schedule a simulation dry-run for your specific sector.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 block">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="Director of Operations"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 block">Corporate Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="name@company.mu"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 block">Inquiry Details</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors h-32 resize-none"
                                placeholder="Describe your simulation requirements or campaign goals..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            alert("Inquiry Logged. A Bureau Strategist will contact you within 4 hours.");
                            setIsModalOpen(false);
                        }}
                        className="w-full bg-primary text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        Submit Intent to Bureau <Send size={14} />
                    </button>

                    <p className="text-[10px] text-slate-400 text-center uppercase tracking-tight font-medium">
                        Secure Transmission • ISO 27001 Compliant • 256-bit Encryption
                    </p>
                </div>
            </Modal>
        </section>
    );
}
