"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

type Phase = "promo" | "register" | "success";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [phase, setPhase] = useState<Phase>("promo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    position: "",
  });

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promo_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("promo_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        await fetch(`${apiUrl}/early-adopter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }).catch(() => {
          // Silently handle if endpoint doesn't exist yet
          console.log("[Early Adopter Registration]", form);
        });
      } else {
        console.log("[Early Adopter Registration]", form);
      }
    } catch {
      console.log("[Early Adopter Registration - Offline]", form);
    }

    setIsSubmitting(false);
    setPhase("success");

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      handleDismiss();
    }, 3000);
  };

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isFormValid = form.fullName && form.email && form.company && form.position;

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#2E4036]/20 backdrop-blur-sm pointer-events-auto"
            onClick={handleDismiss}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md bg-[#2E4036] text-white rounded-[2rem] shadow-2xl shadow-[#2E4036]/50 pointer-events-auto border border-white/5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#CC5833]/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors text-white/30 hover:text-white z-20"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {/* ─── Phase 1: Promo ─── */}
                {phase === "promo" && (
                  <motion.div
                    key="promo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full bg-[#CC5833]/15 border border-[#CC5833]/25">
                      <Sparkles size={10} className="text-[#CC5833]" />
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#CC5833]">
                        Early Access
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-2xl sm:text-[1.7rem] font-black uppercase tracking-tight mb-2 leading-[1.1]">
                      You&apos;re Early.
                    </h3>
                    <h3 className="text-2xl sm:text-[1.7rem] font-black uppercase tracking-tight mb-6 leading-[1.1]">
                      <span className="text-[#CC5833]">That&apos;s Strategic.</span>
                    </h3>

                    {/* Body */}
                    <p className="text-[13px] font-medium text-white/60 leading-relaxed mb-8 max-w-sm">
                      The Bureau is in its founding phase. Early adopters get a strategic head start with{" "}
                      <span className="text-white font-bold">3 complimentary uses</span>{" "}
                      of AVA&apos;s validation engine across any tool — for a total value of up to{" "}
                      <span className="text-white font-bold">MUR 30,000.</span> Thank you in advance. Your feedback is important as it will shape AVA's future.
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => setPhase("register")}
                      className="w-full py-4 bg-[#CC5833] text-white rounded-full text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#b84a2b] transition-all shadow-lg shadow-[#CC5833]/25 active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                      Become an Early Adopter
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Skip */}
                    <button
                      onClick={handleDismiss}
                      className="mt-4 text-[10px] font-bold text-white/25 uppercase tracking-widest hover:text-white/50 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </motion.div>
                )}

                {/* ─── Phase 2: Register ─── */}
                {phase === "register" && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                          Founding Cohort
                        </span>
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight leading-tight">
                        Join The Inner Circle
                      </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {[
                        { key: "fullName" as const, label: "Full Name", type: "text", placeholder: "Dr. Jane Doe" },
                        { key: "email" as const, label: "Email Address", type: "email", placeholder: "jane@institution.org" },
                        { key: "company" as const, label: "Company / Institution", type: "text", placeholder: "Research Institute" },
                        { key: "position" as const, label: "Position", type: "text", placeholder: "Head of Research" },
                      ].map((field) => (
                        <div key={field.key} className="relative">
                          <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5">
                            {field.label} <span className="text-[#CC5833]">*</span>
                          </label>
                          <input
                            type={field.type}
                            value={form[field.key]}
                            onChange={updateField(field.key)}
                            placeholder={field.placeholder}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder:text-white/15 focus:outline-none focus:border-[#CC5833]/50 focus:bg-white/[0.07] transition-all"
                          />
                        </div>
                      ))}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={!isFormValid || isSubmitting}
                          className="w-full py-4 bg-[#CC5833] text-white rounded-full text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#b84a2b] transition-all shadow-lg shadow-[#CC5833]/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Registering...
                            </>
                          ) : (
                            "Secure My Access"
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPhase("promo")}
                        className="w-full text-center text-[10px] font-bold text-white/25 uppercase tracking-widest hover:text-white/50 transition-colors pt-1"
                      >
                        ← Back
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ─── Phase 3: Success ─── */}
                {phase === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#CC5833]/20 flex items-center justify-center mb-6">
                      <CheckCircle2 size={32} className="text-[#CC5833]" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                      Welcome to the Founding Cohort
                    </h3>
                    <p className="text-sm font-medium text-white/50 leading-relaxed">
                      You&apos;re now part of something extraordinary. We&apos;ll be in touch.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
