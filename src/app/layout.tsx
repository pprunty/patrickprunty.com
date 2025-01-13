import { Inter } from 'next/font/google';
import './globals.css';
import { AUTHOR, SITE_URL, SOCIAL_URLS, DEFAULT_KEYWORDS } from '@/config';
import { doge } from './doge';
import { themeEffect } from '@/modules/common/templates/ThemeSwitcher/theme-effect';
import Header from './header';
import Footer from './footer';
import type { Viewport } from 'next';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import ClientOnlyAnalytics from '@/modules/common/templates/ClientOnlyAnalytics';
import ClientSideScrollRestorer from '@/modules/common/components/ClientSideScrollRestorer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Define viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: 'transparent',
};

// Font settings
const inter = Inter({
  subsets: ['latin'], // Only include necessary subsets
  weight: ['400', '500', '600', '700'], // Specify required font weights
});

// Define metadata
export const metadata: Metadata = {
  title: `${AUTHOR.name}`,
  description: `${AUTHOR.description}`, // Use AUTHOR's updated description from config
  keywords: [
    ...DEFAULT_KEYWORDS, // Spread the existing keywords array
    'samwise',
    'Patrick Prunty',
    'NextJS',
  ],
  manifest:
    process.env.NODE_ENV === 'production'
      ? '/manifest.prod.json'
      : '/manifest.json',
  openGraph: {
    title: `${AUTHOR.name}`,
    description: `${AUTHOR.description}`, // Use AUTHOR's updated description from config
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
      // todo: only use user provided input for socials here
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
        {/* ensure your logo/icon is named "icon.webp" and in the public directory for favicon support */}
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
        <Footer />
        <ClientOnlyAnalytics />
        {/* Conditionally render the ToastContainer only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
