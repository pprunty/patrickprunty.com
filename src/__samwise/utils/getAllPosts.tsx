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
  viewsFormatted?: string; // Lazy formatting
};

export const getAllPosts = async (filterDrafts: boolean = false): Promise<Post[]> => {
  // Fetch views and posts in parallel
  const [allViews, posts] = await Promise.all([
    redis.hgetall('views'),
    Promise.resolve(postsData.posts),
  ]);

  const processedPosts = posts.map((post) => ({
    ...post,
    views: Number(allViews?.[post.slug] ?? 0),
    // Defer formatting for better performance
  }));

  // Filter drafts if required
  if (filterDrafts) {
    const filteredPosts = processedPosts.filter((post) => !post.draft);
    return filteredPosts;
  }

  return processedPosts;
};
