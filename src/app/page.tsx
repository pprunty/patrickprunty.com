// app/posts/page.tsx
import { Post } from './get-posts';
import { Posts } from './posts';
import { getAllPosts } from './get-posts';
import { ButtonsArrayType } from '@/__samwise/types/Buttons';
import PillarMenu from '@/modules/common/components/PillarMenu';
import { H1 } from '@/app/blog/components/h1';
import InfoWithTooltip from '@/modules/common/components/InfoWithTooltip';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function PostsPage() {
  // Start timing
  console.time('getAllPosts');

  const posts: Post[] = await getAllPosts(
    process.env.NODE_ENV === 'production',
  );

  // End timing
  console.timeEnd('getAllPosts');

  const buttons: ButtonsArrayType = [
    { type: 'edit-blog' },
    { type: 'create-post' },
  ];

  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <H1>500ish Blog [#blog]</H1>
        <InfoWithTooltip message="All blog posts are written in 500 words or less" />
      </div>
      <Posts posts={posts} />
      {process.env.NODE_ENV === 'development' && (
        <PillarMenu buttons={buttons} />
      )}
    </>
  );
}
