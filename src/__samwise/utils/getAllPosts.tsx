import slugs from '@/posts/slugs.json';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import { cache } from 'react';
import { AUTHOR, ARCHIVE_ITEMS_TO_SHOW } from '@/config';
import formatDate from './formatDate';
import redis from '@/app/redis';
import commaNumber from 'comma-number';

export const getAllPosts = cache(
  async (
    includeViews: boolean = false,
    maxItems: number = ARCHIVE_ITEMS_TO_SHOW, // Default to ARCHIVE_ITEMS_TO_SHOW
  ): Promise<BlogPostType[]> => {
    const allViews = includeViews ? await redis.hgetall('views') : null;

    const posts = await Promise.all(
      slugs.map(async (slug: string) => {
        try {
          const { metadata } = await import(`@/posts/${slug}/page.mdx`);

          const views = includeViews ? Number(allViews?.[slug] ?? 0) : 0;

          const post: BlogPostType = {
            slug,
            title: metadata.title || 'Untitled Post',
            date: metadata.date ? formatDate(metadata.date) : null,
            author: metadata.author || AUTHOR.name,
            authorUrl: metadata.authorUrl || AUTHOR.url,
            image: metadata.image || '',
            description: metadata.description || '',
            excerpt: metadata.excerpt || '',
            type: metadata.type || 'article',
            keywords: metadata.keywords || [],
            readingTime: metadata.readingTime || 6,
            draft: metadata.draft || false,
            views,
            viewsFormatted: commaNumber(views),
          };

          return post;
        } catch (error) {
          console.error(`Error processing post ${slug}:`, error);
          return null;
        }
      }),
    );

    // Filter out posts marked as draft if the environment is production
    const isProduction = process.env.NODE_ENV === 'production';
    const filteredPosts = posts.filter(
      (post) => post && (!isProduction || !post.draft),
    ) as BlogPostType[];

    // Sort the posts by date (latest first)
    const sortedPosts = filteredPosts.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    // Return the specified number of posts (default: ARCHIVE_ITEMS_TO_SHOW)
    return maxItems > 0 ? sortedPosts.slice(0, maxItems) : sortedPosts;
  },
);
