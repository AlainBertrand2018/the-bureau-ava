"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Coins, ArrowRight, ShieldCheck, CircleDollarSign } from 'lucide-react';
import { useClearance } from '@/context/ClearanceContext';

interface PaywallOverlayProps {
    isLocked: boolean;
    onUnlock: () => void;
    cost?: number;
    title?: string;
    description?: string;
}

export const PaywallOverlay: React.FC<PaywallOverlayProps> = ({
    isLocked,
    onUnlock,
    cost = 10,
    title = "High-Resolution Disclosure Required",
    description = "This intelligence report contains proprietary Bureau insights. Expenditure of mission credits is required to decrypt the full payload."
}) => {
    const { credits, spendCredits } = useClearance();
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleUnlock = async () => {
        setIsProcessing(true);
        const success = await spendCredits(cost);
        if (success) {
            onUnlock();
        } else {
            alert("Insufficient mission credits. Contact the Conductor for an allocation.");
        }
        setIsProcessing(false);
    };

    if (!isLocked) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden"
        >
            {/* The Blur Layer - This sits on top of the content but below the modal */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-md w-full bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[2.5vw] p-8 md:p-12 shadow-2xl text-center flex flex-col items-center gap-6"
            >
                {/* Visual Identity */}
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 relative mb-2">
                    <Lock className="text-emerald-400 w-8 h-8" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20"
                    />
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Credit Badge */}
                <div className="px-6 py-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4 my-2">
                    <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-500" />
                        <span className="text-2xl font-black text-white italic">{cost}</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="text-left">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Your Balance</div>
                        <div className="text-sm font-bold text-emerald-400">{credits} Credits</div>
                    </div>
                </div>

                <button
                    onClick={handleUnlock}
                    disabled={isProcessing}
                    className="group relative w-full h-14 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                            <>
                                Decrypt Report
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </div>
                </button>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">
                    <ShieldCheck className="w-3 h-3" />
                    End-to-End Encrypted Delivery
                </div>
            </motion.div>
        </motion.div>
    );
};
