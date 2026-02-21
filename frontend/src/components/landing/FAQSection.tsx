"use client";
import React from "react";
import { Reveal } from "./LandingUtils";
import { HelpCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_DATA = [
    {
        question: "What is survey stress-testing?",
        answer: "Survey stress-testing is the process of simulating real respondent behaviour on a Market Research questionnaire before fieldwork begins, using synthetic personas calibrated to the target demographic to detect bias, ambiguity, and structural flaws that compromise Data Integrity."
    },
    {
        question: "What does AVA actually do?",
        answer: "AVA is an Agentic AI platform by The Bureau that audits survey questionnaires before they go to field. Her agents detect leading questions, double-barreled items, cultural blind spots, drop-off risks, and ambiguity — then generate a prioritized fix list with rewritten question suggestions."
    },
    {
        question: "How long does an AVA audit take?",
        answer: "A full AVA diagnostic audit takes under 5 minutes — faster than scheduling a pilot focus group. Results include a complete bias flag report, ambiguity alerts, and AI rewrite suggestions ready to implement immediately."
    },
    {
        question: "Who is AVA designed for?",
        answer: "AVA is purpose-built for Market Research agencies, government survey teams, academic researchers, consultants, international development organizations (UNDP, World Bank, AfDB), and brand and marketing professionals who need defensible, high-quality survey data."
    },
    {
        question: "What is the cost of a bad survey?",
        answer: "A structurally flawed questionnaire exposes research projects to a total risk of €4,000–€16,000 per study — covering design fees, fieldwork and sample costs, data collection, and post-analysis. 94% of failed surveys had no stress-testing at the design stage."
    },
    {
        question: "Does AVA store my survey data?",
        answer: "No. AVA processes all survey data in real time and never stores it permanently. All audits are fully confidential. The Bureau operates on a Zero PII policy — only synthetic, census-weighted personas are used in simulation."
    },
    {
        question: "What is a synthetic respondent?",
        answer: "A synthetic respondent is an AI-generated persona calibrated to match the demographic, cultural, socioeconomic, and psychographic profile of your target audience. AVA uses synthetic respondents instead of real humans to safely stress-test questionnaires without risking data exposure or pilot bias."
    }
];

const FAQItem = ({ item, index, activeIndex, setActiveIndex }: { item: typeof FAQ_DATA[0], index: number, activeIndex: number | null, setActiveIndex: (i: number | null) => void }) => {
    const isOpen = activeIndex === index;

    return (
        <Reveal delay={index * 0.1}>
            <div className={`group border-l-2 transition-all duration-500 pl-8 ${isOpen ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-blue-500'}`}>
                <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full text-left py-6 md:py-8 focus:outline-none cursor-pointer"
                >
                    <div className="flex items-start justify-between gap-4">
                        <h3 className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-400 ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                            {item.question}
                        </h3>
                        <div className={`mt-2 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                            <ChevronRight size={24} />
                        </div>
                    </div>
                </button>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-normal max-w-3xl pb-8 md:pb-10">
                                {item.answer}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Reveal>
    );
};

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_DATA.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section id="faq" className="section-full relative overflow-hidden bg-slate-50 py-24 md:py-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="badge-blue inline-flex items-center gap-2 mb-8">
                        <HelpCircle size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            F.A.Q Intelligence
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-16">
                        System <span className="text-blue-600">Clarifications.</span>
                    </h2>
                </Reveal>

                <div className="space-y-4 md:space-y-6">
                    {FAQ_DATA.map((item, i) => (
                        <FAQItem
                            key={i}
                            item={item}
                            index={i}
                            activeIndex={mounted ? activeIndex : null}
                            setActiveIndex={setActiveIndex}
                        />
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
        </section>
    );
}
