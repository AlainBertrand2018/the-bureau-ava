import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { client } from "@/sanity/lib/client";
import ArticleLayout from "@/components/blog/ArticleLayout";

type Props = {
    params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
    const query = `*[_type == "post" && slug.current == $slug][0] {
        ...,
        author->,
        categories[]->
    }`;
    return await client.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Bureau Insights`,
        description: post.aiSummary || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            authors: [post.author?.name || 'AVA'],
        },
        other: {
            'author': post.author?.name || 'AVA',
            'veracity-score': post.veracityScore || '99% Protocol Compliant'
        }
    };
}

export async function generateStaticParams() {
    const query = `*[_type == "post"] { "slug": slug.current }`;
    const posts = await client.fetch(query);
    return posts.map((post: { slug: string }) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.aiSummary || post.excerpt,
        "author": {
            "@type": "Organization",
            "name": post.author?.name || "AVA"
        },
        "datePublished": post.publishedAt,
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
            "@id": `https://ava.launchableai.online/blog/${post.slug.current}`
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
