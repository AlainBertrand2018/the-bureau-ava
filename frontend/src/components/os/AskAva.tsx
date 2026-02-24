"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, AppId } from '@/context/OSContext';
import Image from 'next/image';
import { CornerDownLeft, Command, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { avaKnowledge, KnowledgeNode } from '@/config/avaKnowledge';

interface Message {
    role: 'ava' | 'user';
    content: string;
}

interface Job {
    label: string;
    type: 'app' | 'link';
    target: string;
    consentQuestion: string;
    costInfo: string;
}

const RESPONSE_POOLS = {
    greetings: [
        "Hello! I am AVA, your research intelligence officer. How can I assist your workflow today?",
        "Welcome. I'm AVA. Which tactical research operation shall we initialize today?",
        "Greetings. AVA systems active. How can I support your survey architecture or analysis?",
        "Systems online. I am AVA. Ready to deploy specialized market research tools for you."
    ],
    fallbacks: [
        "I am sorry, my intelligence is strictly focused on Market Research Tools and Methodology.",
        "My protocols are specialized for Market Research only. I cannot assist with that request.",
        "That falls outside the SOB framework. I only specialize in tactical survey optimization tools.",
        "I am optimized for market reconnaissance and survey auditing. Please keep requests within that scope."
    ],
    acknowledgments: [
        "Understood. I am standing by for your next command.",
        "Acknowledged. Monitoring your workflow progress.",
        "Confirmed. Awaiting further tactical instructions.",
        "Received. I'm active and ready for your next requirement."
    ],
    redirections: [
        "Ok. I am now redirecting you to the service.",
        "Initializing core protocols. Transferring you now.",
        "Understood. Launching the requested intelligence suite.",
        "Sectors aligned. Accessing the specialized tool for you."
    ]
};

const getRandomResponse = (pool: keyof typeof RESPONSE_POOLS) => {
    const list = RESPONSE_POOLS[pool];
    return list[Math.floor(Math.random() * list.length)];
};

const AskAva: React.FC = () => {
    const { wallpaper, launchApp } = useOS();
    const router = useRouter();
    const isLight = wallpaper === 'clinical-white';
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ava', content: 'What do you want to do today?' }
    ]);
    const [pendingJob, setPendingJob] = useState<Job | null>(null);
    const [currentContext, setCurrentContext] = useState<Job | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const jobs: Job[] = [
        {
            label: 'Stress Testing',
            type: 'app',
            target: 'lab',
            consentQuestion: "I can initialize a Stress Test to validate your instrument. Shall I open the Lab?",
            costInfo: "Stress Testing (The Lab) is a premium audit service priced at €300 per instrument."
        },
        {
            label: 'Survey from Scratch',
            type: 'app',
            target: 'genesis',
            consentQuestion: "Genesis is ready to build your questionnaire from the ground up. Ready to start?",
            costInfo: "Genesis protocol (Generation + Self-Stress Audit) is priced at €378 per run."
        },
        {
            label: 'Market Recon',
            type: 'app',
            target: 'sentinel',
            consentQuestion: "Sentinel is standing by for market reconnaissance. Should I deploy the system?",
            costInfo: "Market Reconnaissance (Sentinel) is currently available as a COMPLIMENTARY service (FREE)."
        },
        {
            label: 'Result Analysis',
            type: 'app',
            target: 'interpreter',
            consentQuestion: "Our Result Interpreter is ready to decode your data. Would you like me to open the Interpretation Suite?",
            costInfo: "Result Analysis (The Interpreter) is priced at €240 per full data set analysis."
        },
        {
            label: 'Agent information',
            type: 'link',
            target: '/agents',
            consentQuestion: "We have a team of skillful agents at your service. Do you want to learn more about them?",
            costInfo: "Information regarding our Agentic Roster is complimentary."
        },
        {
            label: 'Information about The Bureau',
            type: 'link',
            target: '/landing',
            consentQuestion: "I can provide a full briefing on The Bureau's operations. Shall I take you there?",
            costInfo: "Methodology and mission briefings are complimentary."
        },
        {
            label: 'Glossary',
            type: 'link',
            target: '/glossary',
            consentQuestion: "Our Intelligence Glossary contains all specialized terminology. Do you wish to consult it?",
            costInfo: "Consulting the Intelligence Glossary is free of charge."
        }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const performSmoothRedirection = (job: Job) => {
        setMessages(prev => [...prev, { role: 'ava', content: getRandomResponse('redirections') }]);

        setTimeout(() => {
            if (job.type === 'app') {
                launchApp(job.target as AppId);
            } else {
                router.push(job.target);
            }
            setPendingJob(null);
            setCurrentContext(null);
        }, 1200);
    };

    const handleSearch = (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setQuery('');

        const t = text.toLowerCase().trim();

        // 1. Layer: Consent Handshake (PRIORITY if a job is offered)
        const isYes = ['yes', 'sure', 'ok', 'please', 'yeah', 'do it', 'yep', 'confirm', 'go', 'open', 'start'].some(word => t.includes(word));
        if (pendingJob && isYes && !t.includes('how much') && !t.includes('cost')) {
            return performSmoothRedirection(pendingJob);
        }

        // 2. Layer: Tool/Job Identification
        const findJob = (input: string) => {
            if (input.includes('stress') || input.includes('test') || input.includes('validate') || input.includes('lab')) return jobs[0];
            if (input.includes('scratch') || input.includes('create') || input.includes('new') || input.includes('build') || input.includes('questionnaire') || input.includes('survey')) {
                if (input.includes('analyze') || input.includes('results') || input.includes('interpret') || input.includes('analysis')) return jobs[3];
                return jobs[1];
            }
            if (input.includes('recon') || input.includes('market') || input.includes('scout') || input.includes('sentinel')) return jobs[2];
            if (input.includes('analyze') || input.includes('analysis') || input.includes('results') || input.includes('interpret') || input.includes('interpreter')) return jobs[3];
            if (input.includes('agent') || input.includes('roster') || input.includes('who')) return jobs[4];
            if (input.includes('bureau') || input.includes('operations') || input.includes('about')) return jobs[5];
            if (input.includes('glossary') || input.includes('terms') || input.includes('dictionary')) return jobs[6];
            return undefined;
        };

        const detectedJob = findJob(t);

        // 3. Layer: Knowledge Base Retrieval (NEW Intelligence Bridge)
        const findKnowledge = (input: string) => {
            return avaKnowledge.find(node =>
                node.keywords.some(keyword => input.includes(keyword))
            );
        };

        const detectedKnowledge = findKnowledge(t);

        // 4. Layer: Contextual Modifiers (Cost/Price)
        const activeJob = detectedJob || pendingJob || currentContext;
        if ((t.includes('how much') || t.includes('cost') || t.includes('price')) && activeJob) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'ava',
                    content: `${activeJob.costInfo} ${activeJob.consentQuestion}`
                }]);
                setPendingJob(activeJob);
                setCurrentContext(activeJob);
            }, 600);
            return;
        }

        // 5. Layer: Knowledge Response Logic
        if (detectedKnowledge && !detectedJob) {
            setTimeout(() => {
                const ctaJob = detectedKnowledge.cta ? jobs.find(j => j.label === detectedKnowledge.cta) : null;
                const response = ctaJob
                    ? `${detectedKnowledge.content} ${ctaJob.consentQuestion}`
                    : detectedKnowledge.content;

                setMessages(prev => [...prev, { role: 'ava', content: response }]);
                if (ctaJob) setPendingJob(ctaJob);
            }, 600);
            return;
        }

        // 6. Layer: Acknowledgments (Only if no job/knowledge detected)
        const acknowledgmentWords = ['ok', 'thanks', 'thank you', 'cool', 'fine', 'got it', 'understood', 'great', 'awesome', 'excellent'];
        const isAcknowledgment = acknowledgmentWords.some(word => t.includes(word));

        if (isAcknowledgment && !detectedJob && !detectedKnowledge) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'ava',
                    content: getRandomResponse('acknowledgments')
                }]);
                setPendingJob(null);
            }, 500);
            return;
        }

        // 7. Layer: Greetings
        if (t === 'hello' || t === 'hi' || t === 'hey' || t.startsWith('hello ') || t.startsWith('hi ')) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'ava',
                    content: getRandomResponse('greetings')
                }]);
            }, 600);
            return;
        }

        // 8. Layer: Final Handshake Suggestion
        setTimeout(() => {
            if (detectedJob) {
                setPendingJob(detectedJob);
                setCurrentContext(detectedJob);
                setMessages(prev => [...prev, { role: 'ava', content: detectedJob!.consentQuestion }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'ava',
                    content: getRandomResponse('fallbacks')
                }]);
            }
        }, 600);
    };

    const executeShortcut = (label: string) => {
        const job = jobs.find(j => j.label === label);
        if (!job) return;
        setMessages(prev => [...prev, { role: 'ava', content: `Understood. Initializing ${label} protocol...` }]);
        performSmoothRedirection(job);
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="w-full md:w-2/5 px-6 flex flex-col items-center pointer-events-auto relative"
            >
                {/* Chat History Area - Anchored bottom-full to grow UPWARD */}
                <div
                    ref={scrollRef}
                    className="absolute bottom-full left-0 right-0 mb-10 flex flex-col gap-3 overflow-y-auto no-scrollbar max-h-[50vh] px-2"
                >
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={`${msg.role}-${i}`}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`w-full flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-1 px-4`}
                            >
                                <div className={`flex items-end gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row' : 'flex-row'}`}>
                                    {/* Order-reversed for User Role to force Avatar to the far right */}
                                    {msg.role === 'ava' && (
                                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/5 shadow-md bg-black/20">
                                            <Image src="/images/ava_Avatar.webp" alt="AVA" fill className="opacity-90 object-cover" />
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`px-4 py-2 rounded-[1.25rem] text-[clamp(0.85rem,0.95vw,1rem)] font-light tracking-tight border shadow-sm ${msg.role === 'user'
                                        ? (isLight ? 'bg-slate-900 text-white border-slate-800 rounded-br-none' : 'bg-white/10 text-white border-white/5 rounded-br-none shadow-xl')
                                        : (isLight ? 'bg-white/80 text-slate-700 border-slate-200 rounded-bl-none shadow-lg' : 'bg-black/40 text-slate-300 border-white/5 backdrop-blur-xl rounded-bl-none')
                                        }`}>
                                        {msg.content}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/5 shadow-md bg-slate-700">
                                            <div className="w-full h-full flex items-center justify-center text-white/30">
                                                <UserIcon className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Command Bar Area - Fixed in initial position */}
                <div className="w-full flex flex-col gap-8">
                    <div className={`w-full relative group transition-all duration-500 ${focused ? 'scale-[1.01]' : 'scale-100'}`}>
                        <div className={`relative flex flex-col p-2 md:p-3 rounded-[2rem] border backdrop-blur-3xl shadow-2xl transition-all duration-500 ${isLight
                            ? (focused ? 'bg-white border-blue-200 shadow-blue-500/10' : 'bg-white/70 border-slate-200')
                            : (focused ? 'bg-black/80 border-white/20' : 'bg-black/40 border-white/10')
                            }`}>
                            <div className="flex items-center gap-4 px-6 py-2">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                    placeholder="What do you want to do today?"
                                    className={`w-full bg-transparent border-none outline-none text-[clamp(1rem,1.05vw,1.25rem)] font-light placeholder-opacity-40 tracking-tight ${isLight ? 'text-slate-800 placeholder-slate-400' : 'text-slate-200 placeholder-white/20'
                                        }`}
                                />
                            </div>
                            <div className="flex items-center justify-between px-4 pb-2 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`px-2 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-[0.3em] flex items-center gap-1 ${isLight ? 'border-slate-200 text-slate-400' : 'border-white/10 text-white/30'
                                        }`}>
                                        <Command className="w-2.5 h-2.5" />
                                        <span>AVA v2.4</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`hidden md:block text-[11px] font-semibold uppercase tracking-[0.3em] ${isLight ? 'text-slate-400' : 'text-white/20'
                                        }`}>
                                        Neural Link Active
                                    </span>
                                    <button
                                        onClick={() => handleSearch(query)}
                                        className={`flex items-center justify-center p-2 rounded-xl transition-all border ${query.length > 0
                                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                            : (isLight ? 'bg-slate-100/50 text-slate-300 border-transparent' : 'bg-white/5 text-white/20 border-white/5')
                                            }`}>
                                        <CornerDownLeft className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 opacity-40 pb-2">
                        {jobs.map((job) => (
                            <button
                                key={job.label}
                                onClick={() => executeShortcut(job.label)}
                                className={`px-4 py-2 rounded-full border text-[10px] md:text-[clamp(10px,0.5vw,11px)] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-100 hover:scale-105 ${isLight ? 'border-slate-300 text-slate-600 bg-white' : 'border-white/10 text-white bg-white/5'
                                    }`}
                            >
                                {job.label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AskAva;
