// app/posts/page.tsx
import { BlogPostType } from '@/__samwise/types/BlogPost';
import { Posts } from '@/modules/blog/templates/ArchiveList';
import { getAllPosts } from '@/__samwise/utils/getAllPosts';
import { ButtonsArrayType } from '@/__samwise/types/Buttons';
import PillarMenu from '@/modules/common/components/PillarMenu';
import { H1 } from '@/app/blog/components/h1';
import InfoWithTooltip from '@/modules/common/components/InfoWithTooltip';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function PostsPage() {
  const posts: BlogPostType[] = await getAllPosts(); // Fetch all posts

  const buttons: ButtonsArrayType = [
    { type: 'edit-blog' },
    { type: 'create-post' },
  ];

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <H1>My Blog [#blog]</H1>
        <InfoWithTooltip message="Each blog post is precisely 500ish words" />
      </div>
      <Posts posts={posts} />
      <PillarMenu buttons={buttons} />
    </>
  );
}
