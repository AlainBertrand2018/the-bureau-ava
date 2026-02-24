'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import dynamic from 'next/dynamic'

// Force the Studio to render only on the client to avoid SSR hydration mismatches
// specifically the "p cannot contain div" error triggered by Sanity's internal UI library
const Studio = dynamic(() => Promise.resolve(({ config }: { config: any }) => (
    <NextStudio config={config} />
)), { ssr: false })

export default function StudioPage() {
    return <Studio config={config} />
}
