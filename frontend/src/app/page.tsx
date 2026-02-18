"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Globe, Cpu, ArrowRight, Sparkles, Sun, Moon,
  Shield, BarChart3, FileText, Users, Target, Microscope, X,
} from "lucide-react";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";

/* ─── Typewriter Hook ─── */
function useTypewriter(text: string, speed = 45, delay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

/* ─── Floating Particles (client-only) ─── */
function Particles({ dark }: { dark: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const seeds = Array.from({ length: 30 }, (_, i) => ({
    left: ((i * 37 + 13) % 100),
    top: ((i * 53 + 7) % 100),
    dur: 4 + (i % 7),
    delay: (i * 0.17) % 5,
    drift: ((i % 2 === 0 ? 1 : -1) * ((i * 11) % 30)),
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {seeds.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${dark ? "bg-emerald-500/20" : "bg-emerald-500/15"}`}
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{
            y: [0, -30 - (i % 6) * 10, 0],
            x: [0, s.drift, 0],
            opacity: [0, dark ? 0.6 : 0.4, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Grid Background ─── */
function GridBackground({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className={`absolute inset-0 ${dark ? "opacity-[0.03]" : "opacity-[0.04]"}`}
        style={{
          backgroundImage: `
            linear-gradient(${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"} 1px, transparent 1px),
            linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className={`absolute -left-[10%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] ${dark ? "bg-emerald-600/8" : "bg-emerald-400/10"}`} />
      <div className={`absolute -right-[5%] bottom-0 w-[500px] h-[500px] rounded-full blur-[100px] ${dark ? "bg-blue-600/5" : "bg-blue-400/8"}`} />
      <div className={`absolute left-1/2 -top-[10%] w-[400px] h-[300px] rounded-full blur-[100px] ${dark ? "bg-amber-500/4" : "bg-amber-400/6"}`} />
    </div>
  );
}

/* ─── Theme Toggle Button ─── */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.8, duration: 0.5 }}
      onClick={onToggle}
      className={`absolute top-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer backdrop-blur-md ${dark
        ? "bg-white/10 border border-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
        : "bg-slate-900/5 border border-slate-200 hover:bg-slate-900/10 text-slate-500 hover:text-slate-800 shadow-sm"
        }`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
            <Sun className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }}>
            <Moon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRANSITIONAL PORTAL MODAL
   ═══════════════════════════════════════════════════════════════ */
type PortalType = "discover" | "cockpit" | null;

const PORTAL_DATA = {
  discover: {
    icon: Globe,
    accentFrom: "from-blue-500",
    accentTo: "to-sky-400",
    accentText: "text-blue-400",
    accentTextLight: "text-blue-600",
    accentBg: "bg-blue-500/10",
    accentBgLight: "bg-blue-50",
    accentBorder: "border-blue-500/20",
    accentBorderLight: "border-blue-200",
    title: "Entering The Bureau",
    subtitle: "My public-facing world",
    description: "You're about to explore who I am, what I do, and why survey intelligence matters. This is where I present my methodology, my vision for the future of research, and how I'm reshaping global survey design.",
    features: [
      { icon: Shield, label: "My Methodology", desc: "How I audit and optimize surveys" },
      { icon: BarChart3, label: "Live Proof", desc: "Real metrics from real audits" },
      { icon: Users, label: "Who It's For", desc: "Industries I serve globally" },
      { icon: FileText, label: "Genesis Suite", desc: "I create surveys from scratch" },
    ],
    cta: "Enter The Bureau",
    href: "/landing",
  },
  cockpit: {
    icon: Cpu,
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-400",
    accentText: "text-emerald-400",
    accentTextLight: "text-emerald-600",
    accentBg: "bg-emerald-500/10",
    accentBgLight: "bg-emerald-50",
    accentBorder: "border-emerald-500/20",
    accentBorderLight: "border-emerald-200",
    title: "Survey Any Slice of the Global Market",
    subtitle: "My Mission Control & AI Lab",
    description: 'This is where the work happens. Choose the country you want to probe into. My agents and me will  brief you about the "dos and donts" — We will research your target market, build the relevant cultural dossiers, and generate statistically rigorous survey instruments — all in real time. Try me...',
    features: [
      { icon: Target, label: "Mission Control", desc: "Configure demographics, country and language" },
      { icon: Microscope, label: "Sentinel & Profiler", desc: "My agents researching your target market live" },
      { icon: BarChart3, label: "Cultural Dossier", desc: "Deep-dive audience intelligence reports" },
      { icon: FileText, label: "Field Instrument", desc: "Publication-ready questionnaires" },
    ],
    cta: "Launch Cockpit",
    href: "/mission-control",
  },
};

function TransitionalModal({
  portal,
  dark,
  onClose,
}: {
  portal: PortalType;
  dark: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  if (!portal) return null;
  const data = PORTAL_DATA[portal];
  const Icon = data.icon;

  const handleEnter = () => {
    setEntering(true);
    setTimeout(() => {
      router.push(data.href);
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="portal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          className={`absolute inset-0 ${dark ? "bg-black/70" : "bg-white/80"} backdrop-blur-xl`}
          onClick={onClose}
        />

        {/* Entering flash overlay */}
        <AnimatePresence>
          {entering && (
            <motion.div
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
              className={`absolute inset-0 z-[200] ${dark ? "bg-[#060B18]" : "bg-white"}`}
            />
          )}
        </AnimatePresence>

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-[110] w-full max-w-lg mx-4 flex flex-col max-h-[90vh] rounded-3xl overflow-hidden transition-colors duration-700 ${dark
            ? "bg-slate-900/95 border border-white/10 shadow-2xl shadow-black/50"
            : "bg-white border border-slate-200 shadow-2xl shadow-slate-200/60"
            }`}
        >
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${dark ? "hover:bg-white/10 text-slate-500 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="p-8 pb-0">
              {/* Icon + Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.accentFrom} ${data.accentTo} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                    {data.title}
                  </h2>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? data.accentText : data.accentTextLight}`}>
                    {data.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm leading-relaxed mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {data.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="px-8 pb-6">
              <div className="grid grid-cols-2 gap-3">
                {data.features.map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      className={`p-3.5 rounded-xl transition-all duration-300 ${dark
                        ? `${data.accentBg} border ${data.accentBorder}`
                        : `${data.accentBgLight} border ${data.accentBorderLight}`
                        }`}
                    >
                      <FIcon className={`w-4 h-4 mb-2 ${dark ? data.accentText : data.accentTextLight}`} />
                      <div className={`text-[11px] font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        {f.label}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        {f.desc}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
          {/* Footer / CTA */}
          <div className={`px-8 py-5 border-t transition-colors duration-700 ${dark ? "border-white/5 bg-slate-950/50" : "border-slate-100 bg-slate-50/50"
            }`}>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleEnter}
              disabled={entering}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${entering
                ? "opacity-50 cursor-wait"
                : ""
                } bg-gradient-to-r ${data.accentFrom} ${data.accentTo} text-white hover:shadow-lg hover:shadow-${portal === "discover" ? "blue" : "emerald"}-500/20 hover:-translate-y-0.5 active:translate-y-0`}
            >
              {entering ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ) : (
                <>
                  <span>{data.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN GATEWAY COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AVAGateway() {
  const [loading, setLoading] = useState(true);
  const greeting = useTypewriter("Hello. I'm AVA.", 55, 1000);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [showCTAs, setShowCTAs] = useState(false);
  const [dark, setDark] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activePortal, setActivePortal] = useState<PortalType>(null);

  useEffect(() => {
    if (greeting.done && !loading) {
      // Slowed down the staging for a more cinematic feel
      const t1 = setTimeout(() => setShowSubtitle(true), 500);
      const t2 = setTimeout(() => setShowBody(true), 1200);
      const t3 = setTimeout(() => setShowCTAs(true), 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [greeting.done, loading]);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden flex items-center justify-center transition-colors duration-700 py-12 md:py-20 ${dark ? "bg-[#060B18] text-white" : "bg-white text-slate-900"
      }`}>
      <GridBackground dark={dark} />
      <Particles dark={dark} />
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />

      {/* ─── TRANSITIONAL MODAL ─── */}
      <AnimatePresence>
        {activePortal && (
          <TransitionalModal
            portal={activePortal}
            dark={dark}
            onClose={() => setActivePortal(null)}
          />
        )}
      </AnimatePresence>

      {/* ─── CONTENT CONTAINER ─── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24 w-full max-w-7xl mx-auto px-6 lg:px-12">

        {/* ─── LEFT: AVA PORTRAIT ─── */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
          className="relative flex-shrink-0"
        >
          {/* Glow ring behind AVA */}
          <motion.div
            className="absolute inset-0 -m-4 rounded-full"
            style={{
              background: dark
                ? "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Portrait container */}
          <div className="relative w-[280px] h-[340px] md:w-[320px] md:h-[400px] lg:w-[380px] lg:h-[480px] xl:w-[420px] xl:h-[530px]">
            {/* Border glow (dark only) */}
            {dark && (
              <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
            )}
            <div className={`relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-700 ${dark
              ? "bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-white/5"
              : "bg-transparent"
              }`}>
              <Image
                src="/images/AVA.webp"
                alt="AVA — Survey Intelligence Analyst"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Bottom gradient overlay */}
              <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t transition-colors duration-700 ${dark ? "from-[#060B18]" : "from-white"
                } to-transparent`} />
            </div>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md transition-all duration-700 ${dark
                ? "bg-slate-900/90 border border-emerald-500/30"
                : "bg-white/90 border border-emerald-200 shadow-lg shadow-emerald-100/30"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-700 ${dark ? "text-emerald-300" : "text-emerald-600"
                }`}>Online</span>
            </motion.div>
          </div>
        </motion.div>

        {/* ─── RIGHT: GREETING + CTAs ─── */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg lg:max-w-xl">

          {/* Bureau Monogram */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-700 ${dark
              ? "bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/20"
              : "bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200"
              }`}>
              <Sparkles className={`w-4 h-4 transition-colors duration-700 ${dark ? "text-amber-400" : "text-amber-500"}`} />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-colors duration-700 ${dark ? "text-amber-400/70" : "text-amber-600/70"
              }`}>
              The Bureau
            </span>
          </motion.div>

          {/* Typewriter Greeting */}
          <div className="mb-4 min-h-[56px] md:min-h-[72px]">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight transition-colors duration-700 ${dark ? "text-white" : "text-slate-900"
              }`}>
              {greeting.displayed}
              {!greeting.done && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-[3px] h-[0.85em] bg-emerald-400 ml-1 align-middle rounded-full"
                />
              )}
            </h1>
          </div>

          {/* Subtitle */}
          <AnimatePresence>
            {showSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`text-lg md:text-xl lg:text-2xl font-medium mb-5 transition-colors duration-700 ${dark ? "text-emerald-300/90" : "text-emerald-600"
                  }`}
              >
                Your Survey Intelligence Analyst.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Body */}
          <AnimatePresence>
            {showBody && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`text-sm md:text-base leading-relaxed mb-10 max-w-md transition-colors duration-700 ${dark ? "text-slate-400" : "text-slate-500"
                  }`}
              >
                I transform survey research through AI-powered cultural intelligence.
                From cultural dossiers to statistically rigorous field instruments —
                I handle the complexity so you can focus on insight.
                Get my agents at work.
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTAs — Now open transitional modals */}
          <AnimatePresence>
            {showCTAs && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                {/* CTA 1: Discover */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div
                    onClick={() => setActivePortal("discover")}
                    onMouseEnter={() => setHoveredCard("discover")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`group relative flex items-center gap-4 px-7 py-4 rounded-2xl backdrop-blur-md cursor-pointer transition-all duration-500 w-full sm:w-[300px] min-h-[100px] ${dark
                      ? "border border-white/10 bg-white/[0.03] hover:border-slate-500/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-slate-500/5"
                      : "border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-100/40 shadow-md shadow-slate-100"
                      }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${dark
                      ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20"
                      : "bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200"
                      }`}>
                      <Globe className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${dark ? "text-blue-400" : "text-blue-500"}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold tracking-wide transition-colors duration-700 ${dark ? "text-white" : "text-slate-800"}`}>
                        Discover The Bureau
                      </div>
                      <div className={`text-[11px] mt-0.5 transition-colors duration-700 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        My methodology & vision
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-all duration-300 group-hover:translate-x-1 ${dark ? "text-slate-600 group-hover:text-blue-400" : "text-slate-300 group-hover:text-blue-500"
                      }`} />
                  </div>
                </motion.div>

                {/* CTA 2: Enter Cockpit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
                >
                  <div
                    onClick={() => setActivePortal("cockpit")}
                    onMouseEnter={() => setHoveredCard("cockpit")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`group relative flex items-center gap-4 px-7 py-4 rounded-2xl backdrop-blur-md cursor-pointer transition-all duration-500 w-full sm:w-[300px] min-h-[100px] ${dark
                      ? "border border-emerald-500/20 bg-emerald-500/[0.05] hover:border-emerald-400/40 hover:bg-emerald-500/[0.1] hover:shadow-lg hover:shadow-emerald-500/10"
                      : "border border-emerald-200 bg-emerald-50/30 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-100/40 shadow-md shadow-emerald-50"
                      }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${dark
                      ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20"
                      : "bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200"
                      }`}>
                      <Cpu className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${dark ? "text-emerald-400" : "text-emerald-500"}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold tracking-wide transition-colors duration-700 ${dark ? "text-white" : "text-slate-800"}`}>
                        Capture insights from any corner of the globe.
                      </div>
                      <div className={`text-[11px] mt-0.5 transition-colors duration-700 ${dark ? "text-emerald-500/70" : "text-emerald-600/70"}`}>
                        Mission Control & AI Lab
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-all duration-300 group-hover:translate-x-1 ${dark ? "text-emerald-600 group-hover:text-emerald-300" : "text-emerald-300 group-hover:text-emerald-500"
                      }`} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Powered by line */}
          <AnimatePresence>
            {showCTAs && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="mt-10 flex items-center gap-3"
              >
                <div className={`w-px h-4 transition-colors duration-700 ${dark ? "bg-slate-800" : "bg-slate-200"}`} />
                <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-700 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                  Proprietary AI
                </span>
                <span className={`text-[10px] transition-colors duration-700 ${dark ? "text-slate-700" : "text-slate-300"}`}>•</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-700 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                  Bureau v2.0
                </span>
                <div className={`w-px h-4 transition-colors duration-700 ${dark ? "bg-slate-800" : "bg-slate-200"}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── BOTTOM EDGE LINE ─── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent transition-colors duration-700 ${dark ? "via-emerald-500/30" : "via-emerald-400/20"
          }`}
      />

      <div className="absolute bottom-0 left-0 right-0 z-50">
        <Footer dark={dark} />
      </div>
    </div>
  );
}
