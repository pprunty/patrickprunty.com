import type React from "react"
import "./globals.css"
import "./atom-one-dark.css"
import { AUTHOR, SITE_URL, SOCIAL_URLS, DEFAULT_KEYWORDS } from "@/config"
import { doge } from "./doge"
import { themeEffect } from "@/modules/common/templates/ThemeSwitcher/theme-effect"
import Header from "./header"
import type { Metadata, Viewport } from "next"
import { Analytics } from "./analytics"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GA_MEASUREMENT_ID } from "@/config"
import { Inter, Gideon_Roman } from "next/font/google"
import ClientComponents from "./client"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const gideonRoman = Gideon_Roman({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gideon-roman",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "transparent",
}

export const metadata: Metadata = {
  title: {
    default: `${AUTHOR.name}'s Blog`,
    template: `%s | ${AUTHOR.name}'s Blog`,
  },
  description: AUTHOR.description,
  keywords: [...DEFAULT_KEYWORDS, "Patrick Prunty", "NextJS"],
  manifest: process.env.NODE_ENV === "production" ? "/manifest.prod.json" : "/manifest.json",
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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
    icon: [{ url: "/icons/192x192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/180x180.png", sizes: "180x180", type: "image/png" }],
  },
  metadataBase: new URL(SITE_URL),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${gideonRoman.variable} font-serif antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();(${doge.toString()})();`,
          }}
        />
        <link rel="alternate" type="application/rss+xml" title="Patrick Prunty's Blog" href={`${SITE_URL}/api/rss`} />
        <link rel="icon" href="/icons/32x32.png" sizes="any" />
      </head>
      <body className="max-w-3xl m-auto font-[var(--font-gideon-roman)]">
        <main className="p-4 md:p-0 z-[100] pt-3 md:pt-6 min-h-screen">
          <Header />
          {children}
        </main>
        <ClientComponents />
        <Analytics />
        <SpeedInsights />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
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
  )
}

