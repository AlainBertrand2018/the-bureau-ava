import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'Claude-SearchBot',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
                disallow: ['/studio', '/admin', '/api'],
            }
        ],
        sitemap: 'https://ava.launchableai.online/sitemap.xml',
    };
}
