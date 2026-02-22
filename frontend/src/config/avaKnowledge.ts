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
        keywords: ['synthetic', 'ai respondents', 'bots', 'simulated', 'panel'],
        content: "We utilize proprietary Synthetic Respondents—AI-driven personas modeled on real-world demographic data. This eliminates human fatigue and bias, providing results in minutes instead of weeks.",
        cta: 'Market Recon'
    },
    {
        id: 'neural-audit',
        category: 'methodology',
        keywords: ['audit', 'neural', 'quality', 'clean', 'bias', 'check'],
        content: "Our Neural Audit engine scans survey instruments for cognitive load, leading questions, and framing bias. It ensures your data collection is scientifically sound before you hit the field.",
        cta: 'Stress Testing'
    },
    {
        id: 'pricing-general',
        category: 'pricing',
        keywords: ['cost', 'price', 'pricing', 'subscription', 'credits', 'free', 'membership', 'enterprise'],
        content: "The Bureau offers strategic tactical tools. Sentinel (Market Recon) is FREE. Genesis is €378, The Lab is €300, and our Result Interpreter is €240 per run. Our Enterprise membership provides a 60,000 credit monthly allowance for €600, with overage options available.",
    },
    {
        id: 'genesis-detail',
        category: 'service',
        keywords: ['genesis', 'create', 'build', 'write', 'scratch'],
        content: "Genesis is our primary architectural tool for building survey instruments. A full Genesis run includes questionnaire generation and an integrated self-stress test for €378.",
        cta: 'Survey from Scratch'
    },
    {
        id: 'sentinel-detail',
        category: 'service',
        keywords: ['sentinel', 'market', 'recon', 'scout', 'intelligence'],
        content: "Sentinel is our tactical reconnaissance platform. It is currently available as a complimentary service to allow users to experience Bureau-grade market intelligence. It is 100% FREE.",
        cta: 'Market Recon'
    },
    {
        id: 'the-bureau-mission',
        category: 'about',
        keywords: ['mission', 'who', 'bureau', 'story', 'goal', 'company'],
        content: "The Survey Optimization Bureau (SOB) was founded to move market research beyond human error. We treat survey data as critical infrastructure, applying AI precision to the science of inquiry.",
        cta: 'Information about The Bureau'
    }
];
