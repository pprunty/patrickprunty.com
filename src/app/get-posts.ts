import postsData from '@/app/posts.json';
import redis from '@/app/redis';
import commaNumber from 'comma-number';

type BasePost = {
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
};

export type Post = BasePost & {
  views: number;
  viewsFormatted: string;
};

type PostsData = {
  posts: BasePost[];
};

const typedPostsData = postsData as PostsData;

let cachedNonDraftPosts: BasePost[] | null = null;

export const getAllPosts = async (
  filterDrafts: boolean = false,
): Promise<Post[]> => {
  if (!cachedNonDraftPosts) {
    cachedNonDraftPosts = typedPostsData.posts.filter((post) => !post.draft);
  }

  // Determine if the environment is production
  const isProduction =
    process.env.VERCEL_PROJECT_PRODUCTION_URL === 'patrickprunty.com';

  // Fetch all views from Redis if in production, otherwise set to zero
  const allViews: Record<string, string> | null = isProduction
    ? await redis.hgetall('views')
    : null;

  const postsWithViews: Post[] = cachedNonDraftPosts.map((post) => {
    const views = isProduction ? Number(allViews?.[post.slug] ?? 0) : 0;
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  if (filterDrafts) {
    return postsWithViews;
  }

  const draftPosts: Post[] = typedPostsData.posts
    .filter((post) => post.draft)
    .map((post) => {
      const views = isProduction ? Number(allViews?.[post.slug] ?? 0) : 0;
      return {
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      };
    });

  return [...postsWithViews, ...draftPosts];
};
