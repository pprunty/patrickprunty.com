import slugs from '@/posts/slugs.json';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import redis from '@/app/redis';
import commaNumber from 'comma-number';
import { AUTHOR } from '@/config';
import formatDate from './formatDate';

export const getAllPosts = async (
  includeViews: boolean = true,
): Promise<BlogPostType[]> => {
  // Fetch all views from Redis
  const allViews: Record<string, string> | null = includeViews
    ? await redis.hgetall('views')
    : null;

  // Map over slugs to create BlogPostType objects
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        // Dynamically import metadata for each post
        const { metadata } = await import(`@/posts/${slug}/page.mdx`);
        const views = Number(allViews?.[slug] ?? 0);

        return {
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
        } as BlogPostType;
      } catch (error) {
        console.error(`Error processing post ${slug}:`, error);
        return null;
      }
    }),
  );

  // Filter out null posts (from errors) and drafts in production
  const isProduction = process.env.NODE_ENV === 'production';
  return posts.filter(
    (post) => post && (!isProduction || !post.draft),
  ) as BlogPostType[];
};
