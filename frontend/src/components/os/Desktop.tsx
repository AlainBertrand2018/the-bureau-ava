"use client";
import React from 'react';
import { useOS } from '@/context/OSContext';
import Window from './Window';
import Dock from './Dock';
import { CreditGauge } from './CreditGauge';
import { WidgetContainer, TimeWidget, CountryWidget, BureauFeedWidget, IntelligencePulseWidget } from './Widgets';
import Onboarding from './Onboarding';
import AskAva from './AskAva';
import { HelpCircle, Book, Users } from 'lucide-react';
import { useClearance } from '@/context/ClearanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const Desktop: React.FC = () => {
    const { openWindows, wallpaper, triggerHandover } = useOS();
    const { isAuthenticated } = useClearance();
    const hasMaximizedWindow = openWindows.some(w => w.isMaximized && !w.isMinimized);

    const [time, setTime] = React.useState<string | null>(null);

    React.useEffect(() => {
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const getWallpaperStyles = () => {
        switch (wallpaper) {
            case 'sentient-emerald':
                return 'bg-[#060B18] bg-gradient-to-br from-[#060B18] via-[#060B18] to-emerald-900/20';
            case 'clinical-white':
                return 'bg-slate-50 bg-gradient-to-br from-slate-50 via-white to-blue-50';
            case 'cyber-grid':
                return 'bg-[#0a0a0a] bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]';
            case 'onyx-gold':
                return 'bg-stone-950 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-900/10';
            default:
                return 'bg-[#060B18]';
        }
    };

    return (
        <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${getWallpaperStyles()}`}>
            {/* Ambient Lighting */}
            <div className="absolute bottom-0 left-0 w-[400px] md:w-[26vw] h-[400px] md:h-[26vw] bg-emerald-500/5 blur-[100px] md:blur-[6.2vw] rounded-full" />
            <div className="absolute top-0 right-0 w-[300px] md:w-[21vw] h-[300px] md:h-[21vw] bg-blue-500/5 blur-[80px] md:blur-[5.2vw] rounded-full" />

            {/* Taskbar/Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-8 md:h-[2vw] md:min-h-[1.5rem] flex items-center justify-between px-4 md:px-[1.5vw] z-[1001] bg-black/10 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-6 md:gap-[1.5vw]">
                    <span className="hidden md:block text-[clamp(10px,0.55vw,12px)] font-black uppercase tracking-[0.2em] text-white/40">AVA OS v2.4.1</span>
                    <span className="md:hidden text-[10px] font-black uppercase tracking-[0.2em] text-white/60">AVA OS</span>
                    <div className="scale-75 origin-left">
                        {isAuthenticated && <CreditGauge showLabel={false} />}
                    </div>
                </div>
                <div className="flex items-center gap-4 md:gap-[1.5vw]">
                    <button
                        onClick={() => triggerHandover()}
                        className="flex items-center gap-2 md:gap-[0.5vw] group cursor-pointer"
                        title="System Handover"
                    >
                        <HelpCircle className="w-3.5 h-3.5 md:w-[0.8vw] md:h-[0.8vw] text-white/40 group-hover:text-emerald-400 transition-colors" />
                    </button>
                    <span className="text-[10px] md:text-[clamp(10px,0.6vw,12px)] font-bold text-white/60 min-w-[45px] md:min-w-[3vw] text-right">
                        {time || "--:--"}
                    </span>
                </div>
            </div>

            {/* Widgets Section */}
            {!hasMaximizedWindow && (
                <WidgetContainer>
                    <TimeWidget />
                    <CountryWidget />
                    <IntelligencePulseWidget />
                    <BureauFeedWidget />
                </WidgetContainer>
            )}

            {/* Desktop Icons */}
            {!hasMaximizedWindow && (
                <div className="fixed top-12 md:top-[3vw] right-4 md:right-[1.5vw] flex flex-col gap-4 md:gap-[1.5vw] z-10 py-4 md:py-[1.2vw]">
                    <motion.a
                        href="/landing#faq"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="group flex flex-col items-center gap-1.5 md:gap-[0.4vw] w-14 md:w-[4.2vw]"
                    >
                        <div className="w-10 h-10 md:w-[3.2vw] md:h-[3.2vw] md:min-w-[2.5rem] md:min-h-[2.5rem] rounded-lg md:rounded-[0.8vw] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-xl group-active:scale-95">
                            <HelpCircle className="w-5 h-5 md:w-[1.4vw] md:h-[1.4vw] text-white/50 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <span className="text-[7px] md:text-[clamp(7px,0.45vw,9px)] font-bold text-white/40 group-hover:text-white text-center uppercase tracking-widest leading-tight">
                            System FAQ
                        </span>
                    </motion.a>

                    <motion.a
                        href="/glossary"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="group flex flex-col items-center gap-1.5 md:gap-[0.4vw] w-14 md:w-[4.2vw]"
                    >
                        <div className="w-10 h-10 md:w-[3.2vw] md:h-[3.2vw] md:min-w-[2.5rem] md:min-h-[2.5rem] rounded-lg md:rounded-[0.8vw] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-xl group-active:scale-95">
                            <Book className="w-5 h-5 md:w-[1.4vw] md:h-[1.4vw] text-white/50 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <span className="text-[7px] md:text-[clamp(7px,0.45vw,9px)] font-bold text-white/40 group-hover:text-white text-center uppercase tracking-widest leading-tight">
                            Intelligence Glossary
                        </span>
                    </motion.a>

                    <motion.a
                        href="/agents"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                        className="group flex flex-col items-center gap-1.5 md:gap-[0.4vw] w-14 md:w-[4.2vw]"
                    >
                        <div className="w-10 h-10 md:w-[3.2vw] md:h-[3.2vw] md:min-w-[2.5rem] md:min-h-[2.5rem] rounded-lg md:rounded-[0.8vw] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-xl group-active:scale-95">
                            <Users className="w-5 h-5 md:w-[1.4vw] md:h-[1.4vw] text-white/50 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span className="text-[7px] md:text-[clamp(7px,0.45vw,9px)] font-bold text-white/40 group-hover:text-white text-center uppercase tracking-widest leading-tight">
                            Agentic Roster
                        </span>
                    </motion.a>
                </div>
            )}

            {/* App Windows */}
            <AnimatePresence>
                {openWindows.map((window) => (
                    !window.isMinimized && (
                        <Window
                            key={window.id}
                            id={window.id}
                            title={window.id.toUpperCase()}
                            isMaximized={window.isMaximized}
                            zIndex={window.zIndex}
                        >
                            {renderAppContent(window.id)}
                        </Window>
                    )
                ))}
            </AnimatePresence>

            {!hasMaximizedWindow && <AskAva />}
            <Dock />
            <Onboarding />
        </div>
    );
};

// Helper to render Iframe or Internal App
function renderAppContent(id: string) {
    if (id === 'settings') {
        return <SettingsApp />;
    }

    const routes: Record<string, string> = {
        sentinel: '/mission-control',
        genesis: '/genesis',
        lab: '/lab',
        interpreter: '/field-interpreter', // Assuming this is the route
        kernel: '/python',
        illustrator: '/illustrator',
        bureau: '/landing'
    };

    const url = routes[id];
    if (!url) return <div className="p-8 text-white">App not found: {id}</div>;

    return (
        <iframe
            src={url}
            className="w-full h-full border-none"
            title={id}
        />
    );
}

const SettingsApp = () => {
    const { wallpaper, setWallpaper } = useOS();

    const presets = [
        { id: 'sentient-emerald', name: 'Sentient Emerald', color: 'bg-emerald-600' },
        { id: 'clinical-white', name: 'Clinical White', color: 'bg-slate-200' },
        { id: 'cyber-grid', name: 'Cyber Grid', color: 'bg-slate-900' },
        { id: 'onyx-gold', name: 'Onyx & Gold', color: 'bg-amber-800' },
    ];

    return (
        <div className="p-10 text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">System Preferences</h1>
            <p className="text-slate-500 mb-12 text-sm uppercase tracking-[0.2em]">Appearance & Personalization</p>

            <div className="grid grid-cols-2 gap-6">
                {presets.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setWallpaper(p.id)}
                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-6 text-left
              ${wallpaper === p.id ? 'border-emerald-500 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'}
            `}
                    >
                        <div className={`w-full h-24 rounded-xl mb-4 ${p.color} opacity-40 group-hover:opacity-60 transition-opacity`} />
                        <div className="text-xs font-bold uppercase tracking-widest">{p.name}</div>
                        {wallpaper === p.id && (
                            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Desktop;
