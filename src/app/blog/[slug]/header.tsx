'use client';

import { useEffect, useRef } from 'react';
import type { Post } from '../../get-posts';
import { H1 } from '@/app/blog/components/h1';
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';
import { ago } from 'time-ago';
import { Calendar, BookOpen, Eye } from 'lucide-react'; // Import the icons

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
      <p className="font-mono flex flex-wrap justify-between items-center text-xs text-gray-700 dark:text-[#999999]">
        {/* Left Section (Author, Date, and Mins Read) */}
        <span className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <span className="hidden md:inline">
            <a
              href={post.authorUrl}
              className="hover:text-gray-500 dark:hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.author}
            </a>
          </span>

          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span suppressHydrationWarning={true}>
              {post.date || 'Unknown date'} (
              {post.date ? `${ago(post.date, true)} ago` : ''})
            </span>
          </span>

          <span className="flex items-center md:ml-4">
            <BookOpen className="w-4 h-4 mr-2" />
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
          <Eye className="w-4 h-4 mr-2" />
          {views} views
        </span>
      ) : null}
    </>
  );
}
