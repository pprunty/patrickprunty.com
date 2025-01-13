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
    removeConsole: process.env.NODE_ENV !== 'development',
  },
    experimental: {
      mdxRs: true,
    },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

// Export configuration as default without PWA
export default withMDX(nextConfig);
