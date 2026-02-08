"use client";
import { motion } from 'framer-motion';
import { AlertTriangle, Microscope, Cpu, CheckCircle2 } from 'lucide-react';

const PLANS = [
    {
        name: "Scientific Stress Test",
        description: "The emergency audit. Identify critical phrasing errors and demographic blindspots before fieldwork.",
        features: ["n=50 Agents", "3-Day Turnaround", "Sentiment Risk Analysis", "Phasing Heatmaps"],
        price: "Rs 15,000",
        icon: <AlertTriangle className="text-amber-500" size={24} />,
        popular: false
    },
    {
        name: "Synthetic Dry-Run",
        description: "Our flagship mandate. A full-scale simulation of your market launch using complex cross-tabulation.",
        features: ["n=250 Agents", "Census Weighted", "Price Elasticity Testing", "Objection Clustering", "Executive Review"],
        price: "Rs 45,000",
        icon: <Microscope className="text-primary" size={24} />,
        popular: true
    },
    {
        name: "Optimal Design Mandate",
        description: "End-to-end structural optimization. We iterate your survey design until it hits 90%+ simulation accuracy.",
        features: ["n=1,000 Simulations", "Unlimited Iterations", "Dedicated AI Strategist", "API Integration", "Weekly Benchmarking"],
        price: "Contact Bureau",
        icon: <Cpu className="text-white" size={24} />,
        popular: false
    }
];

export default function Services() {
    return (
        <section id="services" className="min-h-screen flex items-center bg-slate-950 py-24 relative overflow-hidden">
            {/* Background Texture similar to Hero */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center max-w-2xl mx-auto mb-20 relative z-10">
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-6 underline underline-offset-8 decoration-2">Premium Mandates</h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
                        We Deliver <span className="text-primary">Clarity.</span><br />
                        Not Just Numbers.
                    </h3>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Choose the level of certainty your project requires. Every mandate includes a signed certificate of simulation rigor.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-10 rounded-[40px] border relative transition-all duration-500 z-10 ${plan.popular ? 'bg-slate-900 border-primary/40 shadow-2xl shadow-blue-500/10 scale-105' : 'bg-slate-900/40 border-white/5 hover:border-white/20'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black tracking-[0.2em] px-6 py-2 rounded-full uppercase shadow-lg shadow-blue-500/20">
                                    Highly Requested
                                </div>
                            )}

                            <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl w-fit">{plan.icon}</div>
                            <h4 className="text-2xl font-black text-white mb-4 tracking-tight">{plan.name}</h4>
                            <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{plan.description}</p>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                        <CheckCircle2 size={16} className="text-primary shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
                                <div className="text-3xl font-black text-white tracking-tighter">{plan.price}</div>
                                <button className={`w-full py-5 rounded-full font-black text-xs tracking-widest uppercase transition-all active:scale-95 ${plan.popular ? 'bg-primary text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20' : 'bg-white text-slate-950 hover:bg-slate-100'}`}>
                                    Secure Mandate
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
