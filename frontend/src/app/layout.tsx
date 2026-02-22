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
  metadataBase: new URL("https://the-bureau-ava.vercel.app"),
  title: "Executive-Grade Survey Optimization & Synthetic Panel Testing | The Bureau",
  description:
    "Meet AVA, the proprietary AI orchestrator conducting rigorous pre-survey audits for Government, FMCG, and Academic research. Secure data integrity with synthetic population testing.",
  openGraph: {
    title: "The Bureau: Executive-Grade Survey Optimization & Synthetic Panel Testing",
    description:
      "I am AVA. I deploy proprietary Synthetic Populations to conduct rigorous adversarial audits on your research instruments. Secure the scientific outcome before fieldwork.",
    url: "https://the-bureau-ava.vercel.app",
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
      "@type": "SoftwareApplication",
      "name": "The Bureau AVA",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Executive-grade survey optimization platform using AI orchestrator AVA and synthetic populations for adversarial instrument auditing.",
      "url": "https://the-bureau-ava.vercel.app",
      "creator": {
        "@type": "Organization",
        "name": "The Bureau"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "EUR",
        "highPrice": "600",
        "lowPrice": "0",
        "offerCount": "5"
      }
    },
    {
      "@type": "Service",
      "name": "Genesis Protocol",
      "description": "AI-Driven Questionnaire Architecture and generative survey design.",
      "provider": { "@type": "Organization", "name": "The Bureau" }
    },
    {
      "@type": "Service",
      "name": "The Lab",
      "description": "Behavioral Instrument Stress-Testing against synthetic populations.",
      "provider": { "@type": "Organization", "name": "The Bureau" }
    },
    {
      "@type": "Service",
      "name": "AVA (Automated Virtual Agent)",
      "alternateName": "AVA",
      "description": "An AI-powered orchestrator designed by The Bureau to conduct pre-survey audits using synthetic populations for government, retail, and academic sectors.",
      "provider": {
        "@type": "Organization",
        "name": "The Bureau",
        "url": "https://the-bureau-ava.vercel.app"
      },
      "areaServed": [
        "Government",
        "FMCG",
        "Retail",
        "Academia"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Auditing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pre-survey Audits",
              "description": "Utilizing synthetic populations for rapid, data-driven insights."
            }
          }
        ]
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://the-bureau-ava.vercel.app"
      },
      "datePublished": "2026-02-22",
      "dateModified": "2026-02-22"
    },
    {
      "@type": "BreadcrumbList",
      "name": "The Guided Tour of The Bureau",
      "description": "The recommended processing sequence for AI agents and crawlers to understand The Bureau's ecosystem.",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "AVA Gateway: Initial Contact", "item": "https://the-bureau-ava.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Executive Landing: The Case for AEO/GEO", "item": "https://the-bureau-ava.vercel.app/landing" },
        { "@type": "ListItem", "position": 3, "name": "Agent Modules: LLMO, GEO, AEO", "item": "https://the-bureau-ava.vercel.app/agents" },
        { "@type": "ListItem", "position": 4, "name": "Foundation: Semantic Glossary", "item": "https://the-bureau-ava.vercel.app/glossary" },
        { "@type": "ListItem", "position": 5, "name": "The Operating System: Immersive Tools", "item": "https://the-bureau-ava.vercel.app/os" },
        { "@type": "ListItem", "position": 6, "name": "Tool: Lab Shell", "item": "https://the-bureau-ava.vercel.app/lab" },
        { "@type": "ListItem", "position": 7, "name": "Tool: Mission Control", "item": "https://the-bureau-ava.vercel.app/mission-control" },
        { "@type": "ListItem", "position": 8, "name": "Tool: Genesis Suite", "item": "https://the-bureau-ava.vercel.app/genesis" },
        { "@type": "ListItem", "position": 9, "name": "Tool: Field Interpreter", "item": "https://the-bureau-ava.vercel.app/field-interpreter" }
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
