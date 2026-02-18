"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { t } = useLanguage();
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const menuItems = [
        {
            title: t.nav.optimization_bureau,
            href: "#",
            subItems: [
                { title: t.nav.for_whom, href: "/landing#who-its-for" },
                { title: t.nav.why_ava, href: "/landing#painpoints" },
                { title: t.nav.what_we_do, href: "/landing#solution" },
                { title: t.nav.how_we_do, href: "/landing#how-it-works" },
            ]
        },
        { title: t.nav.meet_ava, href: "/landing#meet-ava" },
        { title: t.nav.create_scratch, href: "/landing#genesis" },
        { title: t.nav.pricing, href: "/landing#pricing" },
        {
            title: t.nav.contact_us,
            href: "/landing#contact", // Map general contact to contact section
            subItems: [
                { title: t.nav.early_adopters, href: "/early-adopters" },
                { title: t.nav.investors, href: "/investors" },
            ]
        },
        { title: t.nav.blog, href: "/blog" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-sm group-hover:shadow-blue-500/20 transition-all">
                        <Sparkles size={14} className="text-white" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-900 font-black text-lg tracking-tight uppercase">The Bureau</span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">WITH AVA</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-6">
                    {menuItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative group h-full py-2"
                            onMouseEnter={() => item.subItems && setOpenDropdown(item.title)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                href={item.href}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
                            >
                                {item.title}
                                {item.subItems && (
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === item.title ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {item.subItems && openDropdown === item.title && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 z-50"
                                    >
                                        {item.subItems.map((sub, sIdx) => (
                                            <Link
                                                key={sIdx}
                                                href={sub.href}
                                                className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all"
                                            >
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center">
                    <button
                        onClick={() => router.push("/mission-control")}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 active:scale-95"
                    >
                        <Zap size={12} />
                        {t.nav.open_lab}
                    </button>
                    <div className="ml-4 pl-4 border-l border-slate-100">
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
