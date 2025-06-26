import { notFound } from "next/navigation";
import { allMdxPages } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-components";
import { AUTHOR, SITE_URL, DEFAULT_KEYWORDS } from '@/config';

export const metadata = {
  title: `${AUTHOR.name}`,
  image: `/icon.webp`,
  description: `Software developer, writer, and amateur explorer.`,
  openGraph: {
    title: `${AUTHOR.name}`,
    description: `Software developer, writer, and amateur explorer.`,
    siteName: `${AUTHOR.name}'s website`,
    media: [
      {
        url: `/icon.webp`,
        width: 400,
        height: 400,
        alt: `${AUTHOR.name}'s profile picture`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: `${AUTHOR.twitterHandle}`,
    creator: `${AUTHOR.twitterHandle}`,
    media: [
      {
        url: `/icon.webp`,
        alt: `${AUTHOR.name}'s profile picture`,
      },
    ],
  },
  keywords: DEFAULT_KEYWORDS.concat([
    AUTHOR.name,
    'Software Engineer',
    'Dublin',
    'Ireland',
    'technology',
  ]),
  metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: SITE_URL
    }
};

export default function HomePage() {
  console.log('Available pages:', allMdxPages.map(p => ({ slug: p.slug, hasBodyCode: !!p.body?.code })));
  const homePage = allMdxPages.find((page) => page.slug === "home");

  if (!homePage) {
    console.error('No home page found');
    notFound();
  }

  console.log('Home page found:', { 
    slug: homePage.slug, 
    hasBodyCode: !!homePage.body?.code,
    codeType: typeof homePage.body?.code,
    codeLength: homePage.body?.code?.length,
    bodyKeys: Object.keys(homePage.body || {})
  });

  return (
    <div className="max-w-4xl mx-auto w-full min-w-0 py-8">
      <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none w-full break-words overflow-wrap-anywhere min-w-0">
        <Mdx code={homePage.body.code} />
      </article>
    </div>
  );
} 