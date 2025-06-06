import './globals.css';
import './atom-one-dark.css';
import { AUTHOR, SITE_URL, SOCIAL_URLS, DEFAULT_KEYWORDS } from '@/config';
import { doge } from './doge';
import { themeEffect } from '@/components/theme-effect';
import Header from './header';
import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Analytics } from './analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GA_MEASUREMENT_ID } from '@/config';
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import ClientComponents from './client';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
});

const perfectlyNineties = localFont({
  src: [
    {
      path: './perfectly-nineties-regular.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './perfectly-nineties-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './perfectly-nineties-regular.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-perfectly-nineties',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: 'transparent',
};

export const metadata: Metadata = {
  title: {
    default: `${AUTHOR.name}'s Blog`,
    template: `%s | ${AUTHOR.name}'s Blog`,
  },
  description: AUTHOR.description,
  keywords: [...DEFAULT_KEYWORDS, 'Patrick Prunty', 'NextJS'],
  manifest:
    process.env.NODE_ENV === 'production'
      ? '/manifest.prod.json'
      : '/manifest.json',
  openGraph: {
    title: `${AUTHOR.name}'s Blog`,
    description: AUTHOR.description,
    url: SITE_URL,
    siteName: AUTHOR.name,
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
    site: SOCIAL_URLS.twitter,
    creator: SOCIAL_URLS.twitter,
    images: [
      {
        url: `${SITE_URL}/icon.webp`,
        alt: `${AUTHOR.name}'s profile picture`,
      },
    ],
  },
  icons: {
    icon: [{ url: '/icons/192x192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/180x180.png', sizes: '180x180', type: 'image/png' }],
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} ${instrumentSerif.variable} ${perfectlyNineties.variable} font-sans antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();(${doge.toString()})();`,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Patrick Prunty's Blog"
          href={`${SITE_URL}/api/rss`}
        />
        <link rel="icon" href="/icons/32x32.png" sizes="any" />
      </head>
      <body className="text-gray-800 dark:text-gray-300 pt-3 sm:pt-6 p-6 sm:px-4">
        <Header />
        <main className="z-[100] min-h-screen max-w-2xl pt-12 m-auto text-pretty">
          {children}
        </main>
        <ClientComponents />
        <Analytics />
        <SpeedInsights />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
          }}
        />
      </body>
    </html>
  );
}
