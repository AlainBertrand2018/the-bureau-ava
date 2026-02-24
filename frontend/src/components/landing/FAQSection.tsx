"use client";
import React from "react";
import { HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQSectionProps {
    items?: FAQItemData[];
    isFullPage?: boolean;
    onProtocolOpen?: () => void;
}

interface FAQItemData {
    question: string;
    answer: string;
}

const FOUNDATIONAL_FAQ: FAQItemData[] = [
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

const TECHNICAL_FAQ: FAQItemData[] = [
    {
        question: "What happens if AVA flags a structural flaw in my instrument?",
        answer: "AVA doesn't just identify the problem — she rewrites it. Every flagged question receives a corrected version with a diagnostic explanation of why the original would have failed in the field. You receive a deployment-ready instrument, not just a list of issues."
    },
    {
        question: "How is AVA different from having a human expert review my survey?",
        answer: "A human expert reviews your instrument once, sequentially, through a single cultural and methodological lens. AVA deploys four specialized agents simultaneously — running thousands of simulated respondent interactions across demographic, cognitive, linguistic, and cultural dimensions in under five minutes. Speed and depth are not a trade-off with AVA. They are the same operation."
    },
    {
        question: "Can AVA handle surveys in multiple languages?",
        answer: "Yes. AVA's Linguistic Calibration engine validates instruments across languages, accounting for register differences, culturally loaded phrasing, and concepts that don't translate directly without distorting respondent intent. If a question reads differently in French than it does in English to your target demographic, AVA flags it before your respondents feel it."
    },
    {
        question: "What research methodologies does AVA's auditing framework draw from?",
        answer: "AVA was engineered at the intersection of Dillman's Tailored Design Method, Tourangeau's Cognitive Model of survey response, Krosnick's Satisficing Theory, Hofstede's Cultural Dimensions, and Schwartz's Value Theory. These are not references AVA cites — they are the architecture she was built on."
    },
    {
        question: "Is AVA suitable for sensitive research topics — health, politics, religion?",
        answer: "These are precisely the contexts where AVA's cross-cultural calibration is most critical. Sensitive topics require AVA to map not just what respondents are being asked, but what they will feel when they read it. Profiler identifies cultural taboos, linguistic fault lines, and emotionally loaded framings before a single real respondent encounters them."
    },
    {
        question: "How does AVA handle cross-cultural research spanning multiple markets?",
        answer: "Each target market receives its own synthetic population, calibrated to that market's cultural, socioeconomic, and demographic profile. A single instrument can be stress-tested against markets in East Africa, the Gulf, and Southeast Asia simultaneously — with market-specific diagnostic reports identifying where the same question performs differently across contexts."
    },
    {
        question: "What does the audit output actually look like?",
        answer: "A structured diagnostic report identifying every flagged question, the nature of each flaw — bias type, ambiguity source, drop-off risk, cognitive load level — a corrected version of each question, and an overall instrument integrity score. The output is designed to be shared directly with research directors and institutional stakeholders, not decoded by a methodologist."
    },
    {
        question: "Can I use AVA for tracking studies or longitudinal research instruments?",
        answer: "Yes — and for longitudinal research, instrument integrity becomes even more critical. A structural flaw in a tracking study compounds across every wave. AVA can validate the baseline instrument and audit each subsequent wave for drift, ensuring your trend data remains methodologically sound from the first field to the last."
    },
    {
        question: "What is The Bureau's data policy?",
        answer: "Zero PII. Your survey instrument is processed in real time and never stored permanently. AVA's synthetic populations are generated from calibrated demographic models — no real respondent data is used at any stage of the audit. All engagements are fully confidential. The Bureau does not retain, share, or reference client instruments beyond the active audit session."
    },
    {
        question: "How do I know if my research project needs AVA?",
        answer: "If your instrument will be used to inform a decision that costs more than the audit itself — a budget allocation, a policy recommendation, a product launch, a grant proposal — you need AVA. The question is never whether the audit fee is justified. It is whether the cost of a flawed instrument in the field is acceptable. For institutional research, it never is."
    }
];

const FAQItem = ({ item, index, activeIndex, setActiveIndex }: { item: FAQItemData, index: number, activeIndex: number | null, setActiveIndex: (i: number | null) => void }) => {
    const isOpen = activeIndex === index;

    return (
        <div
            className={`group border-b border-white/10 transition-all duration-500 hover:bg-white/[0.03] px-6 md:px-10 ${isOpen ? 'bg-white/[0.03]' : ''}`}
            itemScope
            itemType="https://schema.org/Question"
        >
            <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full text-left py-8 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
            >
                <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-[10px] text-[#CC5833] font-black">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                        <h3
                            itemProp="name"
                            className={`text-xl md:text-2xl font-heading font-extrabold tracking-tighter transition-colors duration-400 ${isOpen ? 'text-[#F2F0E9]' : 'text-[#F2F0E9]/80'}`}
                        >
                            {item.question}
                        </h3>
                    </div>
                    <div className={`shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-90 text-[#CC5833]' : 'text-[#F2F0E9]/20 group-hover:text-[#F2F0E9]'}`}>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </button>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="overflow-hidden"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
            >
                <div className="pb-10 pl-[3.5rem] md:pl-[4.5rem] max-w-4xl">
                    <div className="p-6 bg-[#F2F0E9] border border-white/10 rounded-xl shadow-inner shadow-black/5">
                        <p
                            itemProp="text"
                            className="font-mono text-xs md:text-sm text-[#2E4036] font-medium leading-relaxed whitespace-pre-wrap"
                        >
                            {`// SYSTEM_EXPLANATION_NODE_${index + 1}\n\n${item.answer}`}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

import { useChat } from "@/context/ChatContext";

export default function FAQSection({ items, isFullPage = false, onProtocolOpen }: FAQSectionProps) {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const { openChat } = useChat();

    const displayItems: FAQItemData[] = items || (isFullPage ? [...FOUNDATIONAL_FAQ, ...TECHNICAL_FAQ] : FOUNDATIONAL_FAQ);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": displayItems.map((item: FAQItemData) => ({
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
                    <div className="badge-minimal !text-[#F2F0E9]/60 border-[#F2F0E9]/20 mb-6 inline-flex items-center gap-2">
                        <HelpCircle size={12} className="text-[#CC5833]" />
                        <span>System Documentation</span>
                    </div>
                    <h2 className="text-section-title text-[#F2F0E9] opacity-60 uppercase tracking-tighter">
                        Frequently Asked <span className="text-[#F2F0E9] opacity-100">Questions</span>
                    </h2>
                </div>

                <div className="border-t border-white/10 mb-16">
                    {displayItems.map((item, i) => (
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
                    <p className="font-mono text-[9px] text-[#F2F0E9]/30 uppercase tracking-[0.4em] font-bold">
                        {isFullPage ? "// STILL_UNCERTAIN? // ACCESS_INSTITUTIONAL_SUPPORT" : "// NEED_TECHNICAL_DEPTH? // ACCESS_FULL_MANIFEST"}
                    </p>
                    {isFullPage ? (
                        <button
                            onClick={openChat}
                            className="btn-magnetic bg-[#F2F0E9] text-[#2E4036] px-12 py-5"
                        >
                            <span>Prompt AVA for Help</span>
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                    ) : (
                        <a
                            href="/faq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-magnetic bg-[#F2F0E9] text-[#2E4036] px-12 py-5 no-underline"
                        >
                            <span>More Questions</span>
                            <ArrowRight size={18} className="ml-2" />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
