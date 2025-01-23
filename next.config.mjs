import withPWA from 'next-pwa';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import createMDX from '@next/mdx';

// Define the configuration for MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

const nextConfig = {
  reactStrictMode: true,
    experimental: {
      mdxRs: true,
    },
  headers() {
      return [
        {
          source: "/images/me.WEBP",
          headers: [
            {
              key: "cache-control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ];
    },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

const withBoth = (config) =>
  withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })(withMDX(config));

// Export configuration
export default withBoth(nextConfig);

