import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'THE BUREAU | Investor Relations',
    description: 'Information for potential partners, shareholders, and early-stage capital allocators in the autonomous research ecosystem.',
};

export default function InvestorsChannelLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
