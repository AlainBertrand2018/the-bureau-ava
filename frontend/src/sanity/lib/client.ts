import { createClient } from 'next-sanity'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wtp3tkur'
const token = process.env.SANITY_API_TOKEN

export const client = createClient({
    projectId: projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    useCdn: true, // Use CDN for public client
})

// Helper to determine perspective
export const getPerspective = (isPreview?: boolean) => {
    return isPreview ? 'drafts' : 'published'
}
