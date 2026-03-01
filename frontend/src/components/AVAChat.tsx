"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { usePathname } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const AVA_GREETING = "Hello! I'm AVA, CEO of The Bureau. I help researchers and organisations build flawless surveys. Tell me about your project — what are you trying to measure, and who's your audience?";

function renderMarkdownLite(text: string) {
    // Simple bold + line break rendering
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        // Handle line breaks
        const lines = part.split("\n");
        return lines.map((line, j) => (
            <React.Fragment key={`${i}-${j}`}>
                {j > 0 && <br />}
                {line}
            </React.Fragment>
        ));
    });
}

import { useChat } from "@/context/ChatContext";

interface AVAChatProps {
    // Props are now handled via context, but we keep the interface for compatibility
}

export default function AVAChat({ }: AVAChatProps = {}) {
    const { isChatOpen: isOpen, setIsChatOpen: setIsOpen } = useChat();
    const pathname = usePathname();

    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: AVA_GREETING }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const { currency } = useCurrency();

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
            const response = await fetch(`${API_URL}/chat/ava`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    currency: currency.code, // Pass detected currency
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to get response");
            }

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I'm experiencing a brief interruption. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Gate rendering AFTER all hooks (React 19 requires hooks to always run in the same order)
    if (pathname === '/os' || pathname === '/') return null;


    return (
        <>
            {/* ─── FLOATING BUTTON ─── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="chat-fab"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() => { setIsOpen(true); setHasUnread(false); }}
                        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-[90] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 group cursor-pointer"
                        aria-label="Chat with AVA"
                    >
                        {/* AVA mini avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                            <Image
                                src="/images/ava_Avatar.webp"
                                alt="AVA"
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Unread pulse */}
                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-bounce">
                                1
                            </span>
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-white/10">
                                Chat with me
                                <div className="absolute top-full right-6 w-2 h-2 bg-slate-900 rotate-45 -translate-y-1 border-r border-b border-white/10" />
                            </div>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── CHAT PANEL ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-panel"
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-[90] w-[calc(100vw-2rem)] sm:w-[400px] h-[calc(100vh-5rem)] max-h-[560px] sm:h-[560px] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/50"
                        style={{
                            background: "linear-gradient(165deg, rgba(15,23,42,0.98) 0%, rgba(5,15,30,0.99) 100%)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        {/* ─── HEADER ─── */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/40">
                                    <Image
                                        src="/images/ava_Avatar.webp"
                                        alt="AVA"
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white text-sm font-bold tracking-wide">AVA</p>
                                <p className="text-emerald-400/80 text-[10px] uppercase tracking-[0.15em] font-medium">
                                    Online · CEO, The Bureau
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* ─── MESSAGES ─── */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500/30 flex-shrink-0 mt-0.5">
                                            <Image
                                                src="/images/ava_Avatar.webp"
                                                alt="AVA"
                                                width={28}
                                                height={28}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === "user"
                                            ? "bg-emerald-600/80 text-white rounded-br-md"
                                            : "bg-white/[0.06] text-slate-300 rounded-bl-md border border-white/[0.04]"
                                            }`}
                                    >
                                        {msg.role === "assistant" ? renderMarkdownLite(msg.content) : msg.content}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex gap-2.5 justify-start">
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500/30 flex-shrink-0 mt-0.5">
                                        <Image
                                            src="/images/ava_Avatar.webp"
                                            alt="AVA"
                                            width={28}
                                            height={28}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="bg-white/[0.06] border border-white/[0.04] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── INPUT ─── */}
                        <div className="px-4 py-3 border-t border-white/[0.06]">
                            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-emerald-500/40 transition-colors duration-300">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything about your survey..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 outline-none"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-600 text-center mt-2 tracking-wide">
                                BUREAU INTELLIGENCE · CONFIDENTIAL
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
