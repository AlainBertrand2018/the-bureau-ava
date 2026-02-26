"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClearance } from "@/context/ClearanceContext";

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isSuperAdmin, clearanceLevel, isAuthenticated, isLoaded } = useClearance();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            if (!isAuthenticated) {
                router.push("/login");
            } else if (!isSuperAdmin) {
                router.push("/");
            }
        }
    }, [isSuperAdmin, isLoaded, isAuthenticated, router]);

    if (!isLoaded || !isAuthenticated || !isSuperAdmin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    {!isLoaded || !isAuthenticated ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Authenticating...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-red-500 uppercase mb-4">Content Lockdown</h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Level 10 Clearance Required to Edit Bureau Reality</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return <div id="sanity-root" suppressHydrationWarning style={{ height: '100vh', width: '100vw' }}>{children}</div>
}
