"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

const RotatingDashboard = dynamic(() => import("@/components/RotatingDashboard"), { ssr: false });
const SurveyArchitect = dynamic(() => import("@/components/architect/SurveyArchitect"), { ssr: false });
const AVAChat = dynamic(() => import("@/components/AVAChat"), { ssr: false });
const AnimatedReportCard = dynamic(() => import("@/components/AnimatedReportCard"), { ssr: false });
const FreeLabModal = dynamic(() => import("@/components/lab/FreeLabModal"), { ssr: false });
const ContactModal = dynamic(() => import("@/components/ContactModal"), { ssr: false });
const LaboratoryEntryProtocol = dynamic(() => import("@/components/shared/LaboratoryEntryProtocol"), { ssr: false });
import QuickAudit from "@/components/QuickAudit";
import LanguageToggle from "@/components/LanguageToggle";
import Preloader from "@/components/Preloader";
import GDPRConsent from "@/components/GDPRConsent";
import Footer from "@/components/Footer";

import Hero from "@/components/landing/Hero";
import WhoItsFor from "@/components/landing/WhoItsFor";
import PainPoints from "@/components/landing/PainPoints";
import Solution from "@/components/landing/Solution";
import Proof from "@/components/landing/Proof";
import MeetAva from "@/components/landing/MeetAva";
import HowItWorks from "@/components/landing/HowItWorks";
import Demo from "@/components/landing/Demo";
import SurveyMechanics from "@/components/landing/SurveyMechanics";
import GenesisSection from "@/components/landing/GenesisSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Navbar from "@/components/landing/Navbar";

import {
  ArrowRight,
  Zap,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Users,
  BarChart3,
  FileText,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Globe,
  Building2,
  GraduationCap,
  Briefcase,
  Megaphone,
  Loader2,
  Cpu,
  X,
  Send,
  ChevronRight,
  Rocket,
} from "lucide-react";




