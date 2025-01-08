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
    <div className="flex flex-row items-start justify-between transition-all ease-in-out border-b border-[#c4c4c4] dark:border-[#555] py-4 sm:py-4 relative">
      {post.draft && <DraftLabel />}

      {/* Content Section */}
      <div className="flex flex-col justify-start grow">
        {/* Tags */}
        {/*        <div className="mb-2 font-mono text-xs text-gray-700 dark:text-[#999999]">
        • Software Development
        </div>*/}
        {/* Title */}
        <span className="text-xl sm:text-2xl font-semibold">{post.title}</span>
        {/* Description */}
        {post.description && (
          <p className="mt-2 text-[17px] text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>

      {/* Image Section */}
      {post.image && (
        <div className="relative w-[113px] h-[113px] xs:w-[80px] xs:h-[80px] sm:w-[125px] sm:h-[125px] overflow-hidden flex-shrink-0 ml-4">
          <OptimizedImage
            src={post.image}
            alt={post.title || 'Blog post image'}
            sizes="(max-width: 640px) 80px, (min-width: 640px) 113px, (min-width: 768px) 125px"
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      )}
    </div>
  </Link>
);

export default BlogPost;
