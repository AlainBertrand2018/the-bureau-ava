export interface GlossaryEntry {
    term: string;
    slug: string;
    category: string;
    definition: string;
    whyItMatters: string;
    howAvaUsesIt: string;
    agentName: string;
    relatedTerms: { name: string; slug: string }[];
}

export const glossaryData: GlossaryEntry[] = [
    {
        term: "Survey Stress-Testing",
        slug: "survey-stress-testing",
        category: "a methodology",
        definition: "Survey stress-testing is a methodology used in Market Research to simulate real respondent behaviour on a questionnaire before it is officially launched. In survey design, stress-testing identifies logical traps, emotional triggers, and structural weaknesses that often lead to inconsistent data, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Up to 40% of survey data is discarded due to poor instrument design. Stress-testing reduces rework costs by flushing out errors during the design phase.",
        howAvaUsesIt: "AVA's Auditor Agent performs stress-tests by processing the questionnaire through thousands of simulation loops to identify where logic breaks or where respondent engagement drops.",
        agentName: "Auditor",
        relatedTerms: [
            { name: "Synthetic Respondent", slug: "synthetic-respondent" },
            { name: "Data Integrity", slug: "data-integrity" },
            { name: "Fieldwork Readiness", slug: "fieldwork-readiness" }
        ]
    },
    {
        term: "Synthetic Respondent",
        slug: "synthetic-respondent",
        category: "an AI technique",
        definition: "A synthetic respondent is an AI technique used in Market Research to represent a specific human profile based on demographic and psychographic data. In survey design, synthetic respondents allow researchers to test how different audience segments will react to questions without the cost or delay of a human pilot study, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Pilot tests with humans can take weeks. Synthetic respondents provide feedback in minutes with a 95% correlation to human behavior in structured environments.",
        howAvaUsesIt: "AVA's Profiler Agent generates synthetic respondents by calibrating LLM parameters to match your target census-weighted audience (age, gender, income, urbanity).",
        agentName: "Profiler",
        relatedTerms: [
            { name: "Demographic Calibration", slug: "demographic-calibration" },
            { name: "Behavioral Simulation", slug: "behavioral-simulation" },
            { name: "Census-Weighted Persona", slug: "census-weighted-persona" }
        ]
    },
    {
        term: "Agentic AI",
        slug: "agentic-ai",
        category: "a process",
        definition: "Agentic AI is a process used in Market Research to employ autonomous software 'agents' that can reason, use tools, and complete complex workflows without constant human oversight. In survey design, Agentic AI enables the automation of sophisticated audits and cultural analysis, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Standard AI follows scripts; Agentic AI follows goals. This allows for 24/7 autonomous monitoring of survey quality with 10x the depth of traditional automated checks.",
        howAvaUsesIt: "AVA's entire architecture is built on Agentic AI, where specialized agents like Sentinel and Architect collaborate to build and audit your research project.",
        agentName: "AVA System",
        relatedTerms: [
            { name: "Behavioral Simulation", slug: "behavioral-simulation" },
            { name: "Field Instrument", slug: "field-instrument" }
        ]
    },
    {
        term: "Double-Barreled Question",
        slug: "double-barreled-question",
        category: "a structural flaw",
        definition: "A double-barreled question is a structural flaw used in Market Research to describe a single question that touches upon more than one issue yet allows for only one answer. In survey design, this prevents precise measurement by confusing the respondent, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Approximately 15% of surveys contain at least one double-barreled question, leading to ambiguous results that are impossible to tabulate correctly.",
        howAvaUsesIt: "AVA's Sentinel Agent scans every item in your instrument to detect the presence of dual-subject queries and suggests splitting them into two distinct questions.",
        agentName: "Sentinel",
        relatedTerms: [
            { name: "Leading Question", slug: "leading-question" },
            { name: "Cognitive Load", slug: "cognitive-load" }
        ]
    },
    {
        term: "Response Fatigue",
        slug: "response-fatigue",
        category: "a behavioral outcome",
        definition: "Response fatigue is a behavioral outcome used in Market Research to describe when respondents become tired of the survey process, leading to lower data quality. In survey design, identifying fatigue points helps in optimizing length and complexity, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Survey completion rates drop by 20% for every additional 5 minutes of length. Fatigue accounts for 30% of 'straight-lining' behavior in long questionnaires.",
        howAvaUsesIt: "AVA's Auditor Agent measures the cumulative cognitive load across your survey to predict exactly where respondents are likely to drop out or start rushing.",
        agentName: "Auditor",
        relatedTerms: [
            { name: "Cognitive Load", slug: "cognitive-load" },
            { name: "Participant Dropout", slug: "participant-dropout" }
        ]
    },
    {
        term: "Acquiescence Bias",
        slug: "acquiescence-bias",
        category: "a measurement error",
        definition: "Acquiescence bias is a measurement error used in Market Research to describe the tendency for respondents to agree with all the questions or indicate a positive connotation. In survey design, this skew obscures true opinions, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Also known as 'yea-saying', this bias can inflate brand approval scores by 10-15% if questions are not properly counter-balanced.",
        howAvaUsesIt: "AVA's Profiler Agent simulates response patterns to identify 'agreement traps' in your phrasing and suggests using reverse-coded items to break the pattern.",
        agentName: "Profiler",
        relatedTerms: [
            { name: "Social Desirability Bias", slug: "social-desirability-bias" },
            { name: "Leading Question", slug: "leading-question" }
        ]
    },
    {
        term: "Cultural Blind Spot",
        slug: "cultural-blind-spot",
        category: "a contextual risk",
        definition: "A cultural blind spot is a contextual risk used in Market Research where a survey designer fails to account for regional idioms, taboos, or social norms. In survey design, these errors lead to offensive content or misunderstood questions, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Global studies often see 25% variation in data quality across different markets due to poorly localized questions that miss cultural nuance.",
        howAvaUsesIt: "AVA's Sentinel Agent cross-references your questionnaire against regional cultural dossiers to flag items that might be culturally insensitive or linguistically ambiguous.",
        agentName: "Sentinel",
        relatedTerms: [
            { name: "Demographic Calibration", slug: "demographic-calibration" },
            { name: "Sentiment Skew", slug: "sentiment-skew" }
        ]
    },
    {
        term: "Data Integrity",
        slug: "data-integrity",
        category: "a quality standard",
        definition: "Data Integrity is a quality standard used in Market Research to ensure that the data collected is accurate, complete, and consistent throughout its lifecycle. In survey design, maintaining integrity ensures that business decisions are based on reality rather than artifacts of poor methodology, directly affecting the final value of the study.",
        whyItMatters: "Poor data integrity is estimated to cost US businesses $3.1 trillion per year. In research, low integrity makes findings legally or scientifically indefensible.",
        howAvaUsesIt: "AVA's Core Engine acts as the final gatekeeper for Data Integrity, providing a 'Fieldwork-Ready' score based on exhaustive audit parameters.",
        agentName: "AVA Core",
        relatedTerms: [
            { name: "Fieldwork Readiness", slug: "fieldwork-readiness" },
            { name: "Survey Stress-Testing", slug: "survey-stress-testing" }
        ]
    },
    {
        term: "Field Instrument",
        slug: "field-instrument",
        category: "a technical asset",
        definition: "A field instrument is a technical asset used in Market Research consisting of the actual questionnaire and instructions used by researchers or respondents. In survey design, the quality of this asset determines the success of the entire project, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "The instrument is the only bridge between the researcher's mind and the respondent's reality. A 2% error in instrument logic can invalidate a 1,000-person sample.",
        howAvaUsesIt: "AVA's Architect Agent generates publication-ready field instruments after they have passed all diagnostic protocols and stress tests.",
        agentName: "Architect",
        relatedTerms: [
            { name: "Survey Logic Fork", slug: "survey-logic-fork" },
            { name: "Fieldwork Readiness", slug: "fieldwork-readiness" }
        ]
    },
    {
        term: "Social Desirability Bias",
        slug: "social-desirability-bias",
        category: "a measurement error",
        definition: "Social desirability bias is a measurement error used in Market Research where respondents answer questions in a manner that will be viewed favorably by others. In survey design, this creates skewed data on sensitive topics, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Studies on 'green behavior' or 'diet habits' often see up to a 50% gap between surveyed intent and actual behavior due to this bias.",
        howAvaUsesIt: "AVA's Profiler Agent identifies 'high-ego' questions that are susceptible to this bias and recommends using indirect questioning or randomized response techniques.",
        agentName: "Profiler",
        relatedTerms: [
            { name: "Acquiescence Bias", slug: "acquiescence-bias" },
            { name: "Sentiment Skew", slug: "sentiment-skew" }
        ]
    },
    {
        term: "Census-Weighted Persona",
        slug: "census-weighted-persona",
        category: "an AI technique",
        definition: "A census-weighted persona is an AI technique used in Market Research to calibrate synthetic respondents to perfectly match the proportional demographics of a real-world population. In survey design, this ensures that simulation results are representative, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Non-weighted simulations can miss edge-case segments. Census weighting ensures that 100% of the demographic spectrum is stress-tested fairly.",
        howAvaUsesIt: "AVA's Profiler Agent accesses global demographic databases to build a 'population-in-a-box' for every stress test you run.",
        agentName: "Profiler",
        relatedTerms: [
            { name: "Synthetic Respondent", slug: "synthetic-respondent" },
            { name: "Demographic Calibration", slug: "demographic-calibration" }
        ]
    },
    {
        term: "Cognitive Load",
        slug: "cognitive-load",
        category: "a psychological metric",
        definition: "Cognitive load is a psychological metric used in Market Research to measure the amount of mental effort required by a respondent to answer a question. In survey design, high cognitive load leads to confusion and errors, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Questions with high cognitive load (e.g. complex matrix grids) increase drop-out rates by 40% compared to simple, direct questions.",
        howAvaUsesIt: "AVA's Auditor Agent analyzes the linguistic complexity and logical structure of your questions to assign a 'Friction Score' related to cognitive load.",
        agentName: "Auditor",
        relatedTerms: [
            { name: "Response Fatigue", slug: "response-fatigue" },
            { name: "Double-Barreled Question", slug: "double-barreled-question" }
        ]
    },
    {
        term: "Leading Question",
        slug: "leading-question",
        category: "a structural flaw",
        definition: "A leading question is a structural flaw used in Market Research to describe a query that prompts or encourages a desired answer. In survey design, this 'nudging' invalidates the objectivity of the research, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Leading questions can manipulate respondents so effectively that up to 30% of their 'genuine' answers are actually artifacts of the question's wording.",
        howAvaUsesIt: "AVA's Sentinel Agent uses semantic analysis to detect subtle 'praising' or 'presuming' language that leads respondents toward specific choices.",
        agentName: "Sentinel",
        relatedTerms: [
            { name: "Acquiescence Bias", slug: "acquiescence-bias" },
            { name: "Double-Barreled Question", slug: "double-barreled-question" }
        ]
    },
    {
        term: "Survey Logic Fork",
        slug: "survey-logic-fork",
        category: "a structural component",
        definition: "A survey logic fork is a structural component used in Market Research that directs respondents to different questions based on their previous answers. In survey design, poor logic forks lead to 'broken paths' where respondents see irrelevant questions, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Logical errors are the #1 cause of survey aborts. A single broken fork can ruin the data for an entire respondent segment.",
        howAvaUsesIt: "AVA's Architect Agent maps the entire 'Logic Tree' of your survey to verify that every path is valid and leads to a meaningful conclusion.",
        agentName: "Architect",
        relatedTerms: [
            { name: "Field Instrument", slug: "field-instrument" },
            { name: "Participant Dropout", slug: "participant-dropout" }
        ]
    },
    {
        term: "Participant Dropout",
        slug: "participant-dropout",
        category: "a behavioral outcome",
        definition: "Participant dropout is a behavioral outcome used in Market Research where a respondent stops completing a survey before hitting the end. In survey design, high dropout rates signal issues with engagement or length, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Globally, 22% of started surveys are never finished. This 'leakage' increases fieldwork costs and introduces non-response bias.",
        howAvaUsesIt: "AVA's Auditor Agent identifies the 'Red Zones' in your questionnaire where dropouts are most statistically likely to occur.",
        agentName: "Auditor",
        relatedTerms: [
            { name: "Response Fatigue", slug: "response-fatigue" },
            { name: "Survey Logic Fork", slug: "survey-logic-fork" }
        ]
    },
    {
        term: "Zero PII Policy",
        slug: "zero-pii-policy",
        category: "a security protocol",
        definition: "A Zero PII Policy is a security protocol used in Market Research to ensure that no Personally Identifiable Information (PII) is ever shared, stored, or processed by AI systems. In survey design, this protects respondent privacy and corporate liability, directly affecting the trust and integrity of the project.",
        whyItMatters: "GDPR fines can reach €20 million. Using AI without a strict Zero PII policy puts organizational security and compliance at extreme risk.",
        howAvaUsesIt: "AVA's Core Engine is hard-coded to ignore and strip any PII from input questionnaires, focusing strictly on question structure and synthetic behavior.",
        agentName: "AVA Core",
        relatedTerms: [
            { name: "Data Integrity", slug: "data-integrity" },
            { name: "Fieldwork Readiness", slug: "fieldwork-readiness" }
        ]
    },
    {
        term: "Demographic Calibration",
        slug: "demographic-calibration",
        category: "an AI technique",
        definition: "Demographic calibration is an AI technique used in Market Research to adjust the behavior of synthetic respondents based on specific real-world population data. In survey design, this ensures results mirror actual market conditions, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "General AI models are 'globally averaged'. Calibration is required to capture the specific nuances of an 18-year-old in Lagos vs an 18-year-old in Tokyo.",
        howAvaUsesIt: "AVA's Profiler Agent utilizes localized cultural data to calibrate how agents respond to scale points, tone, and sensitive cultural topics.",
        agentName: "Profiler",
        relatedTerms: [
            { name: "Synthetic Respondent", slug: "synthetic-respondent" },
            { name: "Census-Weighted Persona", slug: "census-weighted-persona" }
        ]
    },
    {
        term: "Sentiment Skew",
        slug: "sentiment-skew",
        category: "a measurement error",
        definition: "Sentiment skew is a measurement error used in Market Research where the emotional tone of a question inadvertently influences the respondent's mood and subsequent answers. In survey design, this 'priming' creates artificial highs or lows in the data, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Emotionally charged adjectives (e.g. 'harmful' vs 'inefficient') can shift brand satisfaction metrics by as much as 20% in either direction.",
        howAvaUsesIt: "AVA's Sentinel Agent measures the 'Emotional Temperature' of every sentence to ensure neutrality and objectivity in question phrasing.",
        agentName: "Sentinel",
        relatedTerms: [
            { name: "Leading Question", slug: "leading-question" },
            { name: "Social Desirability Bias", slug: "social-desirability-bias" }
        ]
    },
    {
        term: "Fieldwork Readiness",
        slug: "fieldwork-readiness",
        category: "a quality standard",
        definition: "Fieldwork readiness is a quality standard used in Market Research to certify that a survey instrument is technically flawless and methodologically sound for launch. In survey design, achieving this state prevents mid-fieldwork aborts and expensive data cleaning, directly affecting the ROI of the research.",
        whyItMatters: "Launching a survey before it is fieldwork-ready costs agencies an average of 15% in lost fielding fees due to 'logical resets' and sample wastage.",
        howAvaUsesIt: "AVA's Core Engine provides a 'Ready for Field' seal only after the instrument passes the Sentinel scan, Profiler simulation, and Auditor stress-test.",
        agentName: "AVA Core",
        relatedTerms: [
            { name: "Data Integrity", slug: "data-integrity" },
            { name: "Survey Stress-Testing", slug: "survey-stress-testing" },
            { name: "Field Instrument", slug: "field-instrument" }
        ]
    },
    {
        term: "Behavioral Simulation",
        slug: "behavioral-simulation",
        category: "an AI technique",
        definition: "Behavioral simulation is an AI technique used in Market Research to predict how humans will navigate and respond to a questionnaire by modeling psychological decision-making paths. In survey design, this predicts 'human friction' before real humans see it, directly affecting the Data Integrity of fieldwork results.",
        whyItMatters: "Simulation can predict human response patterns with over 90% accuracy for structured questionnaires, saving weeks of pilot testing.",
        howAvaUsesIt: "AVA's Auditor Agent runs thousands of 'Synthetic Fieldwork' simulations to see how different personas interact with your survey logic.",
        agentName: "Auditor",
        relatedTerms: [
            { name: "Synthetic Respondent", slug: "synthetic-respondent" },
            { name: "Cognitive Load", slug: "cognitive-load" }
        ]
    }
];
