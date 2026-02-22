import { MetadataRoute } from 'next';
import { glossaryData } from '@/constants/glossary';
import { agentData } from '@/constants/agents';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ava.launchableai.online';

    // Static routes in the guided journey order
    const staticRoutes = [
        { route: '', priority: 1.0 },              // Gateway
        { route: '/about', priority: 0.97 },       // Atomic Legibility Unit
        { route: '/landing', priority: 0.95 },     // Main Landing
        { route: '/agents', priority: 0.9 },       // Logic: Agents
        { route: '/glossary', priority: 0.85 },    // Foundation: Glossary
        { route: '/os', priority: 0.8 },           // Environment: OS
        { route: '/lab', priority: 0.75 },         // Tool: Lab
        { route: '/mission-control', priority: 0.75 }, // Tool: MC
        { route: '/genesis', priority: 0.75 },     // Tool: Genesis
        { route: '/field-interpreter', priority: 0.75 }, // Tool: FI
        { route: '/blog', priority: 0.6 },
        { route: '/early-adopters', priority: 0.5 },
        { route: '/investors', priority: 0.5 },
    ].map(({ route, priority }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '' || route === '/landing') ? 'daily' as const : 'weekly' as const,
        priority: priority,
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

    // Blog dynamic routes
    const blogRoutes = [
        { slug: "why-94-percent-of-surveys-fail" },
        { slug: "rise-of-synthetic-panels" }
    ].map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...glossaryRoutes, ...agentRoutes, ...blogRoutes];
}
