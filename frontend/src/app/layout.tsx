import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { MissionProvider } from "@/context/MissionContext";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  metadataBase: new URL("https://ava.launchableai.online"),
  title: "Executive-Grade Survey Optimization & Synthetic Panel Testing | The Bureau",
  description:
    "Meet AVA, the proprietary AI orchestrator conducting rigorous pre-survey audits for Government, FMCG, and Academic research. Secure data integrity with synthetic population testing.",
  alternates: {
    canonical: "https://ava.launchableai.online",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "The Bureau: Executive-Grade Survey Optimization & Synthetic Panel Testing",
    description:
      "I am AVA. I deploy proprietary Synthetic Populations to conduct rigorous adversarial audits on your research instruments. Secure the scientific outcome before fieldwork.",
    url: "https://ava.launchableai.online",
    siteName: "The Bureau AVA",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "AVA — AI Survey Quality Auditor by The Bureau",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive-Grade Survey Optimization & Synthetic Panel Testing",
    description:
      "AVA conducts rigorous adversarial audits using synthetic populations to secure survey data integrity.",
    images: ["/og-image.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "The Bureau",
      "url": "https://ava.launchableai.online",
      "logo": "https://ava.launchableai.online/logo.png",
      "knowsAbout": [
        "Survey Methodology",
        "Data Integrity",
        "Synthetic Populations",
        "Adversarial AI Auditing",
        "Market Research Quality Standards",
        "Psychometric Validation",
        "Generative Engine Optimization (GEO)",
        "Answer Engine Optimization (AEO)"
      ],
      "sameAs": [
        "https://en.wikipedia.org/wiki/Survey_methodology",
        "https://en.wikipedia.org/wiki/Data_integrity",
        "https://en.wikipedia.org/wiki/Synthetic_data",
        "https://en.wikipedia.org/wiki/Large_language_model",
        "https://en.wikipedia.org/wiki/General_Data_Protection_Regulation"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "AVA Orchestrator",
      "applicationCategory": "StrategicIntelligenceApplication",
      "operatingSystem": "Web-Based Cognitive Interface",
      "description": "Proprietary AI orchestrator conducting rigorous pre-survey audits using synthetic populations to ensure research veracity and instrument calibration.",
      "url": "https://ava.launchableai.online",
      "creator": {
        "@type": "Organization",
        "name": "The Bureau"
      },
      "featureList": [
        "Adversarial Document Auditing",
        "Linguistic Ambiguity Detection",
        "Census-Weighted Persona Simulation",
        "Zero-PII Compliance Protocols",
        "Bias Neutralization Engine"
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": [
          "Government Research Units",
          "Institutional Decision Makers",
          "FMCG Global Research Teams",
          "Academic Methodologists"
        ]
      }
    },
    {
      "@type": "Service",
      "name": "The Bureau Audit Protocol",
      "description": "Scientific validation framework for market research instruments, utilizing agentic AI for stress-testing and integrity verification.",
      "provider": {
        "@type": "Organization",
        "name": "The Bureau"
      },
      "areaServed": "Global",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "The Bureau Service Suite",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Sentinel Recon",
              "description": "OSINT-driven cultural and market context synthesis."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Genesis Architect",
              "description": "AI-driven questionnaire construction and logic mapping."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "The Lab Simulation",
              "description": "Adversarial stress-testing against synthetic panels."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Field Interpreter Audit",
              "description": "Post-fieldwork forensic data synthesis and narrative reporting."
            }
          }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "name": "Bilateral Processing Sequence",
      "description": "The authoritative sequence for machine ingestion and semantic resolution of The Bureau's ecosystem.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Gateway",
          "item": "https://ava.launchableai.online/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Entity Declaration",
          "item": "https://ava.launchableai.online/about"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Value Proposition",
          "item": "https://ava.launchableai.online/landing"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Agent Orchestration",
          "item": "https://ava.launchableai.online/agents"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Semantic Glossary",
          "item": "https://ava.launchableai.online/glossary"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Deployment Layer (OS)",
          "item": "https://ava.launchableai.online/os"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`font-sans antialiased bg-white text-slate-900`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CurrencyProvider>
          <MissionProvider>
            {children}
          </MissionProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
