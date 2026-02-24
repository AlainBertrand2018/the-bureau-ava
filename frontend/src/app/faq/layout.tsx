import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | FAQ',
    description: 'Frequently asked questions regarding autonomous survey validation, the AVA orchestrator, and The Bureau\'s methodologies.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
