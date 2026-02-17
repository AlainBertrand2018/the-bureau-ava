import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { MissionProvider } from "@/context/MissionContext";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  metadataBase: new URL("https://the-bureau-ava.vercel.app"),
  title: "AVA by The Bureau | AI Survey Quality Auditor",
  description:
    "Stop launching broken surveys. AVA stress-tests your questionnaire with AI diagnostic personas to catch bias, ambiguity, and weak questions before you go live.",
  openGraph: {
    title: "AVA by The Bureau | AI Survey Quality Auditor",
    description:
      "I deploy diagnostic AI personas to stress-test your survey questionnaire. Catch bias, confusion, drop-off risks, and structural flaws in under 5 minutes.",
    url: "https://the-bureau-ava.vercel.app",
    siteName: "AVA by The Bureau",
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
    title: "AVA by The Bureau | AI Survey Quality Auditor",
    description:
      "Stress-test your survey with AI. Catch bias, ambiguity, and drop-off risks before fieldwork.",
    images: ["/og-image.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AVA by The Bureau",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  image: "https://the-bureau-ava.vercel.app/og-image.webp",
  "@id": "https://the-bureau-ava.vercel.app",
  url: "https://the-bureau-ava.vercel.app",
  description:
    "AI-powered survey quality auditor. Detects bias, ambiguity, leading language, and structural flaws in questionnaires before fieldwork begins.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MUR",
    description: "Free tier: 1 audit, 10 personas, 5 questions",
  },
  creator: {
    "@type": "Organization",
    name: "The Bureau",
    url: "https://the-bureau-ava.vercel.app",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cybercity",
      addressLocality: "Ebène",
      addressRegion: "Plaines Wilhems",
      postalCode: "72201",
      addressCountry: "MU",
    },
  },
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
        <LanguageProvider>
          <CurrencyProvider>
            <MissionProvider>
              {children}
            </MissionProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
