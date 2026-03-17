"use client";
import React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, ShieldCheck, Activity } from 'lucide-react';

interface FooterProps {
    dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ dark = true }) => {
    return (
        <footer className="w-full py-24 md:py-32 bg-[#1A1A1A] border-t border-white/5 relative overflow-hidden">
            {/* Background Data Stream */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(#F2F0E9 1px, transparent 1px)`,
                    backgroundSize: '48px 48px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#CC5833] flex items-center justify-center shadow-lg shadow-[#CC5833]/20">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <span className="font-heading font-black tracking-tighter text-2xl uppercase text-[#F2F0E9]">
                                THE BUREAU <span className="text-[#CC5833] font-medium lowercase">with AVA.</span>
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed max-w-sm font-sans text-[#F2F0E9]/40 uppercase tracking-widest font-bold">
                            // Bespoke AI-powered engines calibrate survey instrumentation pre-fieldwork. AVA orchestrates redundant verification logic to isolate bias and guarantee boardroom-ready data. All audits are conducted on a Zero-PII protocol cluster.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 className="font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-10 text-[#CC5833]">
                            Protocol_Links
                        </h4>
                        <ul className="space-y-4 font-heading text-[11px] font-bold uppercase tracking-widest text-[#F2F0E9]/60">
                            <li><Link href="/about" className="hover:text-[#CC5833] transition-colors">About The Bureau</Link></li>
                            <li><Link href="/#who-its-for" className="hover:text-[#CC5833] transition-colors">For Whom</Link></li>
                            <li><Link href="/#proof" className="hover:text-[#CC5833] transition-colors">Why Choose AVA</Link></li>
                            <li><Link href="/#solution" className="hover:text-[#CC5833] transition-colors">The Process</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h4 className="font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-10 text-[#CC5833]">
                            Intelligence
                        </h4>
                        <ul className="space-y-4 font-heading text-[11px] font-bold uppercase tracking-widest text-[#F2F0E9]/60">
                            <li><Link href="/blog" className="hover:text-[#CC5833] transition-colors">Blog Feed</Link></li>
                            <li><Link href="/#philosophy" className="hover:text-[#CC5833] transition-colors">Meet AVA</Link></li>
                            <li><Link href="/#genesis" className="hover:text-[#CC5833] transition-colors">Genesis Suite</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 - Legal */}
                    <div>
                        <h4 className="font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-10 text-[#CC5833]">
                            Compliance
                        </h4>
                        <ul className="space-y-4 font-heading text-[11px] font-bold uppercase tracking-widest text-[#F2F0E9]/60">
                            <li><Link href="/terms" className="hover:text-[#CC5833] transition-colors">Terms Cluster</Link></li>
                            <li><Link href="/cookies" className="hover:text-[#CC5833] transition-colors">Cookie Node</Link></li>
                            <li><Link href="/disclaimer" className="hover:text-[#CC5833] transition-colors">Disclaimers</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2F0E9]/40">
                            © 2026 <Link href="https://www.linkedin.com/in/alainbertrand/" target="_blank" className="text-[#CC5833] hover:underline underline-offset-4 decoration-[#CC5833]/30">Alain Bertrand</Link> — The Bureau v2.4.1
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-[#F2F0E9]/20">
                            All Rights Reserved // Institutional Intelligence Division
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#F2F0E9]/30">
                        <span className="flex items-center gap-3">
                            <Activity size={12} className="text-[#CC5833]" />
                            System Audit: <time dateTime="2026-02-22T21:21:45+04:00">FEB 22, 2026</time>
                        </span>
                        <span className="hidden md:block opacity-20">|</span>
                        <span className="flex items-center gap-3">
                            <ShieldCheck size={12} className="text-[#CC5833]" />
                            Dossier_Status: Validated
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
