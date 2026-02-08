"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    showBackdrop?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', showBackdrop = true }: ModalProps) {
    const maxWidthClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-4xl' : 'max-w-2xl';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {showBackdrop && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                    )}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${maxWidthClass} bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden`}
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tighter">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={18} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-full text-[10px] font-black tracking-widest text-slate-500 hover:text-slate-700 transition-colors uppercase"
                            >
                                Close
                            </button>
                            <button className="bg-primary text-white px-8 py-2 rounded-full text-[10px] font-black tracking-widest hover:bg-blue-700 transition-all uppercase shadow-lg shadow-blue-500/20">
                                Contact Strategy Team
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
