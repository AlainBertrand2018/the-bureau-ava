"use client";
import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface FooterProps {
    dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ dark = false }) => {
    return (
        <footer className={`w-full py-20 border-t transition-colors duration-700 ${dark
            ? "bg-slate-950 border-white/5 text-slate-400"
            : "bg-white border-slate-100 text-slate-500"
            }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <span className={`font-black tracking-tight text-xl uppercase ${dark ? "text-white" : "text-slate-900"}`}>
                                THE BUREAU <span className="text-blue-500 font-medium uppercase">WITH AVA</span>
                            </span>
                        </div>
                        <p className="text-[11px] leading-relaxed max-w-sm font-medium opacity-70">
                            We use bespoke AI-powered engines to stress-test survey questionnaires before field work. With our AI-agents, we generate reports and redressment recommendations that are key to guarantee actionable data. Your survey data is processed in real-time and never stored permanently. All audits are confidential.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-10 ${dark ? "text-white" : "text-slate-900"}`}>
                            Survey Optimization Bureau
                        </h4>
                        <ul className="space-y-5 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <li><Link href="#who-its-for" className="hover:text-blue-500 transition-colors">For Whom</Link></li>
                            <li><Link href="#proof" className="hover:text-blue-500 transition-colors">Why Choose AVA</Link></li>
                            <li><Link href="#solution" className="hover:text-blue-500 transition-colors">What We Do</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-blue-500 transition-colors">How We Do</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-10 ${dark ? "text-white" : "text-slate-900"}`}>
                            Contact Us
                        </h4>
                        <ul className="space-y-5 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <li><Link href="/early-adopters" className="hover:text-blue-500 transition-colors">Early Adopters</Link></li>
                            <li><Link href="/investors" className="hover:text-blue-500 transition-colors">Investors</Link></li>
                            <li><Link href="#contact" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-10 ${dark ? "text-white" : "text-slate-900"}`}>
                            Discovery
                        </h4>
                        <ul className="space-y-5 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <li><Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link></li>
                            <li><Link href="#meet-ava" className="hover:text-blue-500 transition-colors">Meet AVA</Link></li>
                            <li><Link href="/genesis" className="hover:text-blue-500 transition-colors">Create Your Survey From Scratch</Link></li>
                        </ul>
                    </div>

                    {/* Column 5 - Legal */}
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-10 ${dark ? "text-white" : "text-slate-900"}`}>
                            Legal
                        </h4>
                        <ul className="space-y-5 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <li><Link href="/terms" className="hover:text-blue-500 transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/cookies" className="hover:text-blue-500 transition-colors">Cookie Policy</Link></li>
                            <li><Link href="/disclaimer" className="hover:text-blue-500 transition-colors">General Disclaimer</Link></li>
                            <li><Link href="/pii" className="hover:text-blue-500 transition-colors">PII Usage Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={`pt-12 border-t ${dark ? "border-white/5" : "border-slate-100"} text-center`}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">
                        © 2026 <Link href="https://www.linkedin.com/in/alainbertrand/" target="_blank" className="hover:text-blue-500 transition-colors underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500">Alain Bertrand</Link> • The Bureau v2.0 • All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
