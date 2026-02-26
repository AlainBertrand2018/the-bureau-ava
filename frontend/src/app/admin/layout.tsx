"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClearance } from "@/context/ClearanceContext";
import {
    LayoutDashboard,
    Activity,
    DollarSign,
    BarChart3,
    ShieldCheck,
    Settings,
    ArrowLeft,
    PenTool,
    LogOut
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isSuperAdmin, clearanceLevel, isAuthenticated, isLoaded, logout } = useClearance();
    const router = useRouter();

    React.useEffect(() => {
        if (isLoaded) {
            if (!isAuthenticated) {
                router.push("/login");
            } else if (!isSuperAdmin) {
                router.push("/");
            }
        }
    }, [isSuperAdmin, isAuthenticated, isLoaded, router]);

    // Show loading or restricted access
    if (!isLoaded || !isAuthenticated || !isSuperAdmin) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    {!isLoaded || !isAuthenticated ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Verifying Identity...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter mb-4">Access Denied</h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Clearance Level 10 Required for Operations Oversight</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <span className="font-black text-white tracking-tight uppercase text-sm">Bureau Admin</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {[
                        { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/admin" },
                        { icon: <Activity size={18} />, label: "System Health", href: "/admin/health" },
                        { icon: <ShieldCheck size={18} />, label: "Token Usage", href: "/admin/tokens" },
                        { icon: <DollarSign size={18} />, label: "Commercial", href: "/admin/commercial" },
                        { icon: <PenTool size={18} />, label: "Create Content", href: "/studio" },
                        { icon: <BarChart3 size={18} />, label: "Audit Stats", href: "/admin/stats" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all border border-transparent"
                    >
                        <ArrowLeft size={18} />
                        Exit to Site
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            router.push("/login");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent"
                    >
                        <LogOut size={18} />
                        Terminate Session
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all border border-transparent">
                        <Settings size={18} />
                        Settings
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
