import { DocumentActionProps, useDocumentOperation } from 'sanity'

export function PreviewAction(props: DocumentActionProps) {
    const { published, draft } = props
    const doc = draft || published
    const slug = (doc?.slug as any)?.current

    return {
        label: '👁️ High-Fidelity Preview',
        disabled: !slug,
        onHandle: () => {
            if (!slug) return

            const baseUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://ava.launchableai.online'

            const url = `${baseUrl}/blog/${slug}?preview=true`
            window.open(url, '_blank')
        },
    }
}
