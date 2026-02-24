import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | News Feed',
    description: 'The latest operational updates, system enhancements, and strategic deployments from the Survey Optimization Bureau.',
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
