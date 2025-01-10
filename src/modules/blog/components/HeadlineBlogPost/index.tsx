import React from 'react';
import Link from 'next/link';
import { Post } from '@/__samwise/utils/getAllPosts';
import ZoomImage from '@/modules/common/components/ZoomImage';
import DraftLabel from '@/modules/blog/components/DraftLabel';

interface HeadlineBlogPostProps {
  post: Post;
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
    <div className="transition-all bg-white dark:bg-[#0F0F0F] mt-2 rounded-md ease-in-out border border-gray-200 dark:border-[#313131] active:scale-98 overflow-hidden">
      {post.image && (
        <div className="relative w-full h-auto md:h-[300px] overflow-hidden">
          <ZoomImage
            src={post.image}
            alt={post.title || 'Blog post image'}
            loading="eager"
            priority
            className="block w-full h-auto md:h-[300px] object-cover"
          />
        </div>
      )}
      <div className="px-4 pb-4 md:pt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {post.title}
        </h2>
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
