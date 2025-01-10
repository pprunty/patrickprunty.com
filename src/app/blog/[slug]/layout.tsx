import { getAllPosts } from '@/__samwise/utils/getAllPosts';
import Header from './header';
import RelatedPosts from '@/modules/blog/templates/RelatedPosts';
import { ReactNode } from 'react';
import BottomBar from '@/modules/blog/components/BottomBar';
// import CommentsSection from '@/__samwise/modules/comments/templates/CommentsSection';
import { TableOfContents } from '@/app/blog/components/toc';
import { redirect } from 'next/navigation';
import PillarMenu from '@/modules/common/components/PillarMenu';
import { ButtonsArrayType } from '@/__samwise/types/Buttons';
import Newsletter from '@/modules/blog/components/Newsletter'; // Adjust the import path based on your project structure

type Params = Promise<{ slug: string }>;

interface LayoutProps {
  children: ReactNode;
  params: Params; // Define params as a promise
}

export default async function BlogLayout({ children, params }: LayoutProps) {
  const { slug } = await params; // Await params before accessing slug
  const posts = await getAllPosts(process.env.NODE_ENV === 'production');
  const buttons: ButtonsArrayType = [
    { type: 'toggle-edit-mode' }, // Added toggle-edit-mode button
    { type: 'edit-post' },
    { type: 'delete-post' },
  ];

  // Use the first element of slug array, assuming it's the main slug
  const currentPost = posts.find((post) => post.slug === slug);

  if (!currentPost) {
    // Post not found, redirect to home page
    redirect('/');
  }

  // If current post is not found, handle the case (e.g., return 404 page)
  if (!currentPost) {
    return (
      <div>
        <Header currentPost={null} />
        {children}
        <BottomBar />
      </div>
    );
  }

  return (
    <div>
      <Header currentPost={currentPost} />
      <TableOfContents />
      {children}
      <BottomBar />
      {/*      <Newsletter />
       */}{' '}
      {/* to be added in next version <CommentsSection/> */}
      <RelatedPosts
        currentPostSlug={slug}
        currentPostKeywords={currentPost.keywords}
        posts={posts}
      />
      <PillarMenu buttons={buttons} slug={slug} currentPost={currentPost} />
    </div>
  );
}
