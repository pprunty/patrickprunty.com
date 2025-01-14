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

// Export configuration as default without PWA
export default withMDX(nextConfig);
