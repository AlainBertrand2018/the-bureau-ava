"use client";
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 py-20 relative overflow-hidden">
            {/* Background Texture similar to Hero */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">B</div>
                            <span className="text-sm font-black tracking-tighter text-white uppercase">THE BUREAU</span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                            The only survey simulation engine grounded in local Mauritian Census data. We empower decision-makers with synthetic certainty.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-black tracking-widest text-primary uppercase mb-2">Protocol</h4>
                        <Link href="#methodology" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Scientific Whitepaper</Link>
                        <Link href="#services" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Mandates & Pricing</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-black tracking-widest text-primary uppercase mb-2">Connect</h4>
                        <Link href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">LinkedIn</Link>
                        <Link href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Contact Strategy</Link>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[11px] font-black text-slate-500 tracking-widest uppercase">
                        © 2026 The Bureau • v2.0.4-beta // Confidential Computing Enabled • Powered by Business Studio AI
                    </p>
                    <div className="flex gap-8 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Methodology IP</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
