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
    className="block transition-transform duration-200 ease-in-out active:scale-[0.99] active:opacity-80"
  >
    <article className="flex items-start gap-4 pb-4">
      <div className="flex-grow space-y-2 min-w-0">
        {/* Title */}
        <h2 className="text-lg font-medium leading-tight hover:underline">
          <span className="line-clamp-2">{post.title}</span>
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-gray-700 dark:text-[#999999] text-md line-clamp-3">
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
        <div className="flex-shrink-0 w-[120px] h-[120px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title || 'Blog post image'}
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
        </div>
      )}
    </article>
  </Link>
);

export default BlogPost;
