"use client";
import SurveyArchitect from '@/components/architect/SurveyArchitect';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function GenesisPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <header className="p-6 border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-between">
                <Link href="/" className="font-black text-xl tracking-tight text-white hover:text-blue-400 transition-colors">
                    S.O.B.
                </Link>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:block">
                    Genesis Module Active
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-6 md:p-12">
                <SurveyArchitect mode="app" />
            </main>

            <Footer />
        </div>
    );
}
