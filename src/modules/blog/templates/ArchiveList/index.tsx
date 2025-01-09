'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import NavigationButton from '@/modules/blog/components/NavigationButton';
import { MoveUp, MoveDown, MoveVertical } from 'lucide-react';
import ShareButton from '@/modules/blog/components/ShareButton';
import { AUTHOR } from '@/config';

type SortSetting = ['date' | 'views', 'desc' | 'asc'];

interface PostsProps {
  posts: BlogPostType[];
}

export function Posts({ posts }: PostsProps) {
  const [sort, setSort] = useState<SortSetting>(['date', 'desc']);

  function sortDate() {
    setSort((prevSort) => [
      'date',
      prevSort[0] !== 'date' || prevSort[1] === 'asc' ? 'desc' : 'asc',
    ]);
  }

  function sortViews() {
    setSort((prevSort) => [
      'views',
      prevSort[0] !== 'views' || prevSort[1] === 'asc' ? 'desc' : 'asc',
    ]);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="max-w-2xl font-mono m-auto text-sm">
        <header className="text-gray-500 dark:text-[#999999] flex items-center text-xs">
          <button
            onClick={sortDate}
            className={`w-12 h-9 text-left flex items-center ${
              sort[0] === 'date'
                ? 'text-gray-700 dark:text-gray-400'
                : 'text-gray-500 dark:text-[#999999]'
            }`}
          >
            date
            <span className="ml-1">
              {sort[0] === 'date' ? (
                sort[1] === 'asc' ? (
                  <MoveUp className="text-black dark:text-white w-4 h-4" />
                ) : (
                  <MoveDown className="text-black dark:text-white w-4 h-4" />
                )
              ) : (
                <MoveVertical className="text-gray-500 dark:text-[#999999] w-4 h-4" />
              )}
            </span>
          </button>
          <span className="grow pl-2">title</span>
          <button
            onClick={sortViews}
            className={`h-9 pl-4 flex items-center ${
              sort[0] === 'views'
                ? 'text-gray-700 dark:text-gray-400'
                : 'text-gray-500 dark:text-[#999999]'
            }`}
          >
            views
            <span className="ml-1">
              {sort[0] === 'views' ? (
                sort[1] === 'asc' ? (
                  <MoveUp className="text-black dark:text-white w-4 h-4" />
                ) : (
                  <MoveDown className="text-black dark:text-white w-4 h-4" />
                )
              ) : (
                <MoveVertical className="text-gray-500 dark:text-[#999999] w-4 h-4" />
              )}
            </span>
          </button>
        </header>

        <List posts={posts} sort={sort} />
      </main>
    </Suspense>
  );
}

interface ListProps {
  posts: BlogPostType[];
  sort: SortSetting;
}

function List({ posts, sort }: ListProps) {
  const sortedPosts = useMemo(() => {
    const [sortKey, sortDirection] = sort;
    return [...posts].sort((a, b) => {
      if (sortKey === 'date') {
        return sortDirection === 'desc'
          ? new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
          : new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
      } else if (sortKey === 'views') {
        return sortDirection === 'desc'
          ? (b.views || 0) - (a.views || 0)
          : (a.views || 0) - (b.views || 0);
      }
      return 0;
    });
  }, [posts, sort]);

  return (
    <ul>
      {sortedPosts.map((post, i) => {
        const year = getYear(post.date);
        const firstOfYear =
          !sortedPosts[i - 1] || getYear(sortedPosts[i - 1].date) !== year;
        const lastOfYear =
          !sortedPosts[i + 1] || getYear(sortedPosts[i + 1].date) !== year;

        return (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} prefetch>
              <span
                className={`flex transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
                          ${!firstOfYear ? 'border-t-0' : ''}
                          ${lastOfYear ? 'border-b-0' : ''}
                        `}
              >
                <span
                  className={`py-3 flex grow items-start ${
                    !firstOfYear ? 'ml-14' : ''
                  }`}
                >
                  {firstOfYear && (
                    <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-[#999999]">
                      {year}
                    </span>
                  )}
                  <div className="flex flex-nowrap grow">
                    <span className="dark:text-gray-100 break-words flex-grow min-w-0">
                      {post.title}
                    </span>
                    <span className="text-gray-500 dark:text-[#999999] text-xs flex-shrink-0 whitespace-nowrap ml-2">
                      {(post.views ?? 0).toLocaleString()} views
                    </span>
                  </div>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function getYear(date?: string | null) {
  return date ? new Date(date).getFullYear() : 'Unknown';
}
