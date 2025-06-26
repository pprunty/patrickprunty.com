import type { NextConfig } from "next"
import { createContentlayerPlugin } from "next-contentlayer2"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure content files trigger rebuilds
  webpack: (config, { dev }) => {
    if (dev) {
      // Watch content directory for changes
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          ...((config.watchOptions?.ignored as string[]) || []),
          // Don't ignore content files
          '!content/**/*',
        ],
      }
    }
    return config
  },
  // Enable experimental features for better dev experience
  experimental: {
    // Disable webpack caching that might interfere with contentlayer
    webpackBuildWorker: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  async headers() {
    return [
      // Cache /blog for 1 minute + stale-while-revalidate
      {
        source: '/blog',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=60, stale-while-revalidate=600',
          },
        ],
      },
      // Cache a single /images/me.WEBP specifically
      {
        source: '/images/me.WEBP',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/me-sketch2.png',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache *all* images in /images/projects/ for 1 year (immutable)
      {
        source: '/images/projects/(.*)',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Similarly, cache *all* images in /images/photography/ for 1 year (immutable)
      {
        source: '/images/photography/(.*)',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache map.webp for fast loading
      {
        source: '/images/map.webp',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
})

export default withContentlayer(nextConfig)