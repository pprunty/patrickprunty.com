import { NextResponse } from 'next/server';
import { getAllPosts } from '@/app/get-posts';
import xml from 'xml';
import { SITE_URL } from '@/config';

export async function GET() {
  // Fetch only published posts (filterDrafts = true)
  const posts = await getAllPosts(true);

  const feed = [
    {
      rss: [
        { _attr: { version: '2.0' } },
        {
          channel: [
            { title: "Patrick Prunty's Blog" },
            { link: SITE_URL },
            {
              description:
                'Sharing insights on life, technology, and open-source projects.',
            },
            { language: 'en-us' },
            { lastBuildDate: new Date().toUTCString() },
            ...posts.map((post) => ({
              item: [
                { title: post.title },
                { link: `${SITE_URL}/blog/${post.slug}` },
                { description: post.description || '' },
                { pubDate: new Date(post.date).toUTCString() },
                { author: post.author },
                { guid: `${SITE_URL}/blog/${post.slug}` },
                { category: post.keywords.join(', ') },
                ...(post.image
                  ? [
                      {
                        enclosure: {
                          _attr: {
                            url: `${SITE_URL}${post.image}`,
                            type: 'image/jpeg',
                          },
                        },
                      },
                    ]
                  : []),
              ],
            })),
          ],
        },
      ],
    },
  ];

  return new NextResponse(xml(feed, { declaration: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
