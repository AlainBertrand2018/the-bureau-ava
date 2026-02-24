'use client'

import { useEffect, useState } from 'react'
import config from '../../../../sanity.config'
import dynamic from 'next/dynamic'

const NextStudio = dynamic(
    () => import('next-sanity/studio').then(mod => mod.NextStudio),
    { ssr: false }
)

/**
 * Sanity Studio page — renders entirely on the client.
 * 
 * Sanity's internal Portable Text components (e.g. BlockQuote) contain
 * invalid HTML nesting (<div> inside <p>) which triggers React 19's
 * stricter DOM validation. By deferring the entire render to the client
 * via a mounted guard + dynamic import with ssr:false, we avoid any
 * server/client HTML comparison that would surface these warnings.
 * 
 * This page is not indexed by crawlers (robots.txt disallows /studio).
 */
export default function StudioPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#101112',
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
            }}>
                <p style={{ opacity: 0.5, fontSize: 14 }}>Loading Studio…</p>
            </div>
        )
    }

    return (
        <div suppressHydrationWarning>
            <NextStudio config={config} />
        </div>
    )
}
