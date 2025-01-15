import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import './globals.css';
import './atom-one-dark.css';
import { AUTHOR, SITE_URL, SOCIAL_URLS, DEFAULT_KEYWORDS } from '@/config';
import { doge } from './doge';
import { themeEffect } from '@/modules/common/templates/ThemeSwitcher/theme-effect';
import Header from './header';
import React, { lazy, Suspense } from 'react';
import type { Viewport } from 'next';
import type { Metadata } from 'next';
import { Analytics } from './analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GA_MEASUREMENT_ID } from '@/config';
import Script from 'next/script';
import ToastClient from './toast'; // Import the new client component

const ClientSideScrollRestorer = lazy(
  () => import('@/modules/common/components/ClientSideScrollRestorer'),
);
const Footer = lazy(() => import('./footer'));

// Define viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: 'transparent',
};

// Font settings
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Define metadata
export const metadata: Metadata = {
  title: `${AUTHOR.name}'s blog'`,
  description: `${AUTHOR.description}`,
  keywords: [...DEFAULT_KEYWORDS, 'samwise', 'Patrick Prunty', 'NextJS'],
  manifest:
    process.env.NODE_ENV === 'production'
      ? '/manifest.prod.json'
      : '/manifest.json',
  openGraph: {
    title: `${AUTHOR.name}`,
    description: `${AUTHOR.description}`,
    url: SITE_URL,
    siteName: `${AUTHOR.name}`,
    images: [
      {
        url: `${SITE_URL}/icon.webp`,
        alt: `${AUTHOR.name} profile picture`,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: `${SOCIAL_URLS.twitter}`,
    creator: `${SOCIAL_URLS.twitter}`,
    images: [
      {
        url: `${SITE_URL}/icon.webp`,
        alt: `${AUTHOR.name} profile picture`,
      },
    ],
  },
  icons: {
    icon: [{ url: '/icons/192x192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/180x180.png', sizes: '180x180' }],
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    jobTitle: `${AUTHOR.bio}`,
    description: `${AUTHOR.description}`,
    url: SITE_URL,
    sameAs: [
      SOCIAL_URLS.twitter,
      SOCIAL_URLS.strava,
      SOCIAL_URLS.github,
      SOCIAL_URLS.reddit,
      SOCIAL_URLS.linkedin,
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();(${doge.toString()})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <link rel="icon" href="/icons/32x32.png" sizes="any" />
      </head>
      <body className="dark:text-gray-100 max-w-2xl m-auto">
        <main className="p-6 pt-3 md:pt-6 min-h-screen">
          <Header />
          {children}
          <Suspense fallback={null}>
            <ClientSideScrollRestorer />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <Analytics />
        <ToastClient /> {/* Include the client component */}
        <SpeedInsights />
      </body>
    </html>
  );
}
