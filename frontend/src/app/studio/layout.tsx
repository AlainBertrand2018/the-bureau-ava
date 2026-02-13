export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div id="sanity-root" style={{ height: '100vh', width: '100vw' }}>{children}</div>
}
