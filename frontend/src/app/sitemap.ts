import { MetadataRoute } from 'next';
import { glossaryData } from '@/constants/glossary';
import { agentData } from '@/constants/agents';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://thebureau.ai';

    // Static routes
    const staticRoutes = [
        '',
        '/landing',
        '/os',
        '/lab',
        '/glossary',
        '/agents',
        '/blog',
        '/early-adopters',
        '/investors',
        '/mission-control',
        '/genesis',
        '/field-interpreter',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Glossary dynamic routes
    const glossaryRoutes = glossaryData.map((entry) => ({
        url: `${baseUrl}/glossary/${entry.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Agent dynamic routes
    const agentRoutes = agentData.map((agent) => ({
        url: `${baseUrl}/agents/${agent.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...glossaryRoutes, ...agentRoutes];
}
