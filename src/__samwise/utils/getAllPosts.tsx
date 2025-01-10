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

// Function to fetch posts
export const getAllPosts = async (): Promise<Post[]> => {
  // Fetch all views from Redis
  const allViews: Record<string, string> | null = await redis.hgetall('views');

  // Map posts with views
  const posts: Post[] = postsData.posts.map((post): Post => {
    const views = Number(allViews?.[post.slug] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  // If running in production, filter out drafts
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? posts.filter((post) => !post.draft) : posts;
};
