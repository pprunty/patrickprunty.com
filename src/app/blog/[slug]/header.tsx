'use client';

import { useEffect, useRef } from 'react';
import type { Post } from '../../get-posts';
import { H1 } from '@/app/blog/components/h1';
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';
import { ago } from 'time-ago';
import { Calendar1, BookOpenText, Eye } from 'lucide-react'; // Import the icons

interface HeaderProps {
  posts: Post[] | null;
  currentPost: Post | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Header({ currentPost }: HeaderProps) {
  const slug = currentPost?.slug;

  const { data: post, mutate } = useSWR(
    slug ? `/api/view?id=${slug}` : null,
    fetcher,
    {
      fallbackData: currentPost,
      refreshInterval: 5000,
    },
  );

  if (currentPost == null) return <></>;

  return (
    <>
      {/* Header Section */}
      <H1>{post.title}</H1>
      <p className="font-mono text-xs flex flex-wrap justify-between items-center mt-3 text-gray-700 dark:text-[#888888]">
        {/* Left Section (Author, Date, and Mins Read) */}
        <span className="flex flex-col md:flex-row items-start md:items-center md:gap-2 gap-2">
          {/* Author */}
          <span className="hidden md:inline">
            <a
              href={'https://x.com/pprunty_'}
              className="hover:text-gray-500 dark:hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.author}
            </a>
            <span className="hidden md:inline ml-2">|</span>
          </span>

          {/* Date */}
          <span className="flex items-center">
            <Calendar1 className="w-3.5 h-3.5 mr-2" />
            <span suppressHydrationWarning={true}>
              {post.date || 'Unknown date'} (
              {post.date ? `${ago(post.date, true)} ago` : ''})
            </span>
            <span className="hidden md:inline ml-2">|</span>
          </span>

          {/* Mins Read */}
          <span className="flex items-center">
            <BookOpenText className="w-3.5 h-3.5 mr-2" />
            <span>{post.readingTime} mins read</span>
          </span>
        </span>

        {/* Right Section (Views) */}
        <span className="flex items-center mt-2 md:mt-0">
          <Views
            id={post.slug || post.id}
            mutate={mutate}
            defaultValue={post.viewsFormatted}
          />
        </span>
      </p>
    </>
  );
}

function Views({
  id,
  mutate,
  defaultValue,
}: {
  id: string | undefined;
  mutate: KeyedMutator<{ views: number }>;
  defaultValue: number | null;
}) {
  const views = defaultValue;
  const didLogViewRef = useRef(false);

  useEffect(() => {
    if ('development' === process.env.NODE_ENV) return;
    if (!didLogViewRef.current && id) {
      const url = '/api/view?incr=1&id=' + encodeURIComponent(id);
      fetch(url)
        .then((res) => res.json())
        .then((obj) => {
          mutate(obj);
        })
        .catch(console.error);
      didLogViewRef.current = true;
    }
  });

  return (
    <>
      {views != null ? (
        <span className="flex items-center">
          <Eye className="w-3.5 h-3.5 mr-2" />
          {views} views
        </span>
      ) : null}
    </>
  );
}
