import React from 'react';
import Link from 'next/link';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import OptimizedImage from '@/modules/common/components/OptimizedImage';
import DraftLabel from '@/modules/blog/components/DraftLabel';

interface BlogPostProps {
  post: BlogPostType;
  index: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, index }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="no-underline cursor-pointer"
    prefetch={index < 6}
  >
    <div className="flex bg-white dark:bg-[#0F0F0F] items-center transition-all ease-in-out md:border border-b border-[#4A4A4A] dark:border-[#999999] sm:border-1 sm:border-gray-200 dark:sm:border-[#313131] sm:hover:border-gray-500 dark:sm:hover:border-gray-400 active:opacity-80 active:scale-98 py-4 sm:py-4 sm:px-4 relative">
      {post.draft && <DraftLabel />}
      {post.image && (
        <div className="relative w-[113px] h-[113px] xs:w-[80px] xs:h-[80px] sm:w-[125px] sm:h-[125px] overflow-hidden mr-4 flex-shrink-0">
          <OptimizedImage
            src={post.image}
            alt={post.title || 'Blog post image'}
            sizes="(max-width: 640px) 80px, (min-width: 640px) 113px, (min-width: 768px) 125px"
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      )}
      <div className="flex flex-col justify-between grow">
        <span className="text-xl font-semibold">{post.title}</span>
        {post.keywords && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {post.keywords.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="text-[11px] lowercase border font-mono border-gray-400 dark:border-[#999999] text-gray-700 dark:text-[#999999] px-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </Link>
);

export default BlogPost;
