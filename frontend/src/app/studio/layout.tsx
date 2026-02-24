export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div id="sanity-root" suppressHydrationWarning style={{ height: '100vh', width: '100vw' }}>{children}</div>
}
