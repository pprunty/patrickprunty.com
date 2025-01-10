import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/__samwise/utils/getAllPosts';

interface BlogPostProps {
  post: Post;
  index: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, index }) => (
  <Link
    href={`/blog/${post.slug}`}
    prefetch
    className="block transition-transform duration-200 ease-in-out active:scale-[0.995] active:opacity-80"
  >
    <article
      className="flex sm:p-4 gap-4 items-start pb-4

             sm:border sm:border-gray-200 sm:dark:border-[#555]
             rounded-0 sm:rounded-sm
             sm:hover:border-gray-600 sm:dark:hover:border-[#dbdbdb]
             sm:transition-colors sm:duration-300"
    >
      <div className="flex-grow space-y-2 min-w-0">
        {/* Title */}
        <h2 className="line-clamp-2 text-xl font-semibold leading-tight">
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p
            className="text-gray-700 dark:text-[#999999] text-[17px]
                       line-clamp-3  /* Default for mobile */
                       sm:line-clamp-4 /* Clamp to 2 lines on desktop */
          "
          >
            {post.description}
          </p>
        )}
      </div>

      {/* Image Section */}
      {post.image && (
        <div className="flex-shrink-0 w-[110px] h-[110px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title || 'Blog post image'}
            width={110}
            height={110}
            className="object-cover rounded-sm"
          />
        </div>
      )}
    </article>
  </Link>
);

export default BlogPost;
