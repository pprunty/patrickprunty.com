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
  console.time('getAllPosts Execution');

  // Fetch views and posts in parallel
  const [allViews, posts] = await Promise.all([
    redis.hgetall('views'),
    Promise.resolve(postsData.posts),
  ]);

  console.time('Map Posts with Views');
  const processedPosts = posts.map((post) => ({
    ...post,
    views: Number(allViews?.[post.slug] ?? 0),
    // Defer formatting for better performance
  }));
  console.timeEnd('Map Posts with Views');

  // Filter drafts if required
  if (filterDrafts) {
    console.time('Filter Draft Posts');
    const filteredPosts = processedPosts.filter((post) => !post.draft);
    console.timeEnd('Filter Draft Posts');
    console.timeEnd('getAllPosts Execution');
    return filteredPosts;
  }

  console.timeEnd('getAllPosts Execution');
  return processedPosts;
};
