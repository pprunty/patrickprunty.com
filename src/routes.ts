import type React from "react"
import { User, Image, Code, Books, YoutubeLogo } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"
import config from "@/config"
import type { IconProps } from "@phosphor-icons/react"

export interface RouteItem {
  href: string
  label: string
  icon: React.ForwardRefExoticComponent<IconProps>
  hide: boolean
  external: boolean
  metadata: Metadata
}

export interface FooterLink {
  label: string
  href: string
  metadata: Metadata
}

export interface FooterSections {
  [key: string]: FooterLink[]
}

export const routes: RouteItem[] = [
  {
    href: "/",
    label: "About",
    icon: User,
    hide: false,
    external: false,
    metadata: {
      title: `About | ${config.companyName}`,
      description: "Learn more about who I am and what I do.",
      manifest: process.env.NODE_ENV === "production" ? "/manifest.prod.json" : "/manifest.json",
      openGraph: {
        title: `About | ${config.companyName}`,
        description: `Learn more about who I am and what I do.`,
        url: config.url,
        siteName: config.companyName,
        images: [
          {
            url: `${config.url}/icon.webp`,
            alt: ``,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        site: config.socials.twitter,
        creator: config.socials.twitter,
        images: [
          {
            url: `${config.url}/icon.webp`,
            alt: `${config.companyName}`,
          },
        ],
      },
      icons: {
        icon: [{ url: "/icons/192x192.png", sizes: "192x192", type: "image/png" }],
        apple: [{ url: "/icons/180x180.png", sizes: "180x180", type: "image/png" }],
      },
      metadataBase: new URL(config.url),
    },
  },
  {
    href: "/photos",
    label: "Photos",
    icon: Image,
    hide: false,
    external: false,
    metadata: {
      title: "Photos | My Website",
      description: "View my photography portfolio and gallery.",
    },
  },
  {
    href: "/software",
    label: "Software",
    icon: Code,
    hide: false,
    external: false,
    metadata: {
      title: "Software | My Website",
      description: "Explore my software projects and development work.",
      openGraph: {
        title: "Software | My Website",
        description: "Explore my software projects and development work.",
        url: `${config.url}/software`,
        siteName: config.companyName,
        images: [
          {
            url: `${config.url}/software-preview.webp`,
            alt: "Software Preview",
          },
        ],
        type: "website",
      },
    },
  },
  {
    href: "/youtube",
    label: "YouTube",
    icon: YoutubeLogo,
    hide: false,
    external: false,
    metadata: {
      title: "YouTube | My Website",
      description: "Check out my YouTube channel and videos.",
    },
  },
  {
      href: "/blog",
      label: "Blog",
      icon: Books,
      hide: false,
      external: false,
      metadata: {
        title: "YouTube | My Website",
        description: "Check out my YouTube channel and videos.",
      },
    },
].filter((route) => !route.hide)

// Create a metadata map for main navigation routes
export const metadataMap: Record<string, Metadata> = Object.fromEntries(
  routes.map((route) => [route.href, route.metadata]),
)

