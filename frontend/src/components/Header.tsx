"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/20 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">B</div>
                    <span className="text-lg font-black tracking-tighter text-white">THE BUREAU</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                    <Link href="#methodology" className="hover:text-blue-400 transition-colors">Methodology</Link>
                    <Link href="#rigor" className="hover:text-blue-400 transition-colors">Rigor</Link>
                    <Link href="#clients" className="hover:text-blue-400 transition-colors">Deliveries</Link>
                    <Link href="#services" className="hover:text-blue-400 transition-colors">Mandates</Link>
                    <Link href="#intelligence" className="hover:text-blue-400 transition-colors">Intelligence</Link>
                </nav>

                <div className="flex gap-4">
                    <button className="text-white border border-white/10 px-6 py-2 rounded-full text-[11px] font-bold tracking-widest transition-all hover:bg-white/5 active:scale-95 uppercase">
                        Login
                    </button>
                    <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-full text-[11px] font-bold tracking-widest transition-all hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 uppercase">
                        Stress Test Now
                    </button>
                </div>
            </div>
        </header>
    );
}
