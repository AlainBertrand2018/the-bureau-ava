"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, AppId } from '@/context/OSContext';
import { X, Minus, Square, ExternalLink } from 'lucide-react';

interface WindowProps {
    id: AppId;
    title: string;
    children: React.ReactNode;
    isMaximized: boolean;
    zIndex: number;
}

const Window: React.FC<WindowProps> = ({ id, title, children, isMaximized, zIndex }) => {
    const { closeApp, maximizeApp, focusApp } = useOS();

    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const finalMaximized = isMaximized || isMobile;

    const handleBodyClick = () => {
        if (!finalMaximized) {
            maximizeApp(id);
        }
        focusApp(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? 50 : 20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                width: finalMaximized ? '100vw' : '65vw',
                height: finalMaximized ? 'calc(100vh - 2rem)' : '55vh',
                top: finalMaximized ? '2rem' : '15vh',
                left: finalMaximized ? 0 : '17.5vw',
                borderRadius: finalMaximized ? 0 : '1.25rem',
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className={`fixed bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col group/window ${finalMaximized ? 'z-[1002]' : ''}`}
            style={{ zIndex: finalMaximized ? 1002 : zIndex }}
            onMouseDown={() => focusApp(id)}
        >
            {/* Window Header */}
            <div className="h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/5 select-none">
                <div className="flex items-center gap-2">
                    <div className="flex gap-2 min-w-[80px]">
                        <button
                            onClick={(e) => { e.stopPropagation(); closeApp(id); }}
                            className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group/btn transition-colors"
                        >
                            <X className="w-2 h-2 text-black opacity-0 group-hover/btn:opacity-100" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); if (finalMaximized && !isMobile) maximizeApp(id); }}
                            className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center group/btn transition-colors"
                        >
                            <Minus className="w-2 h-2 text-black opacity-0 group-hover/btn:opacity-100" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); if (!isMobile) maximizeApp(id); }}
                            className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center group/btn transition-colors"
                        >
                            <Square className="w-2 h-2 text-black opacity-0 group-hover/btn:opacity-100" />
                        </button>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover/window:text-white/70 transition-colors truncate max-w-[150px]">
                        {title}
                    </span>
                </div>
            </div>

            {/* Window Content */}
            <div
                className="flex-1 overflow-hidden relative bg-black/40 cursor-default"
                onClick={handleBodyClick}
            >
                <div className={`w-full h-full ${!finalMaximized ? 'pointer-events-none' : ''}`}>
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

export default Window;
