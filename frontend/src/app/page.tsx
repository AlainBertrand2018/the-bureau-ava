"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const RotatingDashboard = dynamic(() => import("@/components/RotatingDashboard"), { ssr: false });
import {
  ArrowRight,
  Zap,
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
  X,
  Send,
} from "lucide-react";

/* ─── Types ─── */
interface AuditIssue {
  type: string;
  detail: string;
}

interface QuickAuditResult {
  question: string;
  quality_score: number;
  issues: AuditIssue[];
  verdict: string;
  rewrite: string;
}

/* ─── Scroll Animation Wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({
  target,
  suffix = "",
  className = "",
}: {
  target: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

/* ─── Issue Badge Color ─── */
function issueBadge(type: string) {
  const t = type.toUpperCase();
  if (t.includes("LEADING")) return "bg-red-50 text-red-600 border-red-100";
  if (t.includes("DOUBLE")) return "bg-amber-50 text-amber-700 border-amber-100";
  if (t.includes("AMBIG")) return "bg-orange-50 text-orange-600 border-orange-100";
  if (t.includes("LOADED")) return "bg-rose-50 text-rose-600 border-rose-100";
  if (t.includes("MISSING")) return "bg-violet-50 text-violet-600 border-violet-100";
  if (t.includes("CULTURAL")) return "bg-cyan-50 text-cyan-700 border-cyan-100";
  if (t.includes("DROP")) return "bg-yellow-50 text-yellow-700 border-yellow-100";
  return "bg-blue-50 text-blue-600 border-blue-100";
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [auditQuestion, setAuditQuestion] = useState("");
  const [auditResult, setAuditResult] = useState<QuickAuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* Typing placeholder animation */
  const placeholders = [
    "How satisfied are you with our amazing service?",
    "Don't you agree the product is excellent?",
    "Rate your experience from 1-10",
    "Do you like or dislike the new feature?",
  ];
  const [phIdx, setPhIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const cur = placeholders[phIdx];
    if (isTyping) {
      if (typed.length < cur.length) {
        const t = setTimeout(() => setTyped(cur.slice(0, typed.length + 1)), 40);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setIsTyping(false), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (typed.length > 0) {
        const t = setTimeout(() => setTyped(typed.slice(0, -1)), 20);
        return () => clearTimeout(t);
      } else {
        setPhIdx((i) => (i + 1) % placeholders.length);
        setIsTyping(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, isTyping, phIdx]);

  const runQuickAudit = async () => {
    if (!auditQuestion.trim()) { inputRef.current?.focus(); return; }
    setAuditLoading(true);
    setAuditError("");
    setAuditResult(null);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quick_audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: auditQuestion }),
      });
      if (!resp.ok) throw new Error("Audit failed");
      setAuditResult(await resp.json());
    } catch (err: any) {
      setAuditError(err.message || "Something went wrong");
    } finally {
      setAuditLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-600" : "text-red-600";
  const scoreBg = (s: number) =>
    s >= 80 ? "bg-emerald-50" : s >= 60 ? "bg-amber-50" : "bg-red-50";
  const scoreLabel = (s: number) =>
    s >= 80 ? "Good" : s >= 60 ? "Needs Work" : "Poor";

  return (
    <main className="min-h-screen bg-white">
      {/* ════════════════════════════════════════════
          NAVIGATION
      ════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-900 font-black text-lg tracking-tight">AVA</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">by The Bureau</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#who-its-for" className="hover:text-slate-900 transition-colors">Who It&apos;s For</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <Link
            href="/lab"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
          >
            <Zap size={12} />
            Open Lab
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center hero-dot-grid hero-spotlight pt-24 overflow-hidden">
        {/* AVA — background presence */}
        <div className="absolute bottom-0 right-0 hidden md:block pointer-events-none select-none" style={{ zIndex: 1 }}>
          <div className="relative">
            {/* Soft fade on left edge only */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 12%)',
              }}
            />
            {/* Gentle fade at very top */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 10%)',
              }}
            />
            <Image
              src="/images/AVA.webp"
              alt="Meet AVA — your AI survey auditor"
              width={500}
              height={700}
              className="opacity-85 object-contain object-bottom"
              style={{ maxHeight: '85vh' }}
              priority
            />
          </div>
        </div>
        <div className="relative z-10 max-w-[90rem] mx-auto px-6 w-full">
          <div className="max-w-6xl mx-auto text-center mb-14">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="badge-blue inline-flex items-center gap-2 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-soft" />
              AI-Powered Survey Quality Auditor
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-hero mb-6"
            >
              <span className="text-slate-900">Stop launching</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                broken surveys.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-body-lg text-slate-500 font-medium max-w-2xl mx-auto mb-12"
            >
              Meet <span className="text-slate-900 font-bold">AVA</span> — your AI survey auditor
              that catches bias, confusion, and weak questions before you go live.
            </motion.p>

            {/* Live Demo Input */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                Paste any survey question. AVA audits it instantly.
              </p>
              <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-200/60 focus-within:border-blue-400 focus-within:shadow-blue-100/60 transition-all">
                <input
                  ref={inputRef}
                  value={auditQuestion}
                  onChange={(e) => setAuditQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runQuickAudit()}
                  placeholder={typed}
                  className="flex-1 bg-transparent text-slate-900 text-sm font-medium px-4 py-3 outline-none placeholder-slate-300"
                />
                <button
                  onClick={runQuickAudit}
                  disabled={auditLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shrink-0 shadow-sm"
                >
                  {auditLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {auditLoading ? "Auditing..." : "Audit"}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-3">
                No signup required · Powered by Gemini 2.0 Flash · Results in ~10 seconds
              </p>
            </motion.div>
          </div>

          {/* Quick Audit Result */}
          <AnimatePresence>
            {auditResult && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="max-w-2xl mx-auto mt-4"
              >
                <div className="card-elevated p-8 relative">
                  <button
                    onClick={() => setAuditResult(null)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  {/* Score + Verdict */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`text-center px-5 py-3 rounded-2xl ${scoreBg(auditResult.quality_score)}`}>
                      <div className={`text-4xl font-black ${scoreColor(auditResult.quality_score)}`}>
                        {auditResult.quality_score}
                      </div>
                      <div className={`text-[9px] font-bold uppercase tracking-widest ${scoreColor(auditResult.quality_score)}`}>
                        {scoreLabel(auditResult.quality_score)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-bold text-sm mb-1">{auditResult.verdict}</p>
                      <p className="text-slate-400 text-xs font-medium">
                        Analysed across 8 structural quality dimensions
                      </p>
                    </div>
                  </div>

                  {/* Issues */}
                  {auditResult.issues.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                        <AlertTriangle size={10} />
                        Issues Detected
                      </h4>
                      <div className="space-y-2">
                        {auditResult.issues.map((issue, k) => (
                          <div key={k} className="flex items-start gap-3">
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${issueBadge(issue.type)}`}>
                              {issue.type.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm text-slate-600 font-medium">{issue.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rewrite */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={10} />
                      AVA&apos;s Recommended Rewrite
                    </h4>
                    <p className="text-slate-800 font-bold text-sm leading-relaxed">
                      &quot;{auditResult.rewrite}&quot;
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      href="/lab"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
                    >
                      Run Full Audit on Your Survey
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {auditError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 text-xs font-bold mt-4"
            >
              {auditError}
            </motion.p>
          )}

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
          >
            <Link
              href="/lab"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <Target size={16} />
              Audit My Survey Free
            </Link>
            <a
              href="#demo"
              className="flex items-center gap-2 px-8 py-4 text-slate-500 border-2 border-slate-200 rounded-full text-sm font-bold uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all"
            >
              <FileText size={16} />
              View Sample Report
            </a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PAIN POINTS
      ════════════════════════════════════════════ */}
      <section className="section-full section-soft relative">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-16">
            <h2 className="text-section-title text-slate-900 mb-6">
              The cost of a bad survey
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                isn&apos;t a bad survey.
              </span>
            </h2>
            <p className="text-body-lg text-slate-500 font-medium max-w-2xl mx-auto">
              It&apos;s a bad decision.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Building2 size={20} />,
                color: "text-red-500",
                bg: "bg-red-50",
                title: "Wrong policy recommendations",
                desc: "Presented to cabinet. Based on data that was structurally flawed from the start.",
              },
              {
                icon: <TrendingUp size={20} />,
                color: "text-amber-600",
                bg: "bg-amber-50",
                title: "Product launches built on noise",
                desc: "Leading questions told you what you wanted to hear. The market told you the truth.",
              },
              {
                icon: <BarChart3 size={20} />,
                color: "text-violet-600",
                bg: "bg-violet-50",
                title: "Rs 2M fieldwork budget wasted",
                desc: "6 weeks of data collection. 2 weeks of analysis. 0 usable insights.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="card-elevated p-8 h-full">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-slate-900 font-black text-base tracking-tight mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="text-center">
            <p className="text-slate-400 text-base font-semibold italic max-w-xl mx-auto">
              It always starts with the same root cause:{" "}
              <span className="text-slate-900 not-italic">questions no one stress-tested.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SOLUTION
      ════════════════════════════════════════════ */}
      <section className="section-full section-tinted relative">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-16">
            <div className="badge-blue inline-flex items-center gap-2 mb-6">
              <ShieldCheck size={12} />
              The Solution
            </div>
            <h2 className="text-section-title text-slate-900 mb-6">
              Stress-test your questionnaire
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                before humans ever see it.
              </span>
            </h2>
            <p className="text-body-lg text-slate-500 font-medium max-w-3xl mx-auto">
              Upload your survey. AVA deploys diagnostic personas calibrated to Mauritian demographics
              to find what your team missed.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: <AlertTriangle size={18} />, label: "Bias Flags", color: "text-red-500", bg: "bg-red-50" },
              { icon: <Target size={18} />, label: "Ambiguity Detection", color: "text-amber-600", bg: "bg-amber-50" },
              { icon: <Users size={18} />, label: "Drop-off Risks", color: "text-violet-600", bg: "bg-violet-50" },
              { icon: <BarChart3 size={18} />, label: "Confusion Points", color: "text-sky-600", bg: "bg-sky-50" },
              { icon: <CheckCircle2 size={18} />, label: "Rewrite Suggestions", color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((cap, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="card p-6 text-center group cursor-default">
                  <div className={`w-10 h-10 rounded-xl ${cap.bg} ${cap.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    {cap.icon}
                  </div>
                  <span className="text-slate-800 text-xs font-bold">{cap.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section id="how-it-works" className="section-full section-white relative">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-16">
            <h2 className="text-section-title text-slate-900 mb-6">
              Three steps. Under 5 minutes.
            </h2>
            <p className="text-body-lg text-slate-500 font-medium">Faster than scheduling a focus group.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit",
                desc: "Paste your questions or upload your questionnaire. AVA accepts any format.",
                icon: <FileText size={24} />,
                gradient: "from-blue-600 to-blue-500",
              },
              {
                step: "02",
                title: "Audit",
                desc: "AVA deploys diagnostic personas to stress-test every question for structural flaws.",
                icon: <ShieldCheck size={24} />,
                gradient: "from-violet-600 to-blue-500",
              },
              {
                step: "03",
                title: "Fix",
                desc: "Get rewritten questions, bias flags, and a prioritised fix list — ready to implement.",
                icon: <CheckCircle2 size={24} />,
                gradient: "from-emerald-600 to-sky-500",
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="card-elevated p-8 h-full relative group overflow-hidden">
                  <div className="text-[80px] font-black absolute top-2 right-4 text-slate-100 group-hover:text-slate-200 transition-colors select-none leading-none">
                    {s.step}
                  </div>
                  <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-6 text-white shadow-lg`}>
                    {s.icon}
                  </div>
                  <h3 className="relative z-10 text-slate-900 font-black text-xl tracking-tight mb-3">{s.title}</h3>
                  <p className="relative z-10 text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5} className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-100">
              <Clock size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">
                Total time: under 5 minutes
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          DEMO / SAMPLE REPORT
      ════════════════════════════════════════════ */}
      <section id="demo" className="section-full section-soft relative">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-12">
            <h2 className="text-section-title text-slate-900 mb-6">
              See what you&apos;ll get.
            </h2>
            <p className="text-body-lg text-slate-500 font-medium">
              Every audit produces a full diagnostic report with actionable fixes.
            </p>
          </Reveal>

          {/* Split: Mock Report (left) + Dashboard (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* LEFT — Mock Audit Report Card */}
            <Reveal>
              <div className="card-elevated p-0 h-full overflow-hidden">
                {/* Report Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">Sample Audit Report</h4>
                      <p className="text-[9px] font-semibold text-slate-400">Customer Satisfaction Survey</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-50 border border-red-100">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">3 Issues Found</span>
                  </div>
                </div>

                {/* Flagged Question */}
                <div className="p-5 border-b border-slate-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <span className="text-lg font-black text-red-500">42</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Poor Quality</p>
                      <p className="text-xs text-slate-500 font-medium">Question 4 of 12</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 mb-3">
                    <p className="text-sm text-slate-700 font-semibold italic">&quot;Don&apos;t you agree that our service is excellent and worth recommending?&quot;</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-red-50 text-red-600 border-red-100">Leading</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-100">Double-Barrelled</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-orange-50 text-orange-600 border-orange-100">Acquiescence Bias</span>
                  </div>
                </div>

                {/* Rewrite */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">AVA&apos;s Rewrite</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-slate-800 font-semibold">&quot;How would you rate the quality of our service?&quot;</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-2">Neutral framing · Single construct · Eliminates acquiescence bias</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — Live Rotating Dashboard */}
            <Reveal delay={0.2}>
              <div className="h-full min-h-[420px]">
                <RotatingDashboard />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4} className="text-center">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <Sparkles size={16} />
              Generate Your Report Now
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          WHO IT'S FOR
      ════════════════════════════════════════════ */}
      <section id="who-its-for" className="section-full section-white relative">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-16">
            <h2 className="text-section-title text-slate-900 mb-6">
              Built for teams that depend
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #2563EB 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                on reliable data.
              </span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <BarChart3 size={20} />, title: "Research Agencies", desc: "Ensure questionnaire quality before sending to field" },
              { icon: <Briefcase size={20} />, title: "Consultants", desc: "Add survey validation to your service offering" },
              { icon: <Building2 size={20} />, title: "Government & Parastatals", desc: "Policy surveys that withstand scrutiny" },
              { icon: <Globe size={20} />, title: "International Development", desc: "UNDP, World Bank, AfDB programme evaluations" },
              { icon: <GraduationCap size={20} />, title: "Universities", desc: "Academic research with defensible methodology" },
              { icon: <Megaphone size={20} />, title: "Brand & Marketing", desc: "Consumer research that actually predicts behaviour" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="card p-6 group cursor-default h-full">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5} className="text-center mt-14">
            <p className="text-lg text-slate-500 font-semibold">
              If your decisions rely on surveys,{" "}
              <span className="text-slate-900">we are your safety net.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          EARLY PROOF
      ════════════════════════════════════════════ */}
      <section className="section-full section-warm relative">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-16">
            <div className="badge-green inline-flex items-center gap-2 mb-6">
              <Target size={12} />
              Internal Pilot Results
            </div>
            <h2 className="text-section-title text-slate-900 mb-4">
              We tested AVA on 12 real surveys.
            </h2>
            <p className="text-base text-slate-500 font-medium max-w-lg mx-auto">
              Across healthcare, education, public policy, and consumer research.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { target: 31, label: "questions flagged for bias", color: "text-red-500" },
              { target: 22, label: "unclear or ambiguous wording", color: "text-amber-600" },
              { target: 18, label: "predicted respondent drop-off", color: "text-violet-600" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="card-elevated p-8 text-center">
                  <div className={`text-5xl font-black ${stat.color} mb-2`}>
                    <AnimatedCounter target={stat.target} suffix="%" className={stat.color} />
                  </div>
                  <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="text-center">
            <p className="text-slate-400 text-sm font-semibold">
              Most issues were fixed in minutes.{" "}
              <span className="text-emerald-600 font-bold">Before a single respondent was contacted.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════ */}
      <section id="pricing" className="section-full section-soft relative">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Start free. Scale when ready.
            </h2>
            <p className="text-lg text-slate-500 font-medium">Simple, predictable per-audit pricing.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <Reveal delay={0}>
              <div className="card-elevated p-8 h-full">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Free</div>
                <div className="text-4xl font-black text-slate-900 mb-1">MUR 0</div>
                <p className="text-xs text-slate-400 font-medium mb-6">1 audit to try AVA</p>
                <ul className="space-y-3 mb-8">
                  {["1 survey audit", "10 diagnostic personas", "5 questions max", "Quality score & flags", "Basic rewrite suggestions"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/lab"
                  className="block text-center py-3 px-6 border-2 border-slate-200 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Try Free
                </Link>
              </div>
            </Reveal>

            {/* Standard */}
            <Reveal delay={0.1}>
              <div className="card-featured p-8 h-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                  Most Popular
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Standard</div>
                <div className="text-4xl font-black text-slate-900 mb-1">MUR 500</div>
                <p className="text-xs text-slate-400 font-medium mb-6">per audit</p>
                <ul className="space-y-3 mb-8">
                  {["Up to 50 personas", "Up to 20 questions", "Full diagnostic report", "All bias & flaw flags", "AI rewrite suggestions", "PDF export"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/lab"
                  className="block text-center py-3 px-6 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </div>
            </Reveal>

            {/* Pro */}
            <Reveal delay={0.2}>
              <div className="card-elevated p-8 h-full">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-3">Pro</div>
                <div className="text-4xl font-black text-slate-900 mb-1">MUR 2,500</div>
                <p className="text-xs text-slate-400 font-medium mb-6">per audit</p>
                <ul className="space-y-3 mb-8">
                  {["Up to 200 personas", "Up to 50 questions", "Deep diagnostic analysis", "Demographic cross-tabs", "Priority recommendations", "API access", "Dedicated support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 size={14} className="text-violet-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/lab"
                  className="block text-center py-3 px-6 border-2 border-violet-200 text-violet-700 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-violet-50 transition-all"
                >
                  Go Pro
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="text-center mt-8">
            <p className="text-slate-400 text-xs font-bold">
              Enterprise? Custom datasets + API + SLA →{" "}
              <a href="mailto:hello@thebureau.mu" className="text-blue-600 hover:underline">
                Contact us
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════ */}
      <section className="section-full section-white relative">
        <div className="max-w-4xl mx-auto px-6 w-full text-center">
          <Reveal>
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-40 pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                  Don&apos;t guess.{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Audit first.
                  </span>
                </h2>
                <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto mb-10">
                  Leave the stress-test to AVA. Run your first survey quality audit now — completely free.
                </p>
                <Link
                  href="/lab"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Zap size={18} />
                  Start Free Audit
                  <ArrowRight size={18} />
                </Link>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-6">
                  No credit card · No signup required · Results in under 5 minutes
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-sm">
                <Sparkles size={11} className="text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-900 font-black text-sm">AVA</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">by The Bureau</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <a href="#how-it-works" className="hover:text-slate-700 transition-colors">How It Works</a>
              <a href="#who-its-for" className="hover:text-slate-700 transition-colors">Who It&apos;s For</a>
              <a href="#pricing" className="hover:text-slate-700 transition-colors">Pricing</a>
              <Link href="/lab" className="hover:text-slate-700 transition-colors">Lab</Link>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              © {new Date().getFullYear()} The Bureau · Ebène, Mauritius
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium max-w-lg mx-auto">
              AVA uses Google Gemini 2.0 Flash for AI-powered diagnostics. Your survey data is processed
              in real-time and never stored permanently. All audits are confidential.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
