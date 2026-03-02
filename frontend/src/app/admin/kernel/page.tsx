"use client";
import React from 'react';
import PythonInterpreterClient from '@/components/PythonInterpreterClient';
import { Terminal, ShieldAlert, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminKernelPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 space-y-8">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Terminal size={16} className="text-emerald-500" />
                            <h1 className="text-2xl font-black text-white tracking-tight uppercase">System Kernel</h1>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Direct Python Access — High Privilege Environment</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">
                        Administrative Lockdown Active
                    </span>
                </div>
            </div>

            {/* Main Console Container */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-black text-lg">AVA Intelligence Engine</h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Neural Logic Interface v3.2.0</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-8 bg-black/40">
                        <PythonInterpreterClient />
                    </div>
                </div>
            </div>
        </div>
    );
}
