'use client'

import { useEffect, useState, useRef } from 'react'
import config from '../../../../sanity.config'
import dynamic from 'next/dynamic'

const NextStudio = dynamic(
    () => import('next-sanity/studio').then(mod => mod.NextStudio),
    { ssr: false }
)

/**
 * BULLETPROOF Sanity Studio Isolation
 * ====================================
 * 
 * Problem:
 * Sanity Studio's internal Portable Text editor components contain invalid
 * HTML nesting (<div> inside <p>) in their BlockQuote, TextFlex, and other
 * styled-components. This is a SANITY BUG (not ours) that triggers React 19's 
 * strict DOM validation, producing console errors like:
 *   - "In HTML, <div> cannot be a descendant of <p>"
 *   - "<p> cannot contain a nested <div>"
 * 
 * These are NOT hydration mismatches — they are DOM validation errors that
 * React 19 emits even during purely client-side rendering. Therefore:
 *   - `suppressHydrationWarning` does NOT suppress them
 *   - `ssr: false` does NOT suppress them
 *   - `useState(mounted)` guards do NOT suppress them
 * 
 * Solution:
 * We intercept console.error during the Studio rendering lifecycle to filter
 * out these specific Sanity-internal DOM nesting violations. This is safe because:
 *   1. /studio is disallowed in robots.txt — no crawler will ever see it
 *   2. These are Sanity's internal rendering bugs, not our application code
 *   3. We only filter the exact React DOM nesting patterns, nothing else
 *   4. All other errors pass through normally
 * 
 * This file should NEVER need to be touched unless Sanity fixes their
 * Portable Text editor's DOM nesting issues upstream.
 */

// DOM nesting patterns that Sanity Studio triggers (React 19 validation)
const SUPPRESSED_PATTERNS = [
    'cannot be a descendant of',
    'cannot contain a nested',
    'In HTML,',
    'See this log for the ancestor stack trace',
] as const

function isSanitySuppressedError(...args: any[]): boolean {
    const msg = typeof args[0] === 'string' ? args[0] : ''
    return SUPPRESSED_PATTERNS.some(pattern => msg.includes(pattern))
}

export default function StudioPage() {
    const [mounted, setMounted] = useState(false)
    const patchedRef = useRef(false)

    useEffect(() => {
        // Patch console.error ONCE to filter Sanity DOM nesting warnings
        if (!patchedRef.current) {
            patchedRef.current = true
            const originalConsoleError = console.error

            console.error = (...args: any[]) => {
                if (isSanitySuppressedError(...args)) {
                    // Silently swallow Sanity's invalid DOM nesting warnings
                    return
                }
                originalConsoleError.apply(console, args)
            }

            // Restore on unmount (navigating away from studio)
            return () => {
                console.error = originalConsoleError
            }
        }
    }, [])

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
                <div style={{ opacity: 0.5, fontSize: 14 }}>Loading Studio…</div>
            </div>
        )
    }

    return (
        <div suppressHydrationWarning>
            <NextStudio config={config} />
        </div>
    )
}
