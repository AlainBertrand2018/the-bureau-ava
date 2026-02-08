import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://the-bureau-ava.vercel.app'),
  title: "The Bureau | Predicting survey bias, dropouts, and sentiment",
  description: "The Bureau utilizes census-weighted synthetic populations to stress-test market research. We predict survey bias, dropouts, and sentiment using privacy-first AI agents.",
  openGraph: {
    title: "The Bureau | Predicting survey bias, dropouts, and sentiment",
    description: "The Bureau is the authority on synthetic market research. We replace guesswork with 'Pre-Flight Validation,' utilizing AI agents engineered via Iterative Proportional Fitting (IPF) to mirror the 2022 Census. From stress-testing questionnaires to predicting consumer backlash, our Google Confidential Computing stack delivers risk-free insights before you spend your real budget.",
    url: 'https://the-bureau-ava.vercel.app',
    siteName: 'The Bureau',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'The Bureau - Synthetic Market Research Authority',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Bureau | Predicting survey bias, dropouts, and sentiment",
    description: "Authority on synthetic market research. Predict survey bias and consumer sentiment with privacy-first AI agents.",
    images: ['/og-image.webp'],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The Bureau",
  "image": "https://the-bureau-ava.vercel.app/og-image.webp",
  "@id": "https://the-bureau-ava.vercel.app",
  "url": "https://the-bureau-ava.vercel.app",
  "telephone": "+2300000000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Cybercity",
    "addressLocality": "Ebène",
    "addressRegion": "Plaines Wilhems",
    "postalCode": "72201",
    "addressCountry": "MU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -20.2443,
    "longitude": 57.4845
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://www.linkedin.com/company/thebureau-syntax"
  ],
  "priceRange": "Rs 15,000 - Rs 45,000",
  "description": "The Bureau utilizes census-weighted synthetic populations to stress-test market research. We predict survey bias, dropouts, and sentiment using privacy-first AI agents.",
  "serviceType": [
    "Market Research Simulation",
    "Survey Stress Testing",
    "Synthetic Population Modeling",
    "Consumer Sentiment Prediction"
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
        className={`${inter.variable} font-sans antialiased bg-[#0A1128] text-white selection:bg-[#FF4D00] selection:text-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
