'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import useSWR from 'swr';
import { Post } from '../../../../app/get-posts';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortSetting = ['date' | 'views' | 'title', 'desc' | 'asc'];

interface PostsProps {
  posts: Post[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Posts({ posts: initialPosts }: PostsProps) {
  const [sort, setSort] = useState<SortSetting>(['date', 'desc']);

  // Use SWR to fetch posts with fallback data as initialPosts
  const { data: posts } = useSWR('/api/posts', fetcher, {
    fallbackData: initialPosts,
    refreshInterval: 5000,
  });

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

  function sortTitle() {
    setSort((prevSort) => [
      'title',
      prevSort[0] !== 'title' || prevSort[1] === 'asc' ? 'desc' : 'asc',
    ]);
  }

  return (
    <Suspense fallback={null}>
      <main className="max-w-2xl font-mono m-auto text-sm">
        <header className="text-gray-700 dark:text-gray-300 flex items-center text-xs">
          {/* Date Sort Button */}
          <button
            onClick={sortDate}
            className={`w-12 h-9 text-left flex items-center ${
              sort[0] === 'date'
                ? 'text-black dark:text-white' // Active colors
                : 'text-[#555] dark:text-[#999]'
            }`}
          >
            date
            <span className="ml-1">
              <SortIcon sortKey="date" currentSort={sort} />
            </span>
          </button>

          {/* Title Sort Button */}
          <button
            onClick={sortTitle}
            className={`h-9 pl-4 flex items-center flex-grow ${
              sort[0] === 'title'
                ? 'text-black dark:text-white' // Active colors
                : 'text-[#555] dark:text-[#999]'
            }`}
          >
            title
            <span className="ml-1">
              <SortIcon sortKey="title" currentSort={sort} />
            </span>
          </button>

          {/* Views Sort Button */}
          <button
            onClick={sortViews}
            className={`h-9 pl-4 flex items-center ${
              sort[0] === 'views'
                ? 'text-black dark:text-white' // Active colors
                : 'text-[#555] dark:text-[#999]'
            }`}
          >
            views
            <span className="ml-1">
              <SortIcon sortKey="views" currentSort={sort} />
            </span>
          </button>
        </header>

        {/* Pass the posts and sorting state to List */}
        <List posts={posts} sort={sort} />
      </main>
    </Suspense>
  );
}

interface SortIconProps {
  sortKey: 'date' | 'views' | 'title';
  currentSort: SortSetting;
}

function SortIcon({ sortKey, currentSort }: SortIconProps) {
  const [currentSortKey, currentSortDirection] = currentSort;

  if (sortKey !== currentSortKey) {
    return <ArrowUpDown className="h-4 w-4" />;
  }

  return currentSortDirection === 'asc' ? (
    <ArrowUp className="h-4 w-4" />
  ) : (
    <ArrowDown className="h-4 w-4" />
  );
}

interface ListProps {
  posts: Post[];
  sort: SortSetting;
}

function List({ posts, sort }: ListProps) {
  const sortedPosts = useMemo(() => {
    const [sortKey, sortDirection] = sort;
    return [...posts].sort((a, b) => {
      if (sortKey === 'date') {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortKey === 'views') {
        const viewsA = a.views ?? 0;
        const viewsB = b.views ?? 0;
        return sortDirection === 'desc' ? viewsB - viewsA : viewsA - viewsB;
      } else if (sortKey === 'title') {
        const titleA = a.title?.toLowerCase() || '';
        const titleB = b.title?.toLowerCase() || '';
        if (titleA < titleB) return sortDirection === 'desc' ? 1 : -1;
        if (titleA > titleB) return sortDirection === 'desc' ? -1 : 1;
        return 0;
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
            <Link href={`/blog/${post.slug}`}>
              <span
                className={`flex transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y dark:border-[#313131]
                          ${!firstOfYear ? 'border-t-0' : ''}
                          ${lastOfYear ? 'border-b-0' : ''}
                          ${i === 0 ? 'border-t border-t-[#d4d4d4] dark:border-t-[#555]' : ''}
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
                    <span className="text-gray-500 dark:text-[#999999] text-right text-xs flex-shrink-0 whitespace-nowrap min-w-[48px]">
                      {(post.views ?? 0).toLocaleString()}
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
