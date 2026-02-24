import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | Survey Optimization Platform',
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
