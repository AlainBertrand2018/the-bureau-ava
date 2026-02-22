export interface KnowledgeNode {
    id: string;
    category: 'service' | 'pricing' | 'methodology' | 'about';
    keywords: string[];
    content: string;
    cta?: string; // Optional call-to-action link or job label
}

export const avaKnowledge: KnowledgeNode[] = [
    {
        id: 'synthetic-respondents',
        category: 'methodology',
        keywords: ['synthetic', 'ai respondents', 'bots', 'simulated', 'panel', 'populations'],
        content: "Synthetic populations are AI-generated panels calibrated to replicate the exact demographic and psychographic profiles of a target audience. By utilizing census-weighted data and cultural LLM nodes, The Bureau simulates real-world interaction with a survey to predict results and identify structural flaws.",
        cta: 'Market Recon'
    },
    {
        id: 'the-lab-detail',
        category: 'service',
        keywords: ['audit', 'neural', 'quality', 'clean', 'bias', 'check', 'the lab', 'stress test'],
        content: "The Lab (Behavioral Instrument Stress-Testing) provides rigorous neural auditing of existing survey instruments. Ingest and simulate respondent interaction against hyper-targeted synthetic populations to identify structural flaws, bias, and drop-off risks for €300.",
        cta: 'Stress Testing'
    },
    {
        id: 'pricing-general',
        category: 'pricing',
        keywords: ['cost', 'price', 'pricing', 'subscription', 'credits', 'free', 'membership', 'enterprise'],
        content: "The Bureau offers a specialized hierarchy of intelligence tools: Sentinel (Market Recon) is FREE. Genesis (AI-Driven Architecture) is €378. The Lab (Adversarial Testing) is €300. The Interpreter (Data Synthesis) is €240. Enterprise Membership provides a 60,000 credit allowance for €600/month.",
    },
    {
        id: 'genesis-detail',
        category: 'service',
        keywords: ['genesis', 'create', 'build', 'write', 'scratch'],
        content: "Genesis Protocol (AI-Driven Questionnaire Architecture) provides advanced survey generation and recursive self-stress testing. AVA generates statistically rigorous, 20-item research instruments from scratch for €378.",
        cta: 'Survey from Scratch'
    },
    {
        id: 'sentinel-detail',
        category: 'service',
        keywords: ['sentinel', 'market', 'recon', 'scout', 'intelligence'],
        content: "Sentinel (Market & Audience Reconnaissance) conducts open-source intelligence (OSINT) scanning to synthesize real-time profiles of target market landscapes. It is 100% FREE/Complimentary.",
        cta: 'Market Recon'
    },
    {
        id: 'the-bureau-mission',
        category: 'about',
        keywords: ['mission', 'who', 'bureau', 'story', 'goal', 'company', 'entity'],
        content: "The Survey Optimization Bureau is an AI intelligence platform for pre-fieldwork validation. Utilizing AVA, our AI orchestrator, we secure data integrity for Government, FMCG, and Academic research using synthetic populations.",
        cta: 'Information about The Bureau'
    }
];
