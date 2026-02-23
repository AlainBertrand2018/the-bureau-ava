"use client";
import React from "react";
import { HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQSectionProps {
    onProtocolOpen?: () => void;
}

const FAQ_DATA = [
    {
        question: "How does AI stress-test a survey questionnaire?",
        answer: "AVA audits survey instruments prior to fieldwork by running them through an adversarial simulation loop. The system detects leading bias, double-barreled questions, and ambiguity by simulating how different personas interpret the language. This generates a prioritized fix-list that ensures maximum data quality and minimizes respondent drop-off."
    },
    {
        question: "How do synthetic populations work in market research?",
        answer: "Synthetic populations are AI-generated panels calibrated to replicate the exact demographic and psychographic profiles of a target audience. By utilizing census-weighted data and cultural LLM nodes, The Bureau simulates real-world interaction with a survey, allowing researchers to predict results and identify structural flaws without the cost or risk of early human fieldwork."
    },
    {
        question: "Can AVA calibrate surveys for regional contexts?",
        answer: "Yes. AVA utilizes Cross-Cultural Intelligence (CCI) nodes to audit surveys for linguistic nuances, regional taboos, and local terminology. Whether the research is aimed at the Mauritian market, FMCG sectors in Europe, or governmental studies in emerging markets, AVA secures the cultural validity of every question."
    },
    {
        question: "What is the difference between Genesis and The Lab?",
        answer: "Genesis is an AI-driven architectural protocol used for generative survey design and statistical calibration. The Lab is an adversarial testing environment used to audit existing research instruments against synthetic respondent populations to ensure they are boardroom-ready."
    },
    {
        question: "Who is AVA designed for?",
        answer: "AVA is engineered for institutional research units, governmental departments, FMCG insights teams, academic researchers, and intergovernmental organizations that require defensible, high-veracity data for large-scale decision-making."
    },
    {
        question: "Does AVA store my survey data?",
        answer: "No. AVA processes all survey data in real time and never stores it permanently. The Bureau operates on a Zero PII policy — only synthetic, census-weighted personas are used in simulation to guarantee absolute protocol confidentiality."
    }
];

const FAQItem = ({ item, index, activeIndex, setActiveIndex }: { item: typeof FAQ_DATA[0], index: number, activeIndex: number | null, setActiveIndex: (i: number | null) => void }) => {
    const isOpen = activeIndex === index;

    return (
        <div
            className={`group border-b border-white/10 transition-all duration-500 hover:bg-white/[0.03] px-6 md:px-10 ${isOpen ? 'bg-white/[0.03]' : ''}`}
        >
            <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full text-left py-8 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
            >
                <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-[10px] text-[#CC5833] font-black">0{index + 1}</span>
                        <h3 className={`text-xl md:text-2xl font-heading font-extrabold tracking-tighter transition-colors duration-400 ${isOpen ? 'text-white' : 'text-white/80'}`}>
                            {item.question}
                        </h3>
                    </div>
                    <div className={`shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-90 text-[#CC5833]' : 'text-white/20 group-hover:text-white'}`}>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-10 pl-[3.5rem] md:pl-[4.5rem] max-w-4xl">
                            <div className="p-6 bg-[#F2F0E9] border border-white/10 rounded-xl shadow-inner shadow-black/5">
                                <p className="font-mono text-xs md:text-sm text-[#2E4036] font-medium leading-relaxed whitespace-pre-wrap">
                                    {`// SYSTEM_EXPLANATION_NODE_${index + 1}\n\n${item.answer}`}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQSection({ onProtocolOpen }: FAQSectionProps) {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

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
        <section id="faq" className="section-full relative bg-[#1A1A1A]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="px-6 md:px-10 mb-20 text-center lg:text-left">
                    <div className="badge-minimal text-white/60 border-white/20 mb-6 inline-flex items-center gap-2">
                        <HelpCircle size={12} className="text-[#CC5833]" />
                        <span>System Documentation</span>
                    </div>
                    <h2 className="text-section-title text-white opacity-60 uppercase tracking-tighter">
                        Technical <span className="text-white opacity-100">Clarifications.</span>
                    </h2>
                </div>

                <div className="border-t border-white/10 mb-16">
                    {FAQ_DATA.map((item, i) => (
                        <FAQItem
                            key={i}
                            item={item}
                            index={i}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                        />
                    ))}
                </div>

                <div className="flex justify-center flex-col items-center gap-6">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em] font-bold">
                        // STILL_UNCERTAIN? // ACCESS_INSTITUTIONAL_SUPPORT
                    </p>
                    <button
                        onClick={onProtocolOpen}
                        className="btn-magnetic bg-white text-[#2E4036] px-12 py-5"
                    >
                        <span>Prompt AVA for Help</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}
