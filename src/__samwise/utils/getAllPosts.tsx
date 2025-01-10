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

// Cache for non-draft posts
let cachedNonDraftPosts: Omit<Post, 'views' | 'viewsFormatted'>[] | null = null;

export const getAllPosts = async (
  filterDrafts: boolean = false,
): Promise<Post[]> => {
  // Cache non-draft posts if not already cached
  if (!cachedNonDraftPosts) {
    cachedNonDraftPosts = postsData.posts
      .filter((post) => !post.draft)
      .map(({ views, viewsFormatted, ...rest }) => rest); // Exclude dynamic fields
  }

  // Fetch all views in one Redis call
  const allViews: Record<string, string> | null = await redis.hgetall('views');

  // Attach views dynamically
  const postsWithViews = cachedNonDraftPosts.map((post) => {
    const views = Number(allViews?.[post.slug] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  // Apply draft filtering if required
  if (filterDrafts) {
    return postsWithViews;
  }

  // Include drafts dynamically if `filterDrafts` is false
  const draftPosts = postsData.posts
    .filter((post) => post.draft)
    .map((post) => {
      const views = Number(allViews?.[post.slug] ?? 0);
      return {
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      };
    });

  return [...postsWithViews, ...draftPosts];
};
