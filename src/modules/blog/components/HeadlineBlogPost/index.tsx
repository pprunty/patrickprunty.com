import React from 'react';
import Link from 'next/link';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import ZoomImage from '@/modules/common/components/ZoomImage';
import DraftLabel from '@/modules/blog/components/DraftLabel';

interface HeadlineBlogPostProps {
  post: BlogPostType;
  prefetch?: boolean;
}

const HeadlineBlogPost: React.FC<HeadlineBlogPostProps> = ({
  post,
  prefetch = false,
}) => (
  <Link
    href={`/blog/${post.slug}`}
    className="no-underline cursor-pointer"
    prefetch={prefetch}
  >
    <div className="transition-all ease-in-out border-b border-[#4A4A4A] dark:border-[#999999] md:border sm:border-b sm:border-gray-200 dark:sm:border-[#313131] sm:hover:border-gray-500 dark:sm:hover:border-gray-400 active:opacity-80 active:scale-98 py-4 sm:py-4 sm:px-4 relative">
      {' '}
      {post.draft && <DraftLabel />}
      {post.image && (
        <div className="relative w-full h-[200px] mt-2 sm:h-[300px] overflow-hidden mb-4">
          <ZoomImage
            src={post.image}
            alt={post.title || 'Blog post image'}
            loading={'eager'}
            priority
          />
        </div>
      )}
      <div className="flex flex-col justify-between grow">
        <span className="text-2xl font-bold mt-2">{post.title}</span>
        {post.keywords && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {post.keywords.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="text-[11px] lowercase border dark:border-[#999999] font-mono border-gray-400 text-gray-700 dark:text-[#999999] px-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.description && (
          <p className="mt-2 text-gray-700 dark:text-[#999999] text-[16px] line-clamp-4">
            {post.description}
          </p>
        )}
      </div>
    </div>
  </Link>
);

export default HeadlineBlogPost;
