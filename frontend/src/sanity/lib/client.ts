import { createClient } from 'next-sanity'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing'
const token = process.env.SANITY_API_TOKEN

export const client = createClient({
    projectId: projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    useCdn: false,
    token: token // Needed for drafts
})

// Helper to determine perspective
export const getPerspective = (isPreview?: boolean) => {
    return isPreview ? 'previewDrafts' : 'published'
}
