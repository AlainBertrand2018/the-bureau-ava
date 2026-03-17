import { MetadataRoute } from 'next';
import { glossaryData } from '@/constants/glossary';
import { agentData } from '@/constants/agents';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ava.launchableai.online';

    // Static routes in the guided journey order
    const staticRoutes = [
        { route: '', priority: 1.0 },              // Main Entry
        { route: '/about', priority: 0.97 },       // Atomic Legibility Unit
        { route: '/agents', priority: 0.9 },       // Logic: Agents
        { route: '/glossary', priority: 0.85 },    // Foundation: Glossary
        { route: '/faq', priority: 0.85 },         // Technical Manifest
        { route: '/os', priority: 0.8 },           // Environment: OS
        { route: '/lab', priority: 0.75 },         // Tool: Lab
        { route: '/mission-control', priority: 0.75 }, // Tool: MC
        { route: '/genesis', priority: 0.75 },     // Tool: Genesis
        { route: '/field-interpreter', priority: 0.75 }, // Tool: FI
        { route: '/ava', priority: 0.98 },         // AVA Master Identity
        { route: '/ava/references', priority: 0.8 }, // AVA Corroboration Node
        { route: '/blog', priority: 0.6 },
        { route: '/early-adopters', priority: 0.5 },
        { route: '/investors', priority: 0.5 },
        { route: '/admin', priority: 0.1 },
        { route: '/admin/commercial', priority: 0.1 },
        { route: '/admin/stats', priority: 0.1 },
        { route: '/admin/tokens', priority: 0.1 },
        { route: '/feed/ai', priority: 0.1 },
    ].map(({ route, priority }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '') ? 'daily' as const : 'weekly' as const,
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

    // Blog dynamic routes from Sanity
    let blogRoutes: any[] = [];
    try {
        const blogQuery = `*[_type == "post"] { "slug": slug.current, _updatedAt }`;
        const sanePosts = await client.fetch(blogQuery);

        blogRoutes = sanePosts.map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post._updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }));
    } catch (error) {
        console.error("Sitemap: Failed to fetch blog posts from Sanity", error);
        // Fallback to empty blog routes to allow build to continue
    }

    return [...staticRoutes, ...glossaryRoutes, ...agentRoutes, ...blogRoutes];
}
