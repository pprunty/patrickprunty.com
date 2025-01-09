import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPostType } from '@/__samwise/types/BlogPost';

interface BlogPostProps {
  post: BlogPostType;
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
             border-b border-[#bdbdbd] dark:border-[#555]
             sm:border sm:border-gray-200 sm:dark:border-[#555]
             sm:rounded-none
             sm:hover:border-gray-600 sm:dark:hover:border-[#757575]
             sm:transition-colors sm:duration-300"
    >
      <div className="flex-grow space-y-2 min-w-0">
        {/* Title */}
        <h2 className="line-clamp-2 text-xl sm:text-xl font-semibold leading-tight">
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p
            className="text-gray-700 dark:text-[#999999] text-[17px]
                       line-clamp-3  /* Default for mobile */
                       sm:line-clamp-2 /* Clamp to 2 lines on desktop */
          "
          >
            {post.description}
          </p>
        )}

        {/* Read More Link */}
        <span className="inline-flex items-center text-sm text-primary hover:text-primary-foreground transition-colors duration-300 group">
          Read More
          <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
          <span className="sr-only">Read more about {post.title}</span>
        </span>
      </div>

      {/* Image Section */}
      {post.image && (
        <div className="flex-shrink-0 w-[110px] h-[110px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title || 'Blog post image'}
            width={110}
            height={110}
            className="object-cover"
          />
        </div>
      )}
    </article>
  </Link>
);

export default BlogPost;
