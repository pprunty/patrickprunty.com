import React from 'react';
import { Post } from '@/__samwise/utils/getAllPosts';
import BlogPost from '@/modules/blog/components/BlogPost';
import ArchiveButton from '@/modules/blog/components/ArchiveButton';
import { USE_ARCHIVE } from '@/config';
import ShareButton from '@/modules/blog/components/ShareButton';
import { AUTHOR } from '@/config';

interface BlogPostListProps {
  posts: Post[];
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts }) => {
  // Group posts by year
  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = post.date
        ? new Date(post.date).getFullYear().toString()
        : 'Unknown Year';
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  // Sort years
  const sortedYears = Object.keys(postsByYear).sort((a, b) =>
    a === 'Unknown Year'
      ? 1
      : b === 'Unknown Year'
        ? -1
        : parseInt(b) - parseInt(a),
  );

  return (
    <div className="mb-2 text-sm">
      {sortedYears.map((year) => (
        <div key={year} className="mb-2">
          <h1 className="text-2xl mb-0 sm:mb-4 sm:mt-0 mt-4 text-primary dark:text-primary-dark font-semibold">
            {year}
          </h1>
          <ul className="list-none p-0 space-y-6">
            {postsByYear[year].map((post, index) => (
              <li key={post.slug} className="mb-0 sm:mb-4">
                <BlogPost post={post} index={index} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      {
        <div className="flex justify-between items-center mt-8">
          {USE_ARCHIVE && (
            <ArchiveButton
              label={'VIEW ARCHIVE'}
              position="center"
              route={'/blog/archive'}
            />
          )}
          <ShareButton message={`Check out ${AUTHOR.name}'s Blog: `} />
        </div>
      }
    </div>
  );
};

export default BlogPostList;
