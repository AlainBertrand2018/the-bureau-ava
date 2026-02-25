"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SurveyFailIllustrator from "@/components/illustrators/SurveyFailIllustrator";

interface IllustratorContextType {
    openIllustrator: (slug: string) => void;
    closeIllustrator: () => void;
}

const IllustratorContext = createContext<IllustratorContextType | undefined>(undefined);

const ILLUSTRATORS: Record<string, React.ReactNode> = {
    "why-94-percent-of-surveys-fail": <SurveyFailIllustrator />,
    "why-94-percent-fail": <SurveyFailIllustrator />,
    "ia-025": <SurveyFailIllustrator />,
};

export function IllustratorProvider({ children }: { children: React.ReactNode }) {
    const [activeSlug, setActiveSlug] = useState<string | null>(null);

    const openIllustrator = useCallback((slug: string) => {
        if (ILLUSTRATORS[slug]) {
            setActiveSlug(slug);
            document.body.style.overflow = "hidden";
        } else {
            // If not found in registry, just navigate to the page normally as fallback
            window.location.href = `/i/${slug}`;
        }
    }, []);

    const closeIllustrator = useCallback(() => {
        setActiveSlug(null);
        document.body.style.overflow = "";
    }, []);

    // Also intercept clicks on /i/ links globally
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (anchor && anchor.href.includes("/i/")) {
                const url = new URL(anchor.href);
                const pathParts = url.pathname.split("/");
                const slug = pathParts[pathParts.length - 1];

                if (ILLUSTRATORS[slug]) {
                    e.preventDefault();
                    openIllustrator(slug);
                }
            }
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [openIllustrator]);

    return (
        <IllustratorContext.Provider value={{ openIllustrator, closeIllustrator }}>
            {children}
            <AnimatePresence>
                {activeSlug && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={closeIllustrator}
                            className="absolute top-6 right-6 md:top-10 md:right-10 z-[210] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all shadow-2xl"
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ y: 50, scale: 0.95, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 50, scale: 0.95, opacity: 0 }}
                            className="w-full h-full max-w-7xl bg-[#0f172a] rounded-[2rem] overflow-x-hidden overflow-y-auto shadow-[0_0_50px_rgba(56,189,248,0.2)] border border-white/10 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {ILLUSTRATORS[activeSlug]}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </IllustratorContext.Provider>
    );
}

export function useIllustrator() {
    const context = useContext(IllustratorContext);
    if (context === undefined) {
        throw new Error("useIllustrator must be used within an IllustratorProvider");
    }
    return context;
}
