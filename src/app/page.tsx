// src/app/page.tsx

import { BlogPostType } from '@/__samwise/types/BlogPost';
import BlogPostList from '@/modules/blog/templates/BlogPostList';
import { getAllPosts } from '@/__samwise/utils/getAllPosts';
import PillarMenu from '@/modules/common/components/PillarMenu';
import { ButtonsArrayType } from '@/__samwise/types/Buttons';

export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function PostsPage() {
  const posts = await getAllPosts();
  const buttons: ButtonsArrayType = [
    { type: 'edit-blog' },
    { type: 'create-post' },
  ];

  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = post.date
        ? new Date(post.date).getFullYear().toString()
        : 'Unknown Year';
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, BlogPostType[]>,
  );

  return (
    <>
      <BlogPostList postsByYear={postsByYear} />
      <PillarMenu buttons={buttons} />
    </>
  );
}
