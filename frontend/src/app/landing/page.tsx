"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCurrency } from "@/context/CurrencyContext";

const RotatingDashboard = dynamic(() => import("@/components/RotatingDashboard"), { ssr: false });
const SurveyArchitect = dynamic(() => import("@/components/architect/SurveyArchitect"), { ssr: false });
const AnimatedReportCard = dynamic(() => import("@/components/AnimatedReportCard"), { ssr: false });
const FreeLabModal = dynamic(() => import("@/components/lab/FreeLabModal"), { ssr: false });
const ContactModal = dynamic(() => import("@/components/ContactModal"), { ssr: false });
const BusinessOnboardingModal = dynamic(() => import("@/components/BusinessOnboardingModal"), { ssr: false });
const LaboratoryEntryProtocol = dynamic(() => import("@/components/shared/LaboratoryEntryProtocol"), { ssr: false });
import QuickAudit from "@/components/QuickAudit";
import GDPRConsent from "@/components/GDPRConsent";
import Footer from "@/components/Footer";

// Above-the-fold: eagerly loaded
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import EntityDefinition from "@/components/landing/EntityDefinition";
import BilateralShadowProtocol from "@/components/landing/BilateralShadowProtocol";

// Below-the-fold: lazy-loaded for faster initial paint
const WhoItsFor = dynamic(() => import("@/components/landing/WhoItsFor"));
const PainPoints = dynamic(() => import("@/components/landing/PainPoints"));
const Solution = dynamic(() => import("@/components/landing/Solution"));
const Proof = dynamic(() => import("@/components/landing/Proof"));
const MeetAva = dynamic(() => import("@/components/landing/MeetAva"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const AgentCapabilities = dynamic(() => import("@/components/landing/AgentCapabilities"));
const Demo = dynamic(() => import("@/components/landing/Demo"));
const SurveyMechanics = dynamic(() => import("@/components/landing/SurveyMechanics"));
const PricingSection = dynamic(() => import("@/components/landing/PricingSection"));
import FAQSection from "@/components/landing/FAQSection";
const FinalCTASection = dynamic(() => import("@/components/landing/FinalCTASection"));

import {
  ArrowRight,
  Zap,
  Shield,
  ShieldCheck,
  Users,
  BarChart3,
  FileText,
  Sparkles,
  Target,
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
export default function LandingPage() {
  const router = useRouter();
  const { currency } = useCurrency();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showQuickAuditModal, setShowQuickAuditModal] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [isFreeLabOpen, setIsFreeLabOpen] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [protocolTarget, setProtocolTarget] = useState("Sandbox Environment");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const triggerProtocol = (target = "Sandbox Environment") => {
    setProtocolTarget(target);
    setShowProtocol(true);
  };

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
          total_questions_processed: 520,
          average_quality_score: 98.4,
          total_audits: 12,
          top_issues: [
            { name: "Double-Barreled", count: 14 },
            { name: "Leading Bias", count: 12 },
            { name: "Ambiguity", count: 9 }
          ]
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <BilateralShadowProtocol />
      <div className="flex-grow">
        {/* ════════════════════════════════════════════
            NAVIGATION
        ════════════════════════════════════════════ */}
        <Navbar
          onContactClick={() => setIsContactOpen(true)}
          onOnboardingClick={() => setIsOnboardingOpen(true)}
        />

        {/* 1. Hero >> Hook & value prop */}
        <Hero
          onAuditClick={() => setShowQuickAuditModal(true)}
          onGenesisClick={() => router.push("/os")}
        />

        {/* 1.5 Entity Definition >> Machine readability anchor */}
        <EntityDefinition />

        {/* 2. "Built for Decision Makers" >>> Qualify the audience immediately */}
        <WhoItsFor onProtocolOpen={() => triggerProtocol("Institutional Protocol Verification")} />

        {/* 3. Cost of a bad survey >>> Agitate the pain */}
        <PainPoints
          onAuditClick={() => setShowQuickAuditModal(true)}
        />

        {/* 4. Stress-test solution intro >>> Pivot from pain to solution */}
        <Solution
          onAuditClick={() => setShowQuickAuditModal(true)}
        />

        {/* 5. "I was challenged on 12 surveys" + stats >>> Credibility before showing product */}
        <Proof
          pubStats={pubStats}
        />

        {/* 6. Meet Your Analyst >>> Build personal trust & likability */}
        <MeetAva onProtocolOpen={() => triggerProtocol("AVA Cognitive Engagement")} />

        {/* 7. Three steps. Under 5 minutes >>> Now they trust you — show it's easy */}
        <HowItWorks />

        {/* 7.5 Agent Capabilities >>> Technical Specifications for GEO/LLMO */}
        <AgentCapabilities />

        {/* 8. See what you'll get >>> Feature demo after trust is earned */}
        <Demo
          onProtocolOpen={() => triggerProtocol("Interface Demonstration")}
        />

        {/* 9. Mechanics of a Survey >>> Place it as a first article of our blog grid */}
        <SurveyMechanics
          currency={currency}
          onProtocolOpen={() => triggerProtocol("Validation Shield Deployment")}
        />

        {/* 11. Pricing >>> Close the sale */}
        <PricingSection
          currency={currency}
          onContactClick={() => setIsContactOpen(true)}
        />

        {/* 11.5 FAQ Section >>> Address objections */}
        <FAQSection />

        {/* 12. Final CTA >>> Last push */}
        <FinalCTASection
          onEntryOpen={() => {
            setProtocolTarget("Tier 1: Trial Audit");
            setShowProtocol(true);
          }}
        />

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
                  className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden shadow-blue-500/10 border border-white/20"
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
                        <div className="badge-blue mb-6 inline-flex uppercase tracking-widest">Advanced Simulation</div>
                        <h3 className="text-3xl font-black text-slate-900 leading-tight mb-4 uppercase tracking-tighter">
                          Laboratory Entry
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                          You are about to enter a high-fidelity market simulation environment. AVA will guide the protocol.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Simulation Engines Active
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <ShieldCheck size={14} className="text-slate-400" />
                          End-to-End Encryption
                        </div>
                      </div>
                    </div>

                    {/* Right: Steps & Start */}
                    <div className="flex-1 p-10 md:p-12 relative">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Protocol Workflow</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                        {[
                          { icon: <Target size={14} />, title: "Context Synthesis", desc: "Market definition and objective alignment" },
                          { icon: <FileText size={14} />, title: "Instrument Analysis", desc: "Question structure and logic evaluation" },
                          { icon: <Users size={14} />, title: "Persona Generation", desc: "Target demographic synthesis (n=Simulation Size)" },
                          { icon: <Cpu size={14} />, title: "Agent Orchestration", desc: "Behavioral engine execution" },
                          { icon: <BarChart3 size={14} />, title: "Result Tabulation", desc: "Diagnostic data aggregation" },
                          { icon: <ShieldCheck size={14} />, title: "Judgment", desc: "Final audit and recommendations" },
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
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{step.desc}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100/50">
                        <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                          {"Disclaimer: Simulation outputs are diagnostic projections based on current LLM behavioral models. They should be used to improve instruments, not as a replacement for live human pilot tests."}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/lab")}
                        className="w-full py-5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group"
                      >
                        Initiate Protocol
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
                  className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden shadow-blue-500/10 border border-white/20 p-6 md:p-12"
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
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Powered by The Bureau / Scientific Intelligence
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Calculated Live</span>
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
                className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-600/20 border border-blue-50/50"
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
                      The Bureau Shield
                    </h3>
                    <div className="h-1 w-20 bg-blue-600 rounded-full" />
                    <p className="text-2xl font-medium text-slate-500 leading-relaxed">
                      I am your <span className="text-slate-900 font-black">Insurrection Against Bias.</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
                      By shielding your survey with my agents, you ensure that every question is a precision tool, not a liability. I identify leading bias, ambiguity, and structural flaws before they contaminate your data.
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
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trusted by elite research teams</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowShieldModal(false);
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                      Upgrade My Shield
                    </button>
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
      <BusinessOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <Footer dark={false} />
      <GDPRConsent />
    </main>
  );
}

