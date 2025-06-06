'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import useSWR from 'swr';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';

// --- Types

type SortSetting = ['date' | 'views' | 'title', 'desc' | 'asc'];
type PostType = 'essay' | 'newsletter' | 'all';

interface Post {
  slug: string;
  title: string;
  date?: string | null;
  views?: number;
  description?: string;
  image?: string;
  type?: 'essay' | 'newsletter';
}

interface PostsProps {
  posts: Post[];
  showTabs?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- Main Posts Component

export function Posts({ posts: initialPosts, showTabs = false }: PostsProps) {
  const [sort, setSort] = useState<SortSetting>(['date', 'desc']);
  // Initialize tab from localStorage if available, otherwise default to 'all'
  const [activeTab, setActiveTab] = useState<PostType>(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activePostTab');
      return (savedTab as PostType) || 'all';
    }
    return 'all';
  });

  // Track whether user has explicitly selected a sort option
  const [userSelectedSort, setUserSelectedSort] = useState(false);

  // Update localStorage when tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activePostTab', activeTab);
    }
  }, [activeTab]);

  // Use SWR to fetch posts with fallback data
  const { data: posts } = useSWR('/api/posts', fetcher, {
    fallbackData: initialPosts,
    refreshInterval: 5000,
  });

  // State for the hovered post and the mouse position
  const [hoveredPost, setHoveredPost] = useState<Post | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') return posts;
    return posts.filter((post: Post) => post.type === activeTab);
  }, [posts, activeTab]);

  // --- Sorting functions

  function sortDate() {
    setSort((prevSort) => [
      'date',
      prevSort[0] !== 'date' || prevSort[1] === 'asc' ? 'desc' : 'asc',
    ]);
    setUserSelectedSort(true);
  }

  function sortViews() {
    setSort((prevSort) => [
      'views',
      prevSort[0] !== 'views' || prevSort[1] === 'asc' ? 'desc' : 'asc',
    ]);
    setUserSelectedSort(true);
  }

  function sortTitle() {
    setSort((prevSort) => [
      'title',
      prevSort[0] !== 'title' || prevSort[1] === 'asc' ? 'desc' : 'asc',
    ]);
    setUserSelectedSort(true);
  }

  return (
    <>
      <Suspense fallback={null}>
        <main className="max-w-2xl font-mono m-auto text-sm relative">
          {/* Tabs for filtering post types */}
          {showTabs && (
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as PostType)}
              className="mb-6 w-full"
            >
              <TabsList size="sm" className="">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="essay">Essays</TabsTrigger>
                <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <header className="text-muted-foreground flex items-center text-[13px]">
            {/* Date Sort Button */}
            <button
              onClick={sortDate}
              className={`w-12 h-9 text-left flex items-center ${
                userSelectedSort && sort[0] === 'date'
                  ? 'text-black dark:text-white'
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
                userSelectedSort && sort[0] === 'title'
                  ? 'text-black dark:text-white'
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
                userSelectedSort && sort[0] === 'views'
                  ? 'text-black dark:text-white'
                  : 'text-[#555] dark:text-[#999]'
              }`}
            >
              views
              <span className="ml-1">
                <SortIcon sortKey="views" currentSort={sort} />
              </span>
            </button>
          </header>

          {/* Pass callbacks to List so each item can report hover and mouse position */}
          <List
            posts={filteredPosts}
            sort={sort}
            onPostHover={(post) => setHoveredPost(post)}
            onPostLeave={() => setHoveredPost(null)}
            onPostMouseMove={(pos) => setMousePos(pos)}
          />
        </main>
      </Suspense>
      {/* Render the hover preview modal */}
      <HoverPreviewModal hoveredPost={hoveredPost} mousePos={mousePos} />
    </>
  );
}

// --- Sort Icon Component

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

// --- List Component

interface ListProps {
  posts: Post[];
  sort: SortSetting;
  onPostHover: (post: Post) => void;
  onPostLeave: () => void;
  onPostMouseMove: (pos: { x: number; y: number }) => void;
}

function List({
  posts,
  sort,
  onPostHover,
  onPostLeave,
  onPostMouseMove,
}: ListProps) {
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
          <li
            key={post.slug}
            onMouseEnter={() => onPostHover(post)}
            onMouseMove={(e) => onPostMouseMove({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => onPostLeave()}
          >
            <Link href={`/blog/${post.slug}/`} prefetch>
              <span
                className={`flex transition-[background-color] hover:bg-muted dark:hover:bg-muted active:bg-[#e0e0e0] dark:active:bg-[#3a3a3a] border-y dark:border-[#313131]
                          ${!firstOfYear ? 'border-t-0' : ''}
                          ${lastOfYear ? 'border-b-0' : ''}`}
              >
                <span
                  className={`py-3 flex grow items-start ${
                    !firstOfYear ? 'ml-14' : ''
                  }`}
                >
                  {firstOfYear && (
                    <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-[#999999]">
                      {year.toString()}
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

interface HoverPreviewModalProps {
  hoveredPost: Post | null;
  mousePos: { x: number; y: number };
}

// --- HoverImage Component

interface HoverImageProps {
  src: string;
  alt: string;
}

export function HoverImage({ src, alt }: HoverImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-40">
      {/* Pulse overlay until image is loaded */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}

// --- HoverPreviewModal Component

export function HoverPreviewModal({
  hoveredPost,
  mousePos,
}: HoverPreviewModalProps) {
  // Animate modal position to follow the mouse with a slight delay.
  const [modalPos, setModalPos] = useState({ x: mousePos.x, y: mousePos.y });
  useEffect(() => {
    let animationFrameId: number;
    const updatePosition = () => {
      setModalPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.1,
        y: prev.y + (mousePos.y - prev.y) * 0.1,
      }));
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Manage fade-in / fade-out transitions.
  const [activePost, setActivePost] = useState<Post | null>(hoveredPost);
  const [visible, setVisible] = useState(!!hoveredPost);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hoveredPost) {
      setActivePost(hoveredPost);
      setVisible(true);
    } else {
      setVisible(false);
      timer = setTimeout(() => {
        setActivePost(null);
      }, 150); // Fade-out duration in ms
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hoveredPost]);

  // Cache modal content for posts that have already been hovered over.
  const contentCache = useRef<Map<string, React.ReactElement>>(new Map());
  let modalContent: React.ReactElement | null = null;
  if (activePost) {
    if (contentCache.current.has(activePost.slug)) {
      modalContent = contentCache.current.get(activePost.slug)!;
    } else {
      modalContent = (
        <>
          {activePost.image && (
            // Use our HoverImage component here.
            <HoverImage src={activePost.image} alt={activePost.title} />
          )}
          <div className="p-4">
            <p className="text-[15px] h-[4.5rem] text-muted-foreground line-clamp-3">
              {activePost.description}
            </p>
          </div>
        </>
      );
      contentCache.current.set(activePost.slug, modalContent);
    }
  }

  // Render the modal only on desktop devices.
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }
  if (!activePost) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: modalPos.x + 20, // 20px to the right of the mouse pointer
        top: modalPos.y + 32, // About 1.5rem (24px) below the mouse pointer
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div
        className={`bg-white dark:bg-[#222222] text-muted-foreground rounded-lg shadow-md border dark:border-[#444] w-80 overflow-hidden transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {modalContent}
      </div>
    </div>
  );
}
