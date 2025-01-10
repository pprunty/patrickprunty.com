// src/components/RelatedPosts/index.tsx

import PostList from '@/modules/blog/components/PostList';
import { Post } from '@/__samwise/utils/getAllPosts';

interface RelatedPostsProps {
  currentPostSlug: string;
  currentPostKeywords: string[];
  posts: Post[];
}

export default function RelatedPosts({
  currentPostSlug,
  currentPostKeywords,
  posts,
}: RelatedPostsProps) {
  // Filter out the current post from the list
  const otherPosts = posts.filter((post) => post.slug !== currentPostSlug);

  // Find related posts based on shared keywords
  const relatedPosts = otherPosts
    .filter((post) =>
      post.keywords.some((keyword) => currentPostKeywords.includes(keyword)),
    )
    .slice(0, 3); // Limit to a maximum of 3 related posts

  // If not enough related posts, fill with random posts
  const remainingPostsNeeded = 4 - relatedPosts.length;
  const remainingPosts = otherPosts.filter(
    (post) =>
      !relatedPosts.some((relatedPost) => relatedPost.slug === post.slug),
  );
  const shuffledRemainingPosts = shuffleArray(remainingPosts);
  const randomPosts = shuffledRemainingPosts.slice(0, remainingPostsNeeded);

  // Combine related posts and random posts to make exactly 4 posts
  const combinedPosts = [...relatedPosts, ...randomPosts];

  if (combinedPosts.length === 0) {
    return null; // Return null if no posts found
  }

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold mb-4">Recommended For You:</h1>
      <PostList posts={combinedPosts} />
    </div>
  );
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
