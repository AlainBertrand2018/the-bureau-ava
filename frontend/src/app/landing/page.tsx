"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

const RotatingDashboard = dynamic(() => import("@/components/RotatingDashboard"), { ssr: false });
const SurveyArchitect = dynamic(() => import("@/components/architect/SurveyArchitect"), { ssr: false });
const AVAChat = dynamic(() => import("@/components/AVAChat"), { ssr: false });
import QuickAudit from "@/components/QuickAudit";
import LanguageToggle from "@/components/LanguageToggle";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";
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


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showQuickAuditModal, setShowQuickAuditModal] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showGenesisModal, setShowGenesisModal] = useState(false);
  const [pubStats, setPubStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/stats`)
      .then(res => res.json())
      .then(data => setPubStats(data))
      .catch(err => console.error(err));
  }, []);



  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow">
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
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest">{t.nav.how_it_works}</a>
              <a href="#genesis" className="hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest text-blue-600">Genesis</a>
              <a href="#who-its-for" className="hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest">{t.nav.who_its_for}</a>
              <a href="#pricing" className="hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest">{t.nav.pricing}</a>
            </div>
            <button
              onClick={() => router.push("/mission-control")}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
            >
              <Zap size={12} />
              {t.nav.open_lab}
            </button>
            <div className="ml-4 pl-4 border-l border-slate-100">
              <LanguageToggle />
            </div>
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
                {t.hero.badge}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-hero mb-6"
              >
                <span className="text-slate-900">{t.hero.title.split(' ').slice(0, -1).join(' ')}</span>
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t.hero.title.split(' ').slice(-1)}
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm md:text-base text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                {t.hero.description}
              </motion.p>

              {/* Meta Trust Signal */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[10px] text-slate-400 font-medium mt-8 uppercase tracking-widest"
              >
                {t.quick_audit.footer}
              </motion.p>

              {/* Hero CTAs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
              >
                <button
                  onClick={() => setShowQuickAuditModal(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  <Target size={16} />
                  {t.hero.cta_audit}
                </button>
                <button
                  onClick={() => setShowGenesisModal(true)}
                  className="flex items-center gap-2 px-8 py-4 text-slate-500 border-2 border-slate-200 rounded-full text-sm font-bold uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all"
                >
                  <FileText size={16} />
                  {t.hero.cta_demo}
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
          PAIN POINTS
      ════════════════════════════════════════════ */}
        < section className="section-full section-soft relative" >
          <div className="max-w-5xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-16">
              <h2 className="text-section-title text-slate-900 mb-6">
                {t.pain_points.title_1}
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t.pain_points.title_2}
                </span>
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-slate-900 font-black text-xl mb-1">{t.pain_points.sub_1}</p>
                <p className="text-slate-500 font-medium text-sm">
                  {t.pain_points.sub_2}
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <Building2 size={20} />,
                  color: "text-red-500",
                  bg: "bg-red-50",
                  title: t.pain_points.card_1_title,
                  desc: t.pain_points.card_1_desc,
                },
                {
                  icon: <TrendingUp size={20} />,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  title: t.pain_points.card_2_title,
                  desc: t.pain_points.card_2_desc,
                },
                {
                  icon: <BarChart3 size={20} />,
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                  title: t.pain_points.card_3_title,
                  desc: t.pain_points.card_3_desc,
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
              <p className="text-slate-400 text-base font-semibold max-w-xl mx-auto">
                {t.pain_points.footer.split(':')[0]}:{" "}
                <span className="text-slate-900">{t.pain_points.footer.split(':')[1]}</span>
              </p>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          SOLUTION
      ════════════════════════════════════════════ */}
        < section className="section-full section-tinted relative" >
          <div className="max-w-6xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-16">
              <div className="badge-blue inline-flex items-center gap-2 mb-6">
                <ShieldCheck size={12} />
                {t.solution.badge}
              </div>
              <h2 className="text-section-title text-slate-900 mb-6">
                {t.solution.title_1}
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t.solution.title_2}
                </span>
              </h2>
              <p className="text-body-lg text-slate-500 font-medium max-w-3xl mx-auto">
                {t.solution.description}
              </p>
            </Reveal>


            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
              {[
                { icon: <AlertTriangle size={18} />, label: t.solution.cap_1, color: "text-red-500", bg: "bg-red-50" },
                { icon: <Target size={18} />, label: t.solution.cap_2, color: "text-amber-600", bg: "bg-amber-50" },
                { icon: <Users size={18} />, label: t.solution.cap_3, color: "text-violet-600", bg: "bg-violet-50" },
                { icon: <BarChart3 size={18} />, label: t.solution.cap_4, color: "text-sky-600", bg: "bg-sky-50" },
                { icon: <CheckCircle2 size={18} />, label: t.solution.cap_5, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((cap, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="card p-6 text-center group cursor-default h-full">
                    <div className={`w-10 h-10 rounded-xl ${cap.bg} ${cap.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      {cap.icon}
                    </div>
                    <span className="text-slate-800 text-xs font-bold">{cap.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4} className="flex justify-center">
              <button
                onClick={() => setShowQuickAuditModal(true)}
                className="group flex items-center gap-3 px-7 py-3.5 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20"
              >
                <Zap size={14} className="text-blue-400 group-hover:text-white transition-colors" />
                {t.solution.cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
        < section id="how-it-works" className="section-full section-white relative" >
          <div className="max-w-5xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-16">
              <h2 className="text-section-title text-slate-900 mb-6">
                {t.how_it_works.title}
              </h2>
              <p className="text-body-lg text-slate-500 font-medium">{t.how_it_works.sub}</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: t.how_it_works.step1_title,
                  desc: t.how_it_works.step1_desc,
                  icon: <FileText size={24} />,
                  gradient: "from-blue-600 to-blue-500",
                },
                {
                  step: "02",
                  title: t.how_it_works.step2_title,
                  desc: t.how_it_works.step2_desc,
                  icon: <ShieldCheck size={24} />,
                  gradient: "from-violet-600 to-blue-500",
                },
                {
                  step: "03",
                  title: t.how_it_works.step3_title,
                  desc: t.how_it_works.step3_desc,
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
                  {t.how_it_works.footer}
                </span>
              </div>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          DEMO / SAMPLE REPORT
      ════════════════════════════════════════════ */}
        < section id="demo" className="section-full section-soft relative" >
          <div className="max-w-6xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-12">
              <h2 className="text-section-title text-slate-900 mb-6">
                {t.demo.title}
              </h2>
              <p className="text-body-lg text-slate-500 font-medium">
                {t.demo.sub}
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
                        <h4 className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">{t.demo.report_title}</h4>
                        <p className="text-[9px] font-semibold text-slate-400">{t.demo.report_sub}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-red-50 border border-red-100">
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">{t.demo.issues_found}</span>
                    </div>
                  </div>

                  {/* Flagged Question */}
                  <div className="p-5 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <span className="text-lg font-black text-red-500">42</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">{t.demo.poor_quality}</p>
                        <p className="text-xs text-slate-500 font-medium">{t.demo.question_label}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 mb-3">
                      <p className="text-sm text-slate-700 font-semibold">&quot;Don&apos;t you agree that our service is excellent and worth recommending?&quot;</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-red-50 text-red-600 border-red-100">{t.demo.leading}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-100">{t.demo.double_barrelled}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-orange-50 text-orange-600 border-orange-100">{t.demo.acquiescence}</span>
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
                href="/mission-control"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                <Sparkles size={16} />
                {t.demo.cta}
              </Link>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          WHO IT'S FOR
      ════════════════════════════════════════════ */}
        < section id="who-its-for" className="section-full section-white relative" >
          <div className="max-w-6xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-16">
              <h2 className="text-section-title text-slate-900 mb-6">
                {t.who_its_for.title_1}
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #10B981 0%, #2563EB 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t.who_its_for.title_2}
                </span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <BarChart3 size={20} />, title: t.who_its_for.card_1_title, desc: t.who_its_for.card_1_desc },
                { icon: <Briefcase size={20} />, title: t.who_its_for.card_2_title, desc: t.who_its_for.card_2_desc },
                { icon: <Building2 size={20} />, title: t.who_its_for.card_3_title, desc: t.who_its_for.card_3_desc },
                { icon: <Globe size={20} />, title: t.who_its_for.card_4_title, desc: t.who_its_for.card_4_desc },
                { icon: <GraduationCap size={20} />, title: t.who_its_for.card_5_title, desc: t.who_its_for.card_5_desc },
                { icon: <Megaphone size={20} />, title: t.who_its_for.card_6_title, desc: t.who_its_for.card_6_desc },
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
                {t.who_its_for.footer_1}{" "}
                <span className="text-slate-900">{t.who_its_for.footer_2}</span>
              </p>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          EARLY PROOF
      ════════════════════════════════════════════ */}
        < section className="section-full section-warm relative" >
          <div className="max-w-5xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-16">
              <div className="badge-green inline-flex items-center gap-2 mb-6">
                <Target size={12} />
                {t.proof.badge}
              </div>
              <h2 className="text-section-title text-slate-900 mb-4">
                {t.proof.title}
              </h2>
              <p className="text-base text-slate-500 font-medium max-w-lg mx-auto">
                {t.proof.sub}
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { target: pubStats?.total_questions_processed || 1240, label: t.proof.stat_1, color: "text-blue-500", suffix: "+" },
                { target: pubStats?.average_quality_score || 94, label: t.proof.stat_2, color: "text-emerald-500", suffix: "/100" },
                { target: pubStats?.total_audits || 150, label: t.proof.stat_3, color: "text-violet-600", suffix: "+" },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="card-elevated p-8 text-center">
                    <div className={`text-5xl font-black ${stat.color} mb-2`}>
                      <AnimatedCounter target={stat.target} suffix={stat.suffix} className={stat.color} />
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
        </section >

        {/* ════════════════════════════════════════════
          MEET AVA — DOSSIER
      ════════════════════════════════════════════ */}
        <section id="meet-ava" className="relative bg-slate-950 overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
          <div className="absolute -left-[10%] top-1/3 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />
          <div className="absolute -right-[10%] bottom-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
            {/* Section Header */}
            <Reveal className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Intelligence Dossier
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Meet Your Analyst
              </h2>
              <p className="text-slate-400 font-medium text-base max-w-xl mx-auto">
                I wasn't trained at Harvard or Cambridge. I was built on something more rigorous — the convergence of five disciplines that most survey professionals never master together.
              </p>
            </Reveal>

            <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
              {/* Left: AVA Portrait + Identity */}
              <Reveal className="lg:w-[340px] flex-shrink-0">
                <div className="text-center lg:text-left">
                  <div className="relative w-[240px] h-[300px] mx-auto lg:mx-0 mb-6">
                    <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
                    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/5">
                      <Image src="/images/AVA.webp" alt="AVA" fill className="object-cover object-top" />
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
                    </div>
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-tight">AVA</h3>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                    Autonomous Validation Analyst
                  </p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] mt-1">
                    The Bureau • Est. 2024
                  </p>

                  {/* Philosophy quote */}
                  <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-slate-400 text-xs leading-relaxed italic">
                      "I don't replace researchers. I make their instruments unbreakable before a single cent or hour is spent."
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Right: Dossier Content */}
              <div className="flex-1 space-y-8">
                {/* Knowledge Pillars */}
                <Reveal delay={0.1}>
                  <div className="mb-2">
                    <h4 className="text-white font-black text-lg tracking-tight mb-1">Knowledge Pillars</h4>
                    <p className="text-slate-500 text-xs font-medium">The disciplines that form my analytical core</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        icon: <FileText size={16} />,
                        title: "Survey Methodology",
                        color: "text-blue-400",
                        bg: "bg-blue-500/10",
                        border: "border-blue-500/20",
                        sources: "Dillman's Tailored Design • Tourangeau's Cognitive Model • Krosnick's Satisficing Theory",
                      },
                      {
                        icon: <Globe size={16} />,
                        title: "Cross-Cultural Intelligence",
                        color: "text-amber-400",
                        bg: "bg-amber-500/10",
                        border: "border-amber-500/20",
                        sources: "Hofstede's Dimensions • Schwartz Value Theory • World Values Survey Frameworks",
                      },
                      {
                        icon: <BarChart3 size={16} />,
                        title: "Psychometrics",
                        color: "text-violet-400",
                        bg: "bg-violet-500/10",
                        border: "border-violet-500/20",
                        sources: "Classical Test Theory • Item Response Theory • Construct Validity & Reliability",
                      },
                      {
                        icon: <Cpu size={16} />,
                        title: "Cognitive Science",
                        color: "text-rose-400",
                        bg: "bg-rose-500/10",
                        border: "border-rose-500/20",
                        sources: "Question Comprehension Models • Response Process Theory • Cognitive Interviewing",
                      },
                      {
                        icon: <Users size={16} />,
                        title: "Sociolinguistics",
                        color: "text-teal-400",
                        bg: "bg-teal-500/10",
                        border: "border-teal-500/20",
                        sources: "Register Theory • Code-Switching • Pragmatics & Discourse Analysis",
                      },
                      {
                        icon: <Shield size={16} />,
                        title: "Statistical Rigor",
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10",
                        border: "border-emerald-500/20",
                        sources: "Sampling Theory • Bias Detection Algorithms • Demographic Weighting",
                      },
                    ].map((pillar, i) => (
                      <Reveal key={i} delay={0.15 + i * 0.06}>
                        <div className={`p-4 rounded-xl ${pillar.bg} border ${pillar.border} h-full group hover:scale-[1.02] transition-transform cursor-default`}>
                          <div className={`w-8 h-8 rounded-lg ${pillar.bg} flex items-center justify-center mb-3 ${pillar.color}`}>
                            {pillar.icon}
                          </div>
                          <h5 className={`text-sm font-bold ${pillar.color} mb-2`}>{pillar.title}</h5>
                          <p className="text-slate-500 text-[10px] leading-relaxed font-medium">{pillar.sources}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>

                {/* Agent Command Structure */}
                <Reveal delay={0.4}>
                  <div className="mb-2">
                    <h4 className="text-white font-black text-lg tracking-tight mb-1">My Agents</h4>
                    <p className="text-slate-500 text-xs font-medium">The intelligence units I deploy on every mission</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: "Sentinel",
                        role: "OSINT Reconnaissance",
                        desc: "Scans open-source intelligence to build a real-time picture of your target market's cultural, economic, and social landscape.",
                        color: "text-sky-400",
                        border: "border-sky-500/20",
                        bg: "bg-sky-500/5",
                      },
                      {
                        name: "Profiler",
                        role: "Cultural Deep Analysis",
                        desc: "Constructs psychographic profiles, identifies taboos, linguistic codes, and survey-sensitive topics unique to your audience.",
                        color: "text-amber-400",
                        border: "border-amber-500/20",
                        bg: "bg-amber-500/5",
                      },
                      {
                        name: "Architect",
                        role: "Instrument Design",
                        desc: "Generates statistically rigorous questionnaires from scratch using the Genesis Protocol, calibrated to your target's cultural context.",
                        color: "text-violet-400",
                        border: "border-violet-500/20",
                        bg: "bg-violet-500/5",
                      },
                      {
                        name: "Auditor",
                        role: "Quality Assurance",
                        desc: "Stress-tests every question for bias, ambiguity, double-barreling, leading language, and drop-off risk before deployment.",
                        color: "text-emerald-400",
                        border: "border-emerald-500/20",
                        bg: "bg-emerald-500/5",
                      },
                    ].map((agent, i) => (
                      <Reveal key={i} delay={0.45 + i * 0.08}>
                        <div className={`p-5 rounded-xl ${agent.bg} border ${agent.border} h-full group hover:scale-[1.01] transition-transform cursor-default`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-2 h-2 rounded-full ${agent.color.replace('text-', 'bg-')} shadow-[0_0_8px] shadow-current`} />
                            <span className={`text-sm font-black ${agent.color}`}>{agent.name}</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 ml-auto">{agent.role}</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{agent.desc}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>

                {/* How I Work - Philosophy */}
                <Reveal delay={0.6}>
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-emerald-500/10">
                    <h4 className="text-white font-black text-base mb-3">How I Think</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { num: "01", title: "Contextualise", desc: "I research your target market before touching a single question. No generic advice." },
                        { num: "02", title: "Stress-Test", desc: "Every question faces simulated respondents calibrated to your audience's real demographics." },
                        { num: "03", title: "Harden", desc: "I rewrite, restructure, and validate until the instrument is deployment-ready." },
                      ].map((step, i) => (
                        <div key={i} className="text-center">
                          <span className="text-emerald-400/50 text-3xl font-black">{step.num}</span>
                          <h5 className="text-white font-bold text-sm mt-1 mb-1">{step.title}</h5>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
          THE RESEARCH ICEBERG (SURVEY ECONOMICS)
      ════════════════════════════════════════════ */}
        <section className="section-full bg-white relative overflow-hidden border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
            <Reveal className="text-center mb-16">
              <div className="badge-blue inline-flex items-center gap-2 mb-6">
                <TrendingUp size={12} />
                {t.survey_mechanics.badge}
              </div>
              <h2 className="text-section-title text-slate-900 mb-6">
                {t.survey_mechanics.title}
              </h2>
              <p className="text-body-lg text-slate-500 font-medium max-w-2xl mx-auto">
                {t.survey_mechanics.description}
              </p>
            </Reveal>

            <div className="relative">
              {/* The Iceberg Silhouette */}
              <div className="max-w-5xl mx-auto">
                <div className="relative flex flex-col items-center">

                  {/* THE TIP (ABOVE WATER) */}
                  <Reveal className="w-full flex justify-center mb-0 relative z-20">
                    <div className="w-[300px] md:w-[400px] bg-blue-50 border-x border-t border-blue-100 rounded-t-[3rem] p-10 text-center pb-20 shadow-[0_-20px_40px_-15px_rgba(59,130,246,0.05)]">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Visible Effort</span>
                      <h3 className="text-slate-900 font-black text-lg mb-1 tracking-tight">Questionnaire Design</h3>
                      <p className="text-blue-600 font-black text-sm tracking-tight">Rs 50,000 – 150,000</p>
                    </div>
                  </Reveal>

                  {/* WATERLINE */}
                  <div className="w-full h-px bg-slate-200 relative z-30">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">
                      Surface Level
                    </div>
                  </div>

                  {/* THE BASE (BELOW WATER) */}
                  <div className="w-full space-y-4 pt-16 pb-32 relative flex flex-col items-center">
                    {/* Submerged Layer 1 */}
                    <Reveal delay={0.1} className="w-full flex justify-center">
                      <div className="w-full max-w-[550px] bg-slate-50 border border-slate-100 rounded-2xl p-6 flex justify-between items-center group hover:border-blue-200 transition-all shadow-sm">
                        <div>
                          <p className="text-slate-900 font-bold text-sm">{t.survey_mechanics.sample_recruitment}</p>
                          <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mt-0.5">{t.survey_mechanics.fieldwork_logistics}</p>
                        </div>
                        <span className="text-slate-600 font-black text-sm tracking-tighter">Rs 100k – 400k</span>
                      </div>
                    </Reveal>

                    {/* Submerged Layer 2 */}
                    <Reveal delay={0.2} className="w-full flex justify-center">
                      <div className="w-full max-w-[700px] bg-slate-50 border border-slate-100 rounded-2xl p-6 flex justify-between items-center group hover:border-blue-200 transition-all shadow-sm">
                        <div>
                          <p className="text-slate-900 font-bold text-sm">{t.survey_mechanics.data_collection}</p>
                          <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mt-0.5">{t.survey_mechanics.primary_execution}</p>
                        </div>
                        <span className="text-slate-600 font-black text-sm tracking-tighter">Rs 20k – 50k</span>
                      </div>
                    </Reveal>


                    {/* Submerged Layer 3 */}
                    <Reveal delay={0.3} className="w-full flex justify-center">
                      <div className="w-full max-w-[850px] bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-8 flex justify-between items-center group hover:border-blue-200 transition-all shadow-sm">
                        <div>
                          <p className="text-slate-900 font-bold text-sm">{t.survey_mechanics.analysis_reporting}</p>
                          <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mt-0.5">{t.survey_mechanics.post_field}</p>
                        </div>
                        <span className="text-slate-600 font-black text-sm tracking-tighter">Rs 30k – 100k</span>
                      </div>
                    </Reveal>

                    {/* THE VOID / RISK */}
                    <Reveal delay={0.35} className="mt-12 flex justify-center">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-default">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{t.survey_mechanics.source}</span>
                      </div>
                    </Reveal>

                    <Reveal delay={0.4} className="text-center pt-12 pb-12">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                        <AlertTriangle size={12} />
                        {t.survey_mechanics.danger_zone}
                      </p>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{t.survey_mechanics.risk_title}</h4>
                      <p className="text-slate-400 font-black text-3xl tracking-tighter mb-12">Rs 200,000 — 800,000</p>
                      <button
                        onClick={() => setShowShieldModal(true)}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-600/30 transition-all transform hover:-translate-y-1 active:scale-95 group"
                      >
                        <ShieldCheck size={16} className="text-blue-400 group-hover:text-white transition-colors" />
                        {t.survey_mechanics.shield_btn}
                      </button>
                    </Reveal>
                  </div>


                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── NEW: SURVEY ARCHITECT (Genesis Suite) ─── */}
        <section id="genesis" className="section-full bg-slate-950 py-24 relative overflow-hidden">
          <div className="absolute inset-0 hero-dot-grid opacity-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Reveal className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Sparkles size={12} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  {t.architect.badge}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 uppercase">
                {t.architect.title}
              </h2>
              <p className="text-body-lg text-slate-400 font-medium max-w-2xl mx-auto">
                {t.architect.sub}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <SurveyArchitect />
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════ */}
        < section id="pricing" className="section-full section-soft relative" >
          <div className="max-w-5xl mx-auto px-6 w-full">
            <Reveal className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
                {t.pricing.title}
              </h2>
              <p className="text-lg text-slate-500 font-medium">{t.pricing.sub}</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free */}
              <Reveal delay={0}>
                <div className="card-elevated p-8 h-full">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Tier 1</div>
                  <div className="text-4xl font-black text-slate-900 mb-1">MUR 0</div>
                  <p className="text-xs text-slate-400 font-medium mb-6">{t.pricing.tier1_name}</p>
                  <ul className="space-y-3 mb-8">
                    {t.pricing.tier1_features.map((f, i) => (
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
                    {t.pricing.try_free}
                  </Link>
                </div>
              </Reveal>

              {/* Standard */}
              <Reveal delay={0.1}>
                <div className="card-featured p-8 h-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                    {t.pricing.most_popular}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Tier 2</div>
                  <div className="text-4xl font-black text-slate-900 mb-1">MUR 5,000</div>
                  <p className="text-xs text-slate-400 font-medium mb-6">{t.pricing.tier2_name}</p>
                  <ul className="space-y-3 mb-8">
                    {t.pricing.tier2_features.map((f, i) => (
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
                    {t.pricing.get_started}
                  </Link>
                </div>
              </Reveal>

              {/* Pro */}
              <Reveal delay={0.2}>
                <div className="card-elevated p-8 h-full">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-3">Tier 3</div>
                  <div className="text-4xl font-black text-slate-900 mb-1">MUR 45,000</div>
                  <p className="text-xs text-slate-400 font-medium mb-6">{t.pricing.tier3_name}</p>
                  <ul className="space-y-3 mb-8">
                    {t.pricing.tier3_features.map((f, i) => (
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
                    {t.pricing.contact_access}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="text-center mt-8">
              <p className="text-slate-400 text-xs font-bold">
                {t.pricing.enterprise} →{" "}
                <a href="mailto:hello@thebureau.mu" className="text-blue-600 hover:underline">
                  {t.pricing.contact_us}
                </a>
              </p>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════ */}
        < section className="section-full section-white relative" >
          <div className="max-w-4xl mx-auto px-6 w-full text-center">
            <Reveal>
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full hero-dot-grid opacity-40 pointer-events-none" />

                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                    {t.final_cta.title_1}{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {t.final_cta.title_2}
                    </span>
                  </h2>
                  <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto mb-10">
                    {t.final_cta.sub}
                  </p>
                  <button
                    onClick={() => setShowEntryModal(true)}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Zap size={18} />
                    {t.final_cta.btn}
                    <ArrowRight size={18} />
                  </button>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-6">
                    {t.final_cta.footer}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section >

        {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
        < footer className="border-t border-slate-100 py-12 bg-white" >
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
                <a href="#how-it-works" className="hover:text-slate-700 transition-colors uppercase tracking-widest">{t.nav.how_it_works}</a>
                <a href="#who-its-for" className="hover:text-slate-700 transition-colors uppercase tracking-widest">{t.nav.who_its_for}</a>
                <a href="#pricing" className="hover:text-slate-700 transition-colors uppercase tracking-widest">{t.nav.pricing}</a>
                <button onClick={() => setShowEntryModal(true)} className="hover:text-slate-700 transition-colors uppercase tracking-widest">{t.nav.open_lab}</button>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                © {new Date().getFullYear()} The Bureau · Ebène, Mauritius
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-medium max-w-lg mx-auto">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </footer >
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
                        router.push('/lab');
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
      <AVAChat />
      <Footer dark={false} />
    </main>
  );
}
