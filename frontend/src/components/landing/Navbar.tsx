"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, ChevronDown, Menu, X, UserCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

interface NavbarProps {
    onContactClick?: () => void;
    onOnboardingClick?: () => void;
}

export default function Navbar({ onContactClick, onOnboardingClick }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        {
            title: "Welcome",
            href: "/",
            subItems: [
                { title: "To The Bureau", href: "/#hero" },
                { title: "What are We", href: "/#whatisthebureau" },
                { title: "Who is it For", href: "/#who-its-for" },
                { title: "What We Solve", href: "/#painpoints" },
                { title: "How We Do", href: "/#solution" },
                { title: "About AVA", href: "/#philosophy" },
                { title: "How it Works", href: "/#how-it-works" },
                { title: "System FAQ", href: "/#faq" },
            ]
        },
        {
            title: "About",
            href: "/about",
            subItems: [
                { title: "The Bureau", href: "/about" },
                { title: "Meet AVA", href: "/ava" },
                { title: "Our Agents", href: "/agents" },
            ]
        },
        { title: "FAQ", href: "/faq" },
        { title: "Pricing", href: "/#pricing" },
        {
            title: "Blog",
            href: "/blog",
            subItems: [
                { title: "Network Feed", href: "/blog" },
                { title: "Newsfeed", href: "/news" },
                { title: "Glossary", href: "/glossary" },
            ]
        },
        {
            title: "Contact",
            href: "#",
            subItems: [
                { title: "Contact Us", onClick: onContactClick },
                { title: "Business On-boarding", onClick: onOnboardingClick },
                { title: "Investor's Channel", href: "/investors-channel" },
            ]
        }
    ];

    const scrollToId = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
        if (href.includes("#")) {
            const [base, id] = href.split("#");

            // If we are on the page already, just scroll
            if (pathname === base || (base === "/" && pathname === "/") || (base === "" && id)) {
                e.preventDefault();
                const element = document.getElementById(id);
                if (element) {
                    const navHeight = scrolled ? 72 : 96;
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: { y: element, offsetY: navHeight },
                        ease: "power3.inOut"
                    });
                    setMobileMenuOpen(false);
                    setOpenDropdown(null);
                }
            }
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-mono ${scrolled
                ? "py-3 bg-[#F2F0E9]/80 backdrop-blur-2xl border-b border-[#2E4036]/5"
                : "py-6 bg-transparent"
                }`}
        >
            <div className="max-w-[95rem] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-[#2E4036] flex items-center justify-center shadow-2xl shadow-[#2E4036]/20 group-hover:scale-110 transition-transform">
                        <Sparkles size={16} className="text-[#CC5833]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#2E4036] font-black text-xs sm:text-sm tracking-[0.2em] uppercase leading-none">The Bureau</span>
                        <span className="text-[#2E4036]/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 hidden sm:block">Instrument Validation</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    {menuItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative group py-2"
                            onMouseEnter={() => item.subItems && setOpenDropdown(item.title)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                href={item.href}
                                onClick={(e) => scrollToId(e, item.href)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#2E4036]/60 hover:text-[#CC5833] transition-all"
                            >
                                {item.title}
                                {item.subItems && (
                                    <ChevronDown size={10} className={`transition-transform duration-300 ${openDropdown === item.title ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            <AnimatePresence>
                                {item.subItems && openDropdown === item.title && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: "circOut" }}
                                        className="absolute top-full left-[-20px] mt-2 min-w-[240px] bg-[#F2F0E9] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#2E4036]/10 overflow-hidden py-3 z-50"
                                    >
                                        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                                        <div className="relative z-10">
                                            {item.subItems.map((sub, sIdx) => {
                                                if (sub.onClick) {
                                                    return (
                                                        <button
                                                            key={sIdx}
                                                            onClick={() => {
                                                                sub.onClick!();
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="w-full text-left block px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#2E4036]/60 hover:text-[#CC5833] hover:bg-[#2E4036]/5 transition-all"
                                                        >
                                                            {sub.title}
                                                        </button>
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.href || "#"}
                                                        onClick={(e) => scrollToId(e, sub.href || "#")}
                                                        className="block px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#2E4036]/60 hover:text-[#CC5833] hover:bg-[#2E4036]/5 transition-all"
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/os"
                        target="_blank"
                        className="btn-magnetic hidden lg:flex px-6 py-2.5 bg-[#2E4036] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#CC5833] shadow-lg shadow-[#2E4036]/10"
                    >
                        <Zap size={14} className="text-[#CC5833] group-hover:text-white" />
                        Playground
                    </Link>

                    <button
                        className="p-3 text-[#2E4036]/60 hover:text-[#CC5833] transition-colors"
                        title="Login / Signup"
                    >
                        <UserCircle size={24} />
                    </button>

                    <button
                        className="lg:hidden p-3 text-[#2E4036]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[90] bg-[#F2F0E9] lg:hidden flex flex-col p-6 sm:p-10 pt-[calc(6rem+env(safe-area-inset-top))]"
                    >
                        <div className="space-y-6 overflow-y-auto pb-20">
                            {menuItems.map((item, idx) => (
                                <div key={idx} className="space-y-4">
                                    <Link
                                        href={item.href}
                                        onClick={(e) => {
                                            if (item.href.includes("#")) {
                                                scrollToId(e, item.href);
                                            } else if (!item.subItems) {
                                                setMobileMenuOpen(false);
                                            }
                                        }}
                                        className="block text-2xl font-black uppercase tracking-widest text-[#2E4036]"
                                    >
                                        {item.title}
                                    </Link>
                                    {item.subItems && (
                                        <div className="pl-4 space-y-4 border-l-2 border-[#2E4036]/10">
                                            {item.subItems.map((sub, sIdx) => (
                                                <button
                                                    key={sIdx}
                                                    onClick={(e) => {
                                                        if (sub.onClick) {
                                                            sub.onClick();
                                                            setMobileMenuOpen(false);
                                                        } else if (sub.href) {
                                                            scrollToId(e as any, sub.href);
                                                            if (!sub.href.includes("#")) setMobileMenuOpen(false);
                                                        }
                                                    }}
                                                    className="block text-sm font-bold uppercase tracking-widest text-[#2E4036]/60 hover:text-[#CC5833]"
                                                >
                                                    {sub.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-10">
                            <Link
                                href="/os"
                                target="_blank"
                                className="w-full justify-center btn-magnetic px-8 py-5 bg-[#2E4036] text-white text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-3"
                            >
                                <Zap size={18} className="text-[#CC5833]" />
                                Start Auditing
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
