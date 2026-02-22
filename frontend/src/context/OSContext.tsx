"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppId = 'sentinel' | 'genesis' | 'lab' | 'interpreter' | 'bureau' | 'settings';

export interface WindowState {
    id: AppId;
    isOpen: boolean;
    isMaximized: boolean;
    isMinimized: boolean;
    zIndex: number;
}

export interface OSContextType {
    openWindows: WindowState[];
    activeApp: AppId | null;
    wallpaper: string;
    isHandoverVisible: boolean;
    launchApp: (id: AppId) => void;
    closeApp: (id: AppId) => void;
    minimizeApp: (id: AppId) => void;
    maximizeApp: (id: AppId) => void;
    focusApp: (id: AppId) => void;
    setWallpaper: (wallpaper: string) => void;
    triggerHandover: () => void;
    setHandoverComplete: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
    const [activeApp, setActiveApp] = useState<AppId | null>(null);
    const [wallpaper, setWallpaperState] = useState('cyber-grid');
    const [maxZIndex, setMaxZIndex] = useState(10);

    useEffect(() => {
        const savedWallpaper = localStorage.getItem('ava-os-wallpaper');
        if (savedWallpaper) setWallpaperState(savedWallpaper);
    }, []);

    const focusApp = React.useCallback((id: AppId) => {
        setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
        setMaxZIndex(prevZ => prevZ + 1);
        setActiveApp(id);
    }, [maxZIndex]);

    const launchApp = React.useCallback((id: AppId) => {
        setOpenWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing) {
                focusApp(id);
                return prev.map(w => w.id === id ? { ...w, isMinimized: false } : w);
            }
            const newWindow: WindowState = {
                id,
                isOpen: true,
                isMaximized: false,
                isMinimized: false,
                zIndex: maxZIndex + 1
            };
            setMaxZIndex(prevZ => prevZ + 1);
            setActiveApp(id);
            return [...prev, newWindow];
        });
    }, [maxZIndex, focusApp]);

    useEffect(() => {
        // Auto-launch app from URL if present
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const initialApp = params.get('app') as AppId;
            if (initialApp) {
                launchApp(initialApp);
                // Clear param to prevent re-launch on refresh
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [launchApp]);

    const setWallpaper = (newWallpaper: string) => {
        setWallpaperState(newWallpaper);
        localStorage.setItem('ava-os-wallpaper', newWallpaper);
    };

    const closeApp = (id: AppId) => {
        setOpenWindows(prev => prev.filter(w => w.id !== id));
        if (activeApp === id) setActiveApp(null);
    };

    const minimizeApp = (id: AppId) => {
        setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
        if (activeApp === id) setActiveApp(null);
    };

    const maximizeApp = (id: AppId) => {
        setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
        focusApp(id);
    };

    const triggerHandover = () => {
        localStorage.removeItem('ava-os-onboarding-v2');
        window.location.reload(); // Simple way to re-trigger the effect
    };

    const setHandoverComplete = () => {
        localStorage.setItem('ava-os-onboarding-v2', 'true');
    };

    return (
        <OSContext.Provider value={{
            openWindows,
            activeApp,
            wallpaper,
            isHandoverVisible: false, // We'll handle visibility via localStorage and reload for now, or you can manage state here.
            launchApp,
            closeApp,
            minimizeApp,
            maximizeApp,
            focusApp,
            setWallpaper,
            triggerHandover,
            setHandoverComplete
        }}>
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => {
    const context = useContext(OSContext);
    if (!context) throw new Error('useOS must be used within an OSProvider');
    return context;
};
