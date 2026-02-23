import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { MissionProvider } from "@/context/MissionContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
  variable: "--font-cormorant",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ava.launchableai.online"),
  title: "Executive-Grade Survey Optimization & Synthetic Panel Testing | The Bureau",
  description:
    "Meet AVA, the proprietary AI orchestrator conducting rigorous pre-survey audits for Government, FMCG, and Academic research. Secure data integrity with synthetic population testing.",
  manifest: "/manifest.json",
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
      "name": "AVA (Autonomous Validation Analyst)",
      "applicationCategory": "StrategicIntelligenceApplication",
      "operatingSystem": "Web-Based Cognitive Interface",
      "description": "Executive-grade autonomous AI system designed to stress-test, validate, and falsify strategic assumptions. Virtual CEO of the Bureau agentic ecosystem.",
      "url": "https://ava.launchableai.online/ava",
      "creator": {
        "@type": "Organization",
        "name": "The Bureau"
      },
      "featureList": [
        "Adversarial Assumption Validation",
        "Failure Mode Mapping",
        "Strategic Stress Testing",
        "Agentic Orchestration",
        "Bias Neutralization Engine"
      ]
    },
    {
      "@type": "Service",
      "name": "The Bureau Validation Team",
      "description": "Autonomous Agentic Team orchestrated by AVA for high-frequency data integrity and strategic auditing.",
      "provider": {
        "@type": "Organization",
        "name": "The Bureau"
      },
      "areaServed": "Global",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "The Bureau Autonomous Agent Suite",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Sentinel",
              "description": "Tactical Market Reconnaissance and OSINT Scouting."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Profiler",
              "description": "Deep Cultural Calibration and Psychographic Analysis."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Architect",
              "description": "Genesis Protocol Instrument Design and Questionnaire Logic."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Auditor",
              "description": "Adversarial Stress Testing and Failure Mode Discovery."
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "name": "The Bureau AVA",
      "url": "https://ava.launchableai.online",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ava.launchableai.online/glossary?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "The authoritative portal for AVA AI Orchestration and Survey Validation protocol documentation.",
      "about": [
        { "@type": "CreativeWork", "name": "LLM Manifest", "url": "https://ava.launchableai.online/llms.txt" },
        { "@type": "CreativeWork", "name": "AI Identity Manifest", "url": "https://ava.launchableai.online/ai-identity.json" }
      ]
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
    <html lang="en" className={`scroll-smooth ${plusJakarta.variable} ${outfit.variable} ${cormorant.variable} ${mono.variable}`}>
      <body
        className={`font-sans antialiased bg-[#F2F0E9] text-[#1A1A1A] relative`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Global Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.035] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <CurrencyProvider>
          <MissionProvider>
            {children}
          </MissionProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
