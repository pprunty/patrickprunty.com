// app/posts/page.tsx
import { Post } from '../get-posts';
import { Posts } from '../posts';
import { getAllPosts } from '../get-posts';
import PillarMenu from '@/modules/common/components/PillarMenu';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function PostsPage() {
  const posts: Post[] = await getAllPosts(
    process.env.NODE_ENV === 'production',
  );

  const buttons: ButtonsArrayType = [
    { type: 'edit-blog' },
    { type: 'create-post' },
  ];

  const iconProps = {
    width: 20,
    height: 20,
    fill: 'currentColor',
    className: `text-[#1C1C1C] dark:text-[#fcfcfc]`,
    role: 'link',
  };

  return (
    <>
      <Posts posts={posts} />
      {process.env.NODE_ENV === 'development' && (
        <PillarMenu buttons={buttons} />
      )}
    </>
  );
}
