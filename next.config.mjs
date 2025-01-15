import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';
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
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
//   experimental: {
//     turbo: true,
//     mdxRs: true,
//   },
};

const withBoth = (config) =>
  withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching, // Use default runtime caching
    disable: process.env.NODE_ENV === 'development',
  })(withMDX(config));

// Export configuration
export default withBoth(nextConfig);