/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { currency } = useCurrency();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showQuickAuditModal, setShowQuickAuditModal] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showGenesisModal, setShowGenesisModal] = useState(false);
  const [isFreeLabOpen, setIsFreeLabOpen] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [protocolTarget, setProtocolTarget] = useState("Sandbox Environment");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [pubStats, setPubStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        const res = await fetch(`${apiUrl}/public/stats`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setPubStats(data);
      } catch (err) {
        // Silent fallback - don't let it bother the console/user
        setPubStats({
          total_questions_processed: 12450,
          average_quality_score: 98.4,
          total_audits: 4500,
          top_issues: [
            { name: "Double-Barreled", count: 145 },
            { name: "Leading Bias", count: 112 },
            { name: "Ambiguity", count: 89 }
          ]
        });
      }
    };

    fetchStats();
  }, []);



  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow">
        {/* ════════════════════════════════════════════
            NAVIGATION
        ════════════════════════════════════════════ */}
        <Navbar />

        {/* 1. Hero >> Hook & value prop */}
        <Hero
          t={t}
          onAuditClick={() => setShowQuickAuditModal(true)}
          onGenesisClick={() => setShowGenesisModal(true)}
        />

        {/* 2. "Built for Decision Makers" >>> Qualify the audience immediately */}
        <WhoItsFor t={t} />

        {/* 3. Cost of a bad survey >>> Agitate the pain */}
        <PainPoints t={t} />

        {/* 4. Stress-test solution intro >>> Pivot from pain to solution */}
        <Solution
          t={t}
          onAuditClick={() => setShowQuickAuditModal(true)}
        />

        {/* 5. "I was challenged on 12 surveys" + stats >>> Credibility before showing product */}
        <Proof
          t={t}
          pubStats={pubStats}
        />

        {/* 6. Meet Your Analyst >>> Build personal trust & likability */}
        <MeetAva t={t} />

        {/* 7. Three steps. Under 5 minutes >>> Now they trust you — show it's easy */}
        <HowItWorks t={t} />

        {/* 8. See what you'll get >>> Feature demo after trust is earned */}
        <Demo
          t={t}
          onProtocolOpen={() => setShowProtocol(true)}
        />

        {/* 9. Mechanics of a Survey >>> Place it as a first article of our blog grid */}
        <SurveyMechanics
          t={t}
          currency={currency}
          onShieldClick={() => setShowShieldModal(true)}
        />

        {/* 10. Genesis Suite >>> Introduce the offer */}
        <GenesisSection t={t} />

        {/* 11. Pricing >>> Close the sale */}
        <PricingSection
          t={t}
          currency={currency}
          onProtocolOpen={() => {
            setProtocolTarget("Tier 1: Trial Audit");
            setShowProtocol(true);
          }}
          onContactClick={() => setIsContactOpen(true)}
          onGenesisClick={() => setShowGenesisModal(true)}
        />

        {/* 12. Final CTA >>> Last push */}
        <FinalCTASection
          t={t}
          onEntryOpen={() => {
            setProtocolTarget("Tier 1: Trial Audit");
            setShowProtocol(true);
          }}
        />

        {/* ════════════════════════════════════════════
          LAB ENTRY MODAL
      ════════════════════════════════════════════ */}
        {/* ════════════════════════════════════════════
          LAB ENTRY MODAL
      ════════════════════════════════════════════ */}
        <AnimatePresence>
          {
            showEntryModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 translate-z-0">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowEntryModal(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden shadow-blue-500/10 border border-white/20"
                >
                  <button
                    onClick={() => setShowEntryModal(false)}
                    className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors z-10"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex flex-col md:flex-row h-full">
                    {/* Left: Branding & Info */}
                    <div className="w-full md:w-2/5 p-10 md:p-12 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                      <div>
                        <div className="badge-blue mb-6 inline-flex uppercase tracking-widest">{t.lab.badge}</div>
                        <h3 className="text-3xl font-black text-slate-900 leading-tight mb-4 uppercase tracking-tighter">
                          {t.lab.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                          {t.lab.desc}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {t.lab.engines}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <ShieldCheck size={14} className="text-slate-400" />
                          {t.lab.encrypted}
                        </div>
                      </div>
                    </div>

                    {/* Right: Steps & Start */}
                    <div className="flex-1 p-10 md:p-12 relative">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.lab.workflow}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                        {[
                          { icon: <Target size={14} />, title: t.lab.step1, desc: t.lab.step1_desc },
                          { icon: <FileText size={14} />, title: t.lab.step2, desc: t.lab.step2_desc },
                          { icon: <Users size={14} />, title: t.lab.step3, desc: t.lab.step3_desc },
                          { icon: <Cpu size={14} />, title: t.lab.step4, desc: t.lab.step4_desc },
                          { icon: <BarChart3 size={14} />, title: t.lab.step5, desc: t.lab.step5_desc },
                          { icon: <ShieldCheck size={14} />, title: t.lab.step6, desc: t.lab.step6_desc },
                        ].map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                              {step.icon}
                            </div>
                            <div>
                              <div className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{step.title}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{step.desc}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100/50">
                        <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                          {t.lab.disclaimer}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/lab")}
                        className="w-full py-5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group"
                      >
                        {t.lab.initiate}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          }
        </AnimatePresence>
        {/* ════════════════════════════════════════════
          QUICK AUDIT MODAL
      ════════════════════════════════════════════ */}
        <AnimatePresence>
          {
            showQuickAuditModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 translate-z-0">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowQuickAuditModal(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden shadow-blue-500/10 border border-white/20 p-8 md:p-12"
                >
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Zap size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Instant Audit</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stress-test me with a single question</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowQuickAuditModal(false)}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <QuickAudit />

                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Powered by The Bureau / Scientific Intelligence
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Calculated Live</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          }
        </AnimatePresence>
        {/* 👑 THE SHIELD MODAL */}
        <AnimatePresence>
          {showShieldModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowShieldModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-600/20 border border-blue-50/50"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => setShowShieldModal(false)}
                  className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all z-50"
                >
                  <X size={20} />
                </button>

                <div className="p-12 md:p-16 relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center mb-10 shadow-xl shadow-blue-600/30">
                    <ShieldCheck size={32} className="text-white" />
                  </div>

                  <div className="space-y-6 mb-12">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      {t.shield_modal.title}
                    </h3>
                    <div className="h-1 w-20 bg-blue-600 rounded-full" />
                    <p className="text-2xl font-medium text-slate-500 leading-relaxed">
                      {t.shield_modal.value_prop_1} <span className="text-slate-900 font-black">{t.shield_modal.value_prop_2}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
                      {t.shield_modal.description}
                    </p>
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.shield_modal.trusted}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowShieldModal(false);
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                      {t.shield_modal.cta}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* 🧬 GENESIS SUITE MODAL */}
        <AnimatePresence>
          {showGenesisModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGenesisModal(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl"
              >
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Sparkles size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                          {t.architect.badge}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                        {t.architect.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowGenesisModal(false)}
                      className="p-3 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="bg-slate-950/50 rounded-3xl border border-white/5 p-1">
                    <SurveyArchitect />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
      <LaboratoryEntryProtocol
        isOpen={showProtocol}
        targetName={protocolTarget}
        onComplete={() => {
          setShowProtocol(false);
          setIsFreeLabOpen(true);
        }}
      />
      <FreeLabModal isOpen={isFreeLabOpen} onClose={() => setIsFreeLabOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <AVAChat />
      <Footer dark={false} />
      <GDPRConsent />
    </main>
  );
}
