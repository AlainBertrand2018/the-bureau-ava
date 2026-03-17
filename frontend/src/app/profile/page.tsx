"use client";

import React, { useEffect, useState } from 'react';
import { useClearance } from '@/context/ClearanceContext';
import Navbar from '@/components/landing/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Shield, 
    History, 
    Zap, 
    Building2, 
    Briefcase, 
    Mail, 
    Calendar,
    ArrowRight,
    Loader2,
    Activity,
    LogOut,
    CheckCircle2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
    fullName: string;
    company: string;
    position: string;
    credits: number;
    created_at: string | number;
}

interface MissionHistory {
    mission_id: string;
    type: string;
    status: string;
    created_at: string;
    config?: {
        objective?: string;
        context?: string;
    };
}

export default function ProfilePage() {
    const { userEmail, isAuthenticated, isLoaded, credits, logout, setIsLoginModalOpen } = useClearance();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [missions, setMissions] = useState<MissionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userEmail || !db) return;
            
            try {
                setLoading(true);
                // 1. Fetch Profile from Firestore
                const userDoc = await getDoc(doc(db, "users", userEmail.toLowerCase()));
                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                }

                // 2. Fetch Missions from Backend
                const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
                const response = await fetch(`${apiUrl}/missions?email=${userEmail}`);
                if (response.ok) {
                    const data = await response.json();
                    setMissions(data);
                }
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded && isAuthenticated && userEmail) {
            fetchProfileData();
        } else if (isLoaded && !isAuthenticated) {
            setLoading(false);
        }
    }, [isAuthenticated, userEmail, isLoaded]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!isLoaded || (isAuthenticated && loading)) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#CC5833] animate-spin" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2E4036]/40">Decrypting Dossier...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#FDFCFB]">
                <Navbar />
                <div className="pt-48 px-6 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-[#CC5833]/5 flex items-center justify-center mb-8 border border-[#CC5833]/10">
                        <User className="w-10 h-10 text-[#CC5833]" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-[#2E4036] mb-4">Unauthorized Access</h1>
                    <p className="text-[#2E4036]/60 max-w-sm mb-12">Identify as an Early Adopter to access your strategic intelligence log and credit balance.</p>
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="px-10 py-5 bg-[#2E4036] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#CC5833] transition-all shadow-xl shadow-[#2E4036]/15 group"
                    >
                        Sign In as Early Adopter <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#2E4036] font-sans selection:bg-[#CC5833]/10">
            <Navbar />
            
            <main className="max-w-7xl mx-auto pt-32 pb-24 px-6">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-[#CC5833]/10 border border-[#CC5833]/20 rounded-full">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#CC5833]">Strategic Intelligence Dossier</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                                Early Adopter <span className="text-[#CC5833]">Dashboard</span>
                            </h1>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2E4036]/40 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={14} /> Terminate OS Session
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Column: Identity & Resources */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Profile Info */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 border border-[#2E4036]/5 shadow-2xl shadow-[#2E4036]/5 relative overflow-hidden"
                        >
                            {/* Decorative background accent */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#CC5833]/5 rounded-full blur-[70px] -mr-20 -mt-20 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="flex flex-col items-center text-center mb-10">
                                    <div className="relative mb-6">
                                        <div className="w-28 h-28 rounded-[2rem] bg-[#2E4036] flex items-center justify-center shadow-2xl shadow-[#2E4036]/20">
                                            <span className="text-4xl font-black text-white">
                                                {profile?.fullName?.charAt(0) || userEmail.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#CC5833] flex items-center justify-center text-white border-4 border-white">
                                            <Shield size={16} />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                                        {profile?.fullName || "Strategic Partner"}
                                    </h2>
                                    <div className="text-[10px] font-bold text-[#2E4036]/40 uppercase tracking-widest bg-[#FDFCFB] px-4 py-1.5 rounded-full border border-[#2E4036]/5">
                                        Authenticated Early Adopter
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#2E4036]/5 group hover:border-[#CC5833]/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-[#2E4036]/5 flex items-center justify-center text-[#2E4036]/40 group-hover:text-[#CC5833] transition-colors">
                                                <Mail size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-[#2E4036]/40 leading-none mb-1">Communication Channel</p>
                                                <p className="text-xs font-bold truncate max-w-[180px]">{userEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#2E4036]/5 group hover:border-[#CC5833]/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-[#2E4036]/5 flex items-center justify-center text-[#2E4036]/40 group-hover:text-[#CC5833] transition-colors">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-[#2E4036]/40 leading-none mb-1">Institution / Company</p>
                                                <p className="text-xs font-bold">{profile?.company || "Strategic Independent"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#2E4036]/5 group hover:border-[#CC5833]/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-[#2E4036]/5 flex items-center justify-center text-[#2E4036]/40 group-hover:text-[#CC5833] transition-colors">
                                                <Briefcase size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-[#2E4036]/40 leading-none mb-1">Primary Role</p>
                                                <p className="text-xs font-bold">{profile?.position || "Strategic Partner"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#2E4036]/5 group hover:border-[#CC5833]/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-[#2E4036]/5 flex items-center justify-center text-[#2E4036]/40 group-hover:text-[#CC5833] transition-colors">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-[#2E4036]/40 leading-none mb-1">Authorization Timestamp</p>
                                                <p className="text-xs font-bold">
                                                    {profile?.created_at 
                                                        ? (typeof profile.created_at === 'string' 
                                                            ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                                            : new Date(profile.created_at * 1000).toLocaleDateString())
                                                        : "Active Deployment"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Credits Balance */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#2E4036] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-[#2E4036]/20 relative overflow-hidden group"
                        >
                            {/* Animated background pulse */}
                            <motion.div 
                                animate={{ opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(204,88,51,0.2)_0%,transparent_70%)]"
                            />
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-[#CC5833]/40 transition-colors">
                                        <Zap size={24} className="text-[#CC5833]" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Resource Balance</span>
                                        <span className="text-[9px] font-bold text-[#CC5833] uppercase">Sovereign Protocol</span>
                                    </div>
                                </div>
                                
                                <div className="mb-4 flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter">{credits.toLocaleString()}</span>
                                    <span className="text-lg font-bold text-white/40 uppercase tracking-widest">CR</span>
                                </div>
                                
                                <p className="text-[13px] font-medium text-white/60 leading-relaxed mb-10 max-w-[240px]">
                                    Your strategic balance allows for high-fidelity validations across the Bureau OS. Each mission consumes credits.
                                </p>
                                
                                <button className="w-full py-5 bg-[#CC5833] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#b84a2b] transition-all shadow-xl shadow-[#CC5833]/20 active:scale-[0.98] flex items-center justify-center gap-3">
                                    Strategic Top Up <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Mission Log */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-[#2E4036]/5 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#CC5833]/5 border border-[#CC5833]/10 flex items-center justify-center text-[#CC5833]">
                                    <History size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Mission History</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2E4036]/40">Intelligence Log & Verification Feed</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] font-black text-[#2E4036] uppercase tracking-wider">{missions.length} Missions Recorded</span>
                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync Alpha</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {missions.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-[3rem] p-24 border border-[#2E4036]/5 text-center shadow-sm"
                                >
                                    <div className="relative w-24 h-24 mx-auto mb-10">
                                        <div className="absolute inset-0 rounded-full bg-[#CC5833]/5 animate-ping opacity-25" />
                                        <div className="relative w-full h-full rounded-full bg-[#FDFCFB] border border-[#2E4036]/5 flex items-center justify-center text-[#2E4036]/10">
                                            <Activity size={40} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Dossier Entry Empty</h3>
                                    <p className="text-[#2E4036]/40 text-sm max-w-sm mx-auto mb-12 leading-relaxed">
                                        You haven&apos;t initialized any validation missions yet. Deploy AVA to begin your strategic auditing process.
                                    </p>
                                    <Link href="/" className="inline-flex items-center gap-4 px-10 py-5 bg-[#2E4036] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#CC5833] transition-all shadow-xl shadow-[#2E4036]/10 group">
                                        Deploy Initial Mission <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {missions.map((mission, idx) => (
                                        <motion.div 
                                            key={mission.mission_id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-[2.5rem] p-8 border border-[#2E4036]/5 shadow-sm hover:shadow-2xl hover:shadow-[#2E4036]/5 transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC5833]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-[#FDFCFB] border border-[#2E4036]/5 flex items-center justify-center text-[#CC5833] shrink-0 group-hover:bg-[#CC5833] group-hover:text-white transition-all duration-500 shadow-sm">
                                                        <Activity size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            <h4 className="font-black uppercase tracking-tight text-lg group-hover:text-[#CC5833] transition-colors">
                                                                {mission.config?.objective || "Intelligence Mission"}
                                                            </h4>
                                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                                mission.status === 'completed' 
                                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                                    : 'bg-orange-50 text-orange-600 border border-orange-100'
                                                            }`}>
                                                                <CheckCircle2 size={10} />
                                                                {mission.status}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-medium text-[#2E4036]/60 line-clamp-2 max-w-xl leading-relaxed mb-4">
                                                            {mission.config?.context || "Universalizing strategic objectives into high-resolution validation physics."}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] font-black text-[#2E4036]/20 uppercase tracking-[0.2em]">Hash ID</span>
                                                                <span className="text-[10px] font-mono font-bold text-[#2E4036]/80">{mission.mission_id.substring(0, 12)}...</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] font-black text-[#2E4036]/20 uppercase tracking-[0.2em]">Temporal Stamp</span>
                                                                <span className="text-[10px] font-bold text-[#2E4036]/80">
                                                                    {new Date(mission.created_at).toLocaleString(undefined, {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Link 
                                                    href={`/mission-control?id=${mission.mission_id}`}
                                                    className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] bg-[#FDFCFB] border border-[#2E4036]/10 text-[11px] font-black uppercase tracking-widest hover:bg-[#2E4036] hover:text-white hover:border-[#2E4036] transition-all shadow-sm group-hover:shadow-md active:scale-[0.98]"
                                                >
                                                    Audit Metadata <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    <div className="pt-6 text-center">
                                        <p className="text-[10px] font-bold text-[#2E4036]/20 uppercase tracking-[0.3em]">End of Active Dossier Feed</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            {/* Premium Footer Accent */}
            <footer className="border-t border-[#2E4036]/5 pt-12 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
                    <div className="h-[1px] w-24 bg-[#CC5833]/20" />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#2E4036]/20">The Bureau — OS Architecture 2.0.1</p>
                </div>
            </footer>
        </div>
    );
}
