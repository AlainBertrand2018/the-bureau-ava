"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useOS, AppId } from '@/context/OSContext';
import { Globe, Cpu, Microscope, FileText, Sparkles, Settings as SettingsIcon } from 'lucide-react';

const DOCK_ITEMS: { id: AppId; icon: any; label: string; color: string; description: string }[] = [
    { id: 'sentinel', icon: Globe, label: 'Sentinel', color: 'emerald', description: 'Stage your next market research instrument. Define the target market, objectives, and audience.' },
    { id: 'genesis', icon: FileText, label: 'Genesis', color: 'amber', description: 'Design logic flows, manage complex routing, and craft the ultimate field instrument.' },
    { id: 'lab', icon: Microscope, label: 'The Lab', color: 'violet', description: 'Simulate synthetic data flows and audit questionnaire integrity before going live.' },
    { id: 'interpreter', icon: Cpu, label: 'Interpreter', color: 'blue', description: 'Analyze raw verbatim data and extract core thematic intelligence.' },
    { id: 'bureau', icon: Sparkles, label: 'The Bureau', color: 'slate', description: 'Return to the public-facing gateway and standard methodologies.' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', color: 'slate', description: 'Customize your OS personalization, appearance, and workspace mechanics.' },
];

const Dock: React.FC = () => {
    const { launchApp, openWindows, activeApp } = useOS();

    const getIconGradient = (color: string) => {
        switch (color) {
            case 'emerald': return 'from-emerald-400 to-emerald-600';
            case 'amber': return 'from-amber-300 to-amber-500';
            case 'violet': return 'from-violet-400 to-violet-600';
            case 'blue': return 'from-sky-400 to-blue-600';
            case 'slate': return 'from-slate-300 to-slate-500';
            default: return 'from-white to-slate-400';
        }
    };

    return (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] md:w-auto">
            <div className="flex items-center justify-center gap-2 md:gap-4 px-3 md:px-5 py-2 md:py-3 rounded-[2rem] md:rounded-[2.5rem] bg-black/30 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {DOCK_ITEMS.map((app) => {
                    const isOpen = openWindows.some(w => w.id === app.id);
                    const isActive = activeApp === app.id;
                    const Icon = app.icon;

                    return (
                        <div key={app.id} className="relative group">
                            <motion.button
                                whileHover={{ scale: 1.25, y: -12 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => launchApp(app.id)}
                                className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 relative
                  ${isActive ? 'shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/20' : ''}
                `}
                            >
                                {/* Modern Icon Base */}
                                <div className={`absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${getIconGradient(app.color)} opacity-10 group-hover:opacity-20 transition-opacity`} />
                                <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm" />

                                {/* Glowing Core */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-40 bg-gradient-to-br ${getIconGradient(app.color)} blur-xl transition-opacity`} />

                                <Icon className={`w-5 h-5 md:w-7 md:h-7 relative z-10 transition-all duration-500
                  ${isActive ? 'text-white scale-110' : 'text-white/60 group-hover:text-white group-hover:scale-110'}
                `} strokeWidth={1.5} />
                            </motion.button>

                            {/* Detailed Tooltip - Hidden on mobile */}
                            <div className="hidden md:flex absolute -top-24 left-1/2 -translate-x-1/2 px-4 py-3 min-w-[200px] max-w-[250px] rounded-xl bg-black/80 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none shadow-xl flex flex-col items-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-1">
                                    {app.label}
                                </span>
                                <span className="text-[10px] text-white/50 leading-relaxed">
                                    {app.description}
                                </span>
                            </div>

                            {/* Active Indicator Line */}
                            {isOpen && (
                                <motion.div
                                    layoutId={`active-${app.id}`}
                                    className="absolute -bottom-1.5 md:-bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_10px_white,0_0_20px_white]"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dock;
