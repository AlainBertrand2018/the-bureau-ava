"use client";
import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingFooter() {
    const { t } = useLanguage();

    return (
        <footer className="border-t border-slate-100 py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-sm">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-slate-900 font-black text-lg tracking-tight">AVA</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">by The Bureau</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
                            Architecting success before launch. The world's first AI-powered structural survey audit system.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">{t.nav.optimization_bureau}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/landing#who-its-for" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.for_whom}</Link></li>
                            <li><Link href="/landing#painpoints" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.why_ava}</Link></li>
                            <li><Link href="/landing#solution" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.what_we_do}</Link></li>
                            <li><Link href="/landing#how-it-works" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.how_we_do}</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">{t.nav.contact_us}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/early-adopters" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.early_adopters}</Link></li>
                            <li><Link href="/investors" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.investors}</Link></li>
                            <li><Link href="/landing#contact" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.contact_us}</Link></li>
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Discovery</h4>
                        <ul className="space-y-4">
                            <li><Link href="/blog" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.blog}</Link></li>
                            <li><Link href="/landing#meet-ava" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.meet_ava}</Link></li>
                            <li><Link href="/landing#genesis" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t.nav.create_scratch}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[9px] text-slate-400 font-medium max-w-sm text-center md:text-left leading-relaxed">
                        {t.footer.disclaimer}
                    </p>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} The Bureau · Ebène, Mauritius
                    </div>
                </div>
            </div>
        </footer>
    );
}
