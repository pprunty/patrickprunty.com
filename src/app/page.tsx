import { BlogPostType } from '@/__samwise/types/BlogPost';
import BlogPostList from '@/modules/blog/templates/BlogPostList';
import { getAllPosts } from '@/__samwise/utils/getAllPosts';
import PillarMenu from '@/modules/common/components/PillarMenu';
import { ButtonsArrayType } from '@/__samwise/types/Buttons';
import { Posts } from '@/modules/blog/templates/ArchiveList';
import { H1 } from '@/app/blog/components/h1';
import InfoWithTooltip from '@/modules/common/components/InfoWithTooltip';

export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function PostsPage() {
  const posts = await getAllPosts(true, 0); // Pass 0 to fetch all posts
  const buttons: ButtonsArrayType = [
    { type: 'edit-blog' },
    { type: 'create-post' },
  ];

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <H1>My Blog [#blog]</H1>
        {/* Info Icon with Tooltip */}
        <InfoWithTooltip message="Each blog post is precisely 500ish words" />
      </div>
      <Posts posts={posts} />
      <PillarMenu buttons={buttons} />
    </>
  );
}
