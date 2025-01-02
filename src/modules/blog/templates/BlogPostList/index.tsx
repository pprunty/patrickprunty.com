'use client';

import React from 'react';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import BlogPost from '@/modules/blog/components/BlogPost';
import ArchiveButton from '@/modules/blog/components/ArchiveButton';
import ShareButton from '@/modules/blog/components/ShareButton';
import { USE_ARCHIVE, AUTHOR } from '@/config';

interface BlogPostListProps {
  postsByYear: Record<string, BlogPostType[]>;
}

const BlogPostList: React.FC<BlogPostListProps> = ({ postsByYear }) => {
  // Sort the "years" in descending order numerically, with "Unknown Year" last
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
        <div key={year} className="mb-6">
          <h1 className="text-2xl mb-0 sm:mb-4 sm:mt-0 mt-4 text-primary dark:text-primary-dark font-semibold">
            {year}
          </h1>

          {/*
            Carousel Container:
            - horizontal scroll
            - snap-mandatory enforces snap
            - scroll-smooth for a smooth scroll effect
            - 'scrollbar-hide' to hide native scrollbar
          */}
          <div
            className="
              relative
              overflow-x-auto
              snap-x snap-mandatory
              scroll-smooth
              w-full
              scrollbar-hide
            "
          >
            <ul className="list-none p-0 flex flex-row gap-4">
              {postsByYear[year].map((post, index) => (
                <li
                  key={post.slug}
                  className="
                    snap-start
                    shrink-0
                    w-[300px]
                    h-[400px]
                    overflow-hidden
                    rounded-md
                  "
                >
                  <BlogPost post={post} index={index} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

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
    </div>
  );
};

export default BlogPostList;
