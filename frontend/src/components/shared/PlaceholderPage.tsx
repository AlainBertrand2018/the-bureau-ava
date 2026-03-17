"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";

export default function PlaceholderPage({ title = "Coming Soon" }) {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-6 pt-32">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-3xl flex items-center justify-center">
                        <Sparkles size={40} className="text-blue-600 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{title}</h1>
                        <p className="text-slate-500 font-medium">
                            We are currently architecting this module. Groundbreaking intelligence takes time to perfect.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:gap-4 transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to The Bureau
                    </Link>
                </div>
            </div>
            <Footer dark={false} />
        </main>
    );
}
