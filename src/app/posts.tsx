'use client';

import { useMemo, useState } from 'react';
import { Suspense } from 'react';
import useSWR from 'swr';
import PostList from '@/modules/blog/components/PostList';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Type for sorting settings
type SortSetting = ['date' | 'views' | 'title', 'desc' | 'asc'];

// Props for the Posts component
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

  // Sorting functions
  const sortDate = () => setSort(toggleSort(sort, 'date'));
  const sortViews = () => setSort(toggleSort(sort, 'views'));
  const sortTitle = () => setSort(toggleSort(sort, 'title'));

  const sortedPosts = useMemo(() => {
    return sortPosts(posts || [], sort);
  }, [posts, sort]);

  return (
    <Suspense fallback={null}>
      <main className="max-w-2xl m-auto text-sm">
        <header className="text-gray-700 dark:text-gray-300 flex items-center text-xs border-b-2 border-[#bdbdbd] dark:border-[#555]">
          <SortButton label="date" sortKey="date" sort={sort} onClick={sortDate} />
          <SortButton label="title" sortKey="title" sort={sort} onClick={sortTitle} />
          <SortButton label="views" sortKey="views" sort={sort} onClick={sortViews} />
        </header>

        <PostList posts={sortedPosts} />
      </main>
    </Suspense>
  );
}

// Utility function to toggle sort
function toggleSort(currentSort: SortSetting, key: string): SortSetting {
  return [
    key,
    currentSort[0] !== key || currentSort[1] === 'asc' ? 'desc' : 'asc',
  ];
}

// Function to sort posts
function sortPosts(posts: Post[], sort: SortSetting) {
  const [sortKey, sortDirection] = sort;
  return [...posts].sort((a, b) => {
    if (sortKey === 'date') {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    }
    if (sortKey === 'views') {
      const viewsA = a.views ?? 0;
      const viewsB = b.views ?? 0;
      return sortDirection === 'desc' ? viewsB - viewsA : viewsA - viewsB;
    }
    if (sortKey === 'title') {
      const titleA = a.title?.toLowerCase() || '';
      const titleB = b.title?.toLowerCase() || '';
      if (titleA < titleB) return sortDirection === 'desc' ? 1 : -1;
      if (titleA > titleB) return sortDirection === 'desc' ? -1 : 1;
      return 0;
    }
    return 0;
  });
}

// Component for rendering a sort button
interface SortButtonProps {
  label: string;
  sortKey: 'date' | 'views' | 'title';
  sort: SortSetting;
  onClick: () => void;
}

function SortButton({ label, sortKey, sort, onClick }: SortButtonProps) {
  const [currentSortKey, currentSortDirection] = sort;

  return (
    <button
      onClick={onClick}
      className={`h-9 pl-4 flex items-center flex-grow text-left ${
        currentSortKey === sortKey
          ? 'text-black dark:text-white' // Active colors
          : 'text-[#555] dark:text-[#999]'
      }`}
    >
      {label}
      <span className="ml-1">
        {currentSortKey === sortKey ? (
          currentSortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}
