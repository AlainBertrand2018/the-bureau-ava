import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Technical FAQ | The Bureau Intelligence Manifest",
    description: "Comprehensive technical enquiries and documentation regarding AVA (Autonomous Validation Analyst) and the Mauritius-born AI research protocols.",
    openGraph: {
        title: "Technical FAQ | The Bureau Intelligence Manifest",
        description: "AVA (Autonomous Validation Analyst) is an AI system designed to stress-test and validate research questionnaires before fieldwork. Born and developed in Mauritius.",
    }
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
