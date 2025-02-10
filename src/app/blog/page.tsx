import type { Post } from '../get-posts';
import { Posts } from '../posts';
import { getAllPosts } from '../get-posts';
import type { ButtonsArrayType } from '@/__samwise/types/Buttons';
import PillarMenu from '@/modules/common/components/PillarMenu';

export const dynamic = 'force-static';
export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function PostsPage() {
  const posts: Post[] = await getAllPosts(
    process.env.NODE_ENV === 'production',
  );

  const buttons: ButtonsArrayType = [
    { type: 'edit-blog' },
    { type: 'create-post' },
  ];

  return (
    <>
{/* If you're not sure which to read, try How to Do Great Work, Having Kids, or How to Lose Time and Money.
*/
}
      <Posts posts={posts} />
      {process.env.NODE_ENV === 'development' && (
        <PillarMenu buttons={buttons} />
      )}
    </>
  );
}
