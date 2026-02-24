import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { client } from "@/sanity/lib/client";
import ArticleLayout from "@/components/blog/ArticleLayout";

// Allow dynamic rendering when slug is not in static params (e.g., preview of new drafts)
export const dynamicParams = true;

type Props = {
    params: Promise<{ slug: string }>;
};

async function getPost(slug: string, isPreview: boolean = false) {
    const token = process.env.SANITY_API_TOKEN;

    // Use the client with specific configuration for the preview
    // Note: 'previewDrafts' was renamed to 'drafts' in recent Sanity API
    const previewClient = isPreview && token
        ? client.withConfig({ token, perspective: 'drafts', useCdn: false })
        : client;

    try {
        const query = `*[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
            ...,
            author->,
            categories[]->
        }`;

        const post = await previewClient.fetch(query, { slug });

        if (isPreview && !post) {
            console.warn(`Preview Mode: No draft or published post found for slug "${slug}"`);
        }

        return post;
    } catch (e: any) {
        console.error(`fetchPost error (${slug}):`, e.message);
        return null;
    }
}

export async function generateMetadata({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const { preview } = await searchParams;
    const isPreview = preview === 'true';

    console.log(`[Metadata] Fetching post: ${slug}, isPreview: ${isPreview}`);
    const post = await getPost(slug, isPreview);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Bureau Insights`,
        description: post.seoDescription || post.aiManifestExcerpt || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.socialExcerpt || post.excerpt,
            type: 'article',
            authors: [post.author?.name || 'AVA'],
        },
        other: {
            'author': post.author?.name || 'AVA',
            'veracity-score': post.veracityScore || '99% Protocol Compliant',
            'ai-manifest-summary': post.aiManifestExcerpt || ''
        }
    };
}

export async function generateStaticParams() {
    try {
        const query = `*[_type == "post"] { "slug": slug.current }`;
        const posts = await client.fetch(query);
        return posts.map((post: { slug: string }) => ({
            slug: post.slug,
        }));
    } catch (e) {
        console.error("Static Params: Failed to fetch posts", e);
        return [];
    }
}

export default async function BlogPostPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ preview?: string }>
}) {
    const { slug } = await params;
    const { preview } = await searchParams;
    const isPreview = preview === 'true';

    let post;
    try {
        post = await getPost(slug, isPreview);
    } catch (e) {
        console.error("BlogPostPage fetch error:", e);
        return <div className="p-20 text-center">Diagnostic Engine Fault: Failed to retrieve data node.</div>;
    }

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title || "Untitled Intelligence Briefing",
        "description": post.seoDescription || post.aiManifestExcerpt || post.excerpt || "",
        "author": {
            "@type": "Organization",
            "name": post.author?.name || "AVA"
        },
        "datePublished": post.publishedAt || new Date().toISOString(),
        "publisher": {
            "@type": "Organization",
            "name": "The Survey Optimization Bureau",
            "logo": {
                "@type": "ImageObject",
                "url": "https://the-bureau-ava.vercel.app/images/AVA.webp"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ava.launchableai.online/blog/${post.slug?.current || slug}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleLayout post={post} />
        </>
    );
}
