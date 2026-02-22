"use client";
import React from "react";
import { Reveal } from "./LandingUtils";
import { HelpCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        question: "Can AVA calibrate surveys for specific cultural and regional contexts?",
        answer: "Yes. AVA utilizes Cross-Cultural Intelligence (CCI) nodes to audit surveys for linguistic nuances, regional taboos, and local terminology. Whether the research is aimed at the Mauritian market, FMCG sectors in Europe, or governmental studies in emerging markets, AVA secures the cultural validity of every question."
    },
    {
        question: "What is the primary difference between Genesis and The Lab?",
        answer: "Genesis is an AI-driven architectural protocol used for generative survey design and statistical calibration. The Lab is an adversarial testing environment used to audit existing research instruments against synthetic respondent populations to ensure they are boardroom-ready."
    },
    {
        question: "Who is AVA designed for?",
        answer: "AVA is engineered for institutional research units, governmental departments, FMGC insights teams, academic researchers, and intergovernmental organizations (UNDP, World Bank, AfDB) that require defensible, high-veracity data for large-scale decision-making."
    },
    {
        question: "Does AVA store my survey data?",
        answer: "No. AVA processes all survey data in real time and never stores it permanently. The Bureau operates on a Zero PII policy — only synthetic, census-weighted personas are used in simulation to guarantee absolute protocol confidentiality."
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

                <motion.div
                    initial={false}
                    animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                >
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed font-normal max-w-3xl pb-8 md:pb-10">
                        {item.answer}
                    </p>
                </motion.div>
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
