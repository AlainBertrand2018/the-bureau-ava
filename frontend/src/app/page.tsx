import { Metadata } from 'next';
import RootPageClient from './RootPageClient';

export const metadata: Metadata = {
  title: 'THE BUREAU | Survey Optimization & Synthetic Panel Testing',
  description: 'Meet AVA, the proprietary AI orchestrator conducting rigorous pre-survey audits for Government, FMCG, and Academic research. Secure data integrity with synthetic population testing.',
  other: {
    'rel': 'canonical',
    'href': '/'
  }
};

export default function RootPage() {
  return <RootPageClient />;
}
