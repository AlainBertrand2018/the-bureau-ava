import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'

import { PreviewAction } from './src/sanity/actions/PreviewAction'

export default defineConfig({
    name: 'default',
    title: 'AVA Blog Studio',
    basePath: '/studio',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wtp3tkur',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

    plugins: [structureTool(), visionTool()],

    schema: {
        types: schema.types,
    },

    document: {
        actions: (prev, context) => {
            return context.schemaType === 'post'
                ? [PreviewAction, ...prev]
                : prev
        }
    }
})
