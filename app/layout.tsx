import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00f5ff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.scalptra.com'),
  title: {
    default: "SCALPTRA - AI-Powered Quantitative Trading",
    template: "%s | SCALPTRA"
  },
  description: "Preparing the most precise Agentic Trading system for you. Start trading with next-generation AI algorithms on OKX, coming soon.",
  keywords: [
    "AI Trading", 
    "Quantitative Trading", 
    "OKX", 
    "Cryptocurrency", 
    "Trading Bot", 
    "Algorithmic Trading",
    "Automated Trading",
    "Crypto Trading",
    "Machine Learning Trading",
    "Financial Technology",
    "FinTech",
    "Trading Platform",
    "Investment Technology",
    "Digital Assets",
    "Blockchain Trading"
  ],
  authors: [{ name: "Scalptra Lab", url: "https://www.scalptra.com" }],
  creator: "Scalptra Lab",
  publisher: "Scalptra Lab",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.scalptra.com",
  },
  category: "Technology",
  classification: "Financial Technology",
  openGraph: {
    title: "SCALPTRA - AI-Powered Quantitative Trading",
    description: "Preparing the most precise Agentic Trading system for you. Start trading with next-generation AI algorithms on OKX, coming soon.",
    url: "https://www.scalptra.com",
    siteName: "SCALPTRA",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/scalptra_logo.png",
        width: 1200,
        height: 630,
        alt: "SCALPTRA - AI-Powered Quantitative Trading Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@scalptra",
    creator: "@scalptra",
    title: "SCALPTRA - AI-Powered Quantitative Trading",
    description: "Preparing the most precise Agentic Trading system for you. Start trading with next-generation AI algorithms on OKX, coming soon.",
    images: {
      url: "/scalptra_logo.png",
      alt: "SCALPTRA - AI-Powered Quantitative Trading Platform",
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
    // other: {
    //   me: ["your-email@scalptra.com", "https://scalptra.com"],
    // },
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/favicons/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicons/android-chrome-512x512.png" },
    ],
  },
  manifest: "/favicons/site.webmanifest",
  other: {
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "your-bing-verification-code",
    "yandex-verification": "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SCALPTRA",
    "alternateName": "Scalptra Lab",
    "url": "https://www.scalptra.com",
    "logo": "https://www.scalptra.com/scalptra_logo.png",
    "description": "AI-Powered Quantitative Trading Platform",
    "foundingDate": "2025",
    "industry": "Financial Technology",
    "sameAs": [
      "https://www.facebook.com/scalptra/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Thai"]
    },
    "offers": {
      "@type": "Offer",
      "description": "AI-Powered Quantitative Trading System",
      "availability": "https://schema.org/ComingSoon"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Additional SEO meta tags */}
        <meta name="application-name" content="SCALPTRA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SCALPTRA" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#00f5ff" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Additional SEO tags */}
        <meta name="rating" content="general" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
        
        {/* Geo tags */}
        <meta name="geo.region" content="TH" />
        <meta name="geo.country" content="Thailand" />
        
        {/* Cache control */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
        
        {/* Canonical URL - Always point to www version */}
        <link rel="canonical" href="https://www.scalptra.com" />
        
        {/* Domain consolidation - redirect all to www version */}
        <link rel="alternate" href="https://www.scalptra.com" hrefLang="x-default" />
        <link rel="alternate" href="https://www.scalptra.com" hrefLang="en" />
        <link rel="alternate" href="https://www.scalptra.com/th" hrefLang="th" />
        
        {/* Ensure canonical points to www version */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname !== 'www.scalptra.com') {
                const canonical = document.querySelector('link[rel="canonical"]');
                if (canonical) {
                  canonical.href = 'https://www.scalptra.com' + window.location.pathname;
                }
              }
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
