import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Executive Landing | The Case for AEO & GEO',
    description: 'Explore the methodology of The Bureau. Transitioning from traditional SEO to AI-centric Generative Engine Optimization.',
    other: {
        'rel': 'prev',
        'href': '/',
    }
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <link rel="next" href="/agents" />
            {children}
        </>
    );
}
