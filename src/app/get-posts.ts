// getAllPosts.ts
import postsData from '@/app/posts.json';
import redis from '@/app/redis';
import commaNumber from 'comma-number';

/**
 * 1) Matches exactly what appears in your `posts.json`
 *    i.e., no `views` or `viewsFormatted`.
 */
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

/**
 * 2) Extends the base type with dynamic fields
 *    that do NOT exist in the raw JSON, but
 *    get appended at runtime.
 */
export type Post = BasePost & {
  views: number;
  viewsFormatted: string;
};

/**
 * 3) Describe the overall JSON shape:
 *    your `posts.json` presumably looks like:
 *
 *    {
 *      "posts": [
 *        { "slug": "...", "date": "...", "title": "...", ... },
 *        ...
 *      ]
 *    }
 */
type PostsData = {
  posts: BasePost[];
};

// 4) Cast the imported JSON to `PostsData`
const typedPostsData = postsData as PostsData;

/**
 * 5) We'll store an array of `BasePost` for non-draft posts.
 *    (No `views` or `viewsFormatted` here)
 */
let cachedNonDraftPosts: BasePost[] | null = null;

/**
 * Fetch all posts, optionally filtering out drafts.
 *
 * @param filterDrafts - if `true`, returns only published (non-draft) posts.
 * @returns Post[] - list of posts with dynamic `views` added.
 */
export const getAllPosts = async (
  filterDrafts: boolean = false,
): Promise<Post[]> => {
  // Cache non-draft posts if we haven't yet
  if (!cachedNonDraftPosts) {
    cachedNonDraftPosts = typedPostsData.posts.filter((post) => !post.draft);
  }

  // Grab all views in one Redis call (keyed by slug)
  const allViews: Record<string, string> | null = await redis.hgetall('views');

  // 6) Attach `views`/`viewsFormatted` on the fly
  const postsWithViews: Post[] = cachedNonDraftPosts.map((post) => {
    const views = Number(allViews?.[post.slug] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  // If user wants ONLY non-draft (published) posts, we’re done
  if (filterDrafts) {
    return postsWithViews;
  }

  // Otherwise, also include draft posts.
  // Draft posts are also "BasePost" in JSON, so add dynamic fields:
  const draftPosts: Post[] = typedPostsData.posts
    .filter((post) => post.draft)
    .map((post) => {
      const views = Number(allViews?.[post.slug] ?? 0);
      return {
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      };
    });

  // Combine published + draft
  return [...postsWithViews, ...draftPosts];
};
