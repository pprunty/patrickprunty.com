import postsData from '@/app/posts.json';
import redis from '@/app/redis';
import commaNumber from 'comma-number';

export type Post = {
  slug: string;
  date: string;
  title: string;
  draft: boolean;
  description: string;
  keywords: string[];
  author: string;
  authorUrl: string;
  image: string;
  readingTime: number;
  views: number;
  viewsFormatted: string;
};

let cachedPosts: Post[] | null = null; // In-memory cache for performance

export const getAllPosts = async (
  filterDrafts: boolean = false,
): Promise<Post[]> => {
  if (cachedPosts) {
    return filterDrafts
      ? cachedPosts.filter((post) => !post.draft)
      : cachedPosts;
  }

  // Fetch all views in one Redis call
  const allViews: Record<string, string> | null = await redis.hgetall('views');

  // Map posts with views
  const posts = postsData.posts.map((post) => {
    const views = Number(allViews?.[post.slug] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  // Cache the results
  cachedPosts = posts;

  // Apply draft filtering
  return filterDrafts ? posts.filter((post) => !post.draft) : posts;
};
