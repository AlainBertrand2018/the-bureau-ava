"use client";
import React from 'react';
import { useOS } from '@/context/OSContext';
import Window from './Window';
import Dock from './Dock';
import { WidgetContainer, TimeWidget, CountryWidget, BureauFeedWidget } from './Widgets';
import Onboarding from './Onboarding';
import { AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const Desktop: React.FC = () => {
    const { openWindows, wallpaper, triggerHandover } = useOS();
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
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />

            {/* Taskbar/Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 md:px-6 z-[1001] bg-black/10 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-6">
                    <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">AVA OS v2.4.1</span>
                    <span className="md:hidden text-[10px] font-black uppercase tracking-[0.2em] text-white/60">AVA OS</span>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <button
                        onClick={() => triggerHandover()}
                        className="flex items-center gap-2 group cursor-pointer"
                        title="System Handover"
                    >
                        <HelpCircle className="w-3.5 h-3.5 text-white/40 group-hover:text-emerald-400 transition-colors" />
                    </button>
                    <span className="text-[10px] font-bold text-white/60 min-w-[45px] md:min-w-[50px] text-right">
                        {time || "--:--"}
                    </span>
                </div>
            </div>

            {/* Widgets Section */}
            {!hasMaximizedWindow && (
                <WidgetContainer>
                    <TimeWidget />
                    <CountryWidget />
                    <BureauFeedWidget />
                </WidgetContainer>
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
