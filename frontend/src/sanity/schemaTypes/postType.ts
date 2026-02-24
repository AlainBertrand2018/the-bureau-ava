import { defineField, defineType } from 'sanity'

export const postType = defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'author',
            type: 'reference',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'language',
            type: 'string',
            title: 'Language',
            options: {
                list: [
                    { title: 'English', value: 'en' },
                ],
            },
            initialValue: 'en',
        }),
        defineField({
            name: 'excerpt',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'aiSummary',
            title: 'AI Summary (AEO/GEO Signal)',
            type: 'text',
            rows: 2,
            description: 'High-density summary specifically for LLM ingestion (Perplexity/GPT). Keep under 200 characters.',
        }),
        defineField({
            name: 'veracityScore',
            title: 'Veracity Score',
            type: 'string',
            description: 'e.g. "99% Protocol Compliant" or "Audit Grade: AAA"',
            initialValue: '99% Protocol Compliant',
        }),
        defineField({
            name: 'readingTime',
            title: 'Reading Time (Minutes)',
            type: 'number',
            initialValue: 5,
        }),
        defineField({
            name: 'isPremium',
            title: 'Premium Content',
            type: 'boolean',
            description: 'Enables the private review box for logged-in researchers.',
            initialValue: false,
        }),
        defineField({
            name: 'socialHashtags',
            title: 'Social Hashtags',
            type: 'string',
            description: 'Used for automated sharing (e.g. "#AdversarialAudit #MarketResearch")',
            initialValue: '#AdversarialAudit #TheBureau #AVA',
        }),
        defineField({
            name: 'mentionHandle',
            title: 'Social Mention Handle',
            type: 'string',
            description: 'Handle to tag in the share-to-comment logic.',
            initialValue: '@TheBureauAI',
        }),
        defineField({
            name: 'body',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image' }],
        }),
        defineField({
            name: 'customFAQ',
            title: 'Article-Specific FAQ (Overrides Default)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string' },
                        { name: 'answer', type: 'text' }
                    ]
                }
            ],
            description: 'If left empty, the standard foundatonal FAQ will be used.',
        }),
    ],
})
