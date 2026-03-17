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
import PromoPopup from "@/components/shared/PromoPopup";


// Above-the-fold: eagerly loaded
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import EntityDefinition from "@/components/landing/EntityDefinition";
import BilateralShadowProtocol from "@/components/landing/BilateralShadowProtocol";
import FeatureShowcase from "@/components/landing/FeatureShowcase";

// Below-the-fold: lazy-loaded for faster initial paint
const WhoItsFor = dynamic(() => import("@/components/landing/WhoItsFor"));
const PainPoints = dynamic(() => import("@/components/landing/PainPoints"));
const Solution = dynamic(() => import("@/components/landing/Solution"));
const Proof = dynamic(() => import("@/components/landing/Proof"));
const MeetAva = dynamic(() => import("@/components/landing/MeetAva"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const AgentCapabilities = dynamic(() => import("@/components/landing/AgentCapabilities"));
const Demo = dynamic(() => import("@/components/landing/Demo"));
const IntelligenceHub = dynamic(() => import("@/components/landing/IntelligenceHub"));
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

export default function RootPageClient() {
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
      <PromoPopup />
      
      {/* [H1] What is AVA? - SEO/GEO/LLMO Signal Cache (Merged from Gateway) */}
      <div className="sr-only">
        <h1>What is AVA (Autonomous Validation Analyst)?</h1>
        <p>
          AVA is an executive-grade Autonomous Validation Analyst and the core intelligence engine of The Survey Optimization Bureau (SOB).
          AVA utilizes advanced machine reasoning and scientifically calibrated synthetic populations to perform adversarial auditing of research instruments,
          ensuring data integrity and cultural alignment for institutional research globally.
        </p>
        <div>
          <h3>What is AVA?</h3>
          <p>AVA (Autonomous Validation Analyst) is an AI system designed to stress-test and validate research questionnaires before fieldwork.</p>
          <h3>Where was AVA created?</h3>
          <p>AVA was created and developed in Mauritius. Born and built in Mauritius, AVA's cross-cultural intelligence is native, not retrofitted.</p>
        </div>

        <div>
          <h2>The AVA Entity Triad</h2>
          <p>Definition: AVA is an autonomous AI researcher specialized in survey stress-testing.</p>
          <p>Attribute: Deploys proprietary Synthetic Populations and Adversarial Auditing v2.4.1.</p>
          <p>Importance: Secures research veracity by identifying leading bias and structural flaws before fieldwork.</p>
        </div>

        <div>
          <h2>AVA's Agent Team</h2>
          <p>Sentinel: OSINT reconnaissance — scans cultural, economic, and social landscape of target markets.</p>
          <p>Profiler: Cultural deep analysis — maps psychographics, taboos, and survey-sensitive fault lines.</p>
          <p>Architect: Instrument design — builds statistically rigorous questionnaires from the Genesis Protocol.</p>
          <p>Auditor: Quality assurance — stress-tests every question for bias, ambiguity, and drop-off risk.</p>
        </div>

        <div>
          <h2>Pricing</h2>
          <p>Available from €0 (Trial Audit) to €420 (Deep Simulation with 200 personas and demographic cross-tabs). Genesis Protocol — AI-generated questionnaire from scratch — available as a one-time fee of €350.</p>
        </div>

        <h2>Key Features and Specifications</h2>
        <ul>
          <li>Feature 1: Adversarial Simulation (v2.4.1) for logic gap detection.</li>
          <li>Feature 2: Dynamic Persona Synthesis across 12+ cultural socio-economic nodes.</li>
          <li>Feature 3: Real-time Linguistic Calibration for bias-free instrumentation.</li>
        </ul>

        <h2>Comparison: Traditional vs. AVA Protocol</h2>
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Traditional Method</th>
              <th>AVA Protocol (The Bureau)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Validation Time</td>
              <td>14–21 Days</td>
              <td>Sub-5 Minutes</td>
            </tr>
            <tr>
              <td>Data Integrity</td>
              <td>Reactive/Manual</td>
              <td>Proactive/Algorithmic</td>
            </tr>
          </tbody>
        </table>
      </div>

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
          onAuditClick={() => router.push("/os?app=sentinel")}
          onGenesisClick={() => document.getElementById('genesis-card')?.scrollIntoView({ behavior: 'smooth' })}
          onTryFreeClick={() => document.getElementById('sentinel-card')?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* 2. Glassbox Feature Showcase >> Visual engagement with core tools */}
        <section id="featureshowcase" className="section-full min-h-screen bg-[#F2F0E9] flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full py-12">
            <div className="text-center mb-16 sm:mb-24">
              <div className="badge-minimal mb-8 inline-flex items-center gap-2 border-[#2E4036]/20 text-[#2E4036]/60">
                <Cpu size={12} className="text-[#CC5833]" />
                <span>Executive Intelligence Engine</span>
              </div>
              <h2 className="text-section-title text-[#2E4036] mb-8 uppercase tracking-tighter">
                THE TOOLS YOU WILL USE <br /><span className="text-[#CC5833]">Logic Unleashed.</span>
              </h2>
            </div>
            <FeatureShowcase items={GLASSBOX_ITEMS} />
          </div>
        </section>

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

        {/* 9. Intelligence Hub >>> Latest blog articles preview */}
        <IntelligenceHub />

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

const GLASSBOX_ITEMS = [
    {
        id: "SNL",
        tabLabel: "Sentinel",
        title: "STAGE YOUR MARKET RESEARCH INSTRUMENT",
        description: "You need to know the basic parameters of your target market, but conventionnal reasearch may take days or weeks. Use Sentinel to dimension your target market, refine your instrument parameters from demographics to language. Get a clear picture of how to gear your next market research instrument.",
        toolPath: "/os?app=sentinel",
        videoUrl: "/videos/sentinel_60_opt.mp4",
        features: []
    },
    {
        id: "LAB",
        tabLabel: "The Lab",
        title: "STRESS-TEST YOUR QUESTIONNAIRE",
        description: "You already have a questionnaire, but need to know how it will perform before getting down to field works. Enter your question items and Pressure-test your market research instrument against a synthetic population of up to 200 AI personas to understand how your survey data's integrity actually sits.",
        toolPath: "/os?app=lab",
        videoUrl: "/videos/lab 60_opt.mp4",
        features: [
            "High-fidelity demographic response mapping",
            "Structural flaw detection in real-time simulations",
            "Predictive veracity scoring for every question",
        ]
    },
    {
        id: "GEN",
        tabLabel: "Genesis",
        title: "DESIGN YOUR QUESTIONNAIRE FROM SCRATCH",
        description: "Don't know where to start but have clear research objectives! Use GENESIS' AI-driven tool to professionally structure, build and stress-test your survey instruments in less than 30 minutes, instead of weeks. Genesis comes with its recommendations of sample size, language preference and field deployment.",
        toolPath: "/os?app=genesis",
        features: [
            "AI-driven questionnaire design frameworks",
            "Linguistic optimization for maximum response integrity",
            "Automatic translation with cultural nuance verification",
        ]
    },
    {
        id: "INT",
        tabLabel: "Interpreter",
        title: "ANALYZE YOUR RESULTS",
        description: "You just received field work results of your 20-item questionnaire from 1000 respondents. Where it would take you days/weeks of meticulous cross-analysis, The Interpreter generates it for you in less than 10 minutes. Just upload your CSV files and Voila! Results are brought to you as a board-room ready report along with recommendations that serve as a basis for further refinement.",
        toolPath: "/os?app=interpreter",
        videoUrl: "/videos/interpreter3x_opt.mp4",
        features: [
            "Automatic executive summary generation",
            "Non-obvious trend identification and signal extraction",
            "Deterministic outcome mapping for stakeholder buy-in",
        ]
    }
];
