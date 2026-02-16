"use client";
import React from "react";

interface FooterProps {
    dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ dark = false }) => {
    return (
        <footer className={`w-full py-12 border-t transition-colors duration-700 ${dark
            ? "bg-slate-950/50 border-white/5 text-slate-500"
            : "bg-white border-slate-100 text-slate-400"
            }`}>
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] leading-relaxed">
                    © 2026 Alain Bertrand • The Bureau v2.0 • EST. 2026 • All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
