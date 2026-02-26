"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClearance } from "@/context/ClearanceContext";
import { ShieldCheck, Zap, ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useClearance();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate Bureau Auth Protocol
        setTimeout(async () => {
            const success = await login(email, password);
            if (success) {
                router.push("/admin");
            } else {
                setError("AUTHORIZATION FAILED: INVALID CREDENTIALS");
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-blue-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] mb-6">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Bureau <span className="text-blue-500">Oversight</span></h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mt-2">Authorization Required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Identity</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-slate-300 placeholder:text-slate-700"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Access Key</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-slate-300 placeholder:text-slate-700 font-mono tracking-widest"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
                            >
                                <Lock size={14} className="shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{error}</span>
                            </motion.div>
                        )}

                        <button
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${isLoading
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                                }`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest">
                                {isLoading ? 'Decrypting Authority...' : 'Enter Bureau Ops'}
                            </span>
                            {!isLoading && <ArrowRight size={16} />}
                            {isLoading && <Zap size={16} className="animate-spin" />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Global Sovereign Registry — v1.0.4</p>
                        <div className="flex gap-4">
                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-75" />
                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
