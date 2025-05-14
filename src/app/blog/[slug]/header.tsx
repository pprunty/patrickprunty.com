'use client';

import { useEffect, useRef } from 'react';
import type { Post } from '../../get-posts';
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';
import { ago } from 'time-ago';
import { Calendar, Clock, Eye } from '@phosphor-icons/react'; // Changed BookOpen to Clock
import Image from 'next/image';
import AudioPlayer from '@/components/audio-player';

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
      <h1 className="text-4xl font-script font-[300] sm:text-6xl dark:text-gray-100 mb-2">
        {post.title}
      </h1>
      {post.description && (
        <p className="italic mb-6 text-2xl font-script font-[400] text-muted-foreground">
          {post.description}
        </p>
      )}

      {/* Author with Twitter Link - Above Meta Section */}
      <div className="mt-3 mb-3 flex items-center font-mono text-sm text-muted-foreground/70">
        <div className="relative w-10 h-10 mr-3">
          <Image
            src="/images/me-sketch2.png"
            alt="Patrick Prunty"
            fill
            className="rounded-full object-cover border border-gray-200 bg-gray-400 dark:border-gray-700"
          />
        </div>
        <span>by</span>
        <a
          href={'https://x.com/pprunty_'}
          className="ml-1 hover:text-gray-500 no-after dark:hover:text-gray-300 font-semibold relative after:absolute after:w-full after:h-px after:bg-current after:bottom-0 after:left-0 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Patrick Prunty
        </a>
      </div>

      {/* Metadata Section - Redesigned with | separators and mobile borders */}
      <div className="font-mono mb-4 py-3 text-xs flex flex-wrap items-center text-muted-foreground/70 border-t border-b border-border h-14">
        <div className="flex flex-wrap items-center flex-1">
          {/* Date - Time Ago Only */}
          <div className="flex items-center">
            <Calendar weight="regular" className="w-4 h-4 mr-2 opacity-70" />
            <span
              suppressHydrationWarning={true}
              className="text-muted-foreground/70"
            >
              {post.date
                ? new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown date'}
            </span>
          </div>

          <span className="mx-2">|</span>

          {/* Reading Time - Simplified */}
          <div className="flex items-center">
            <Clock weight="regular" className="w-4 h-4 mr-2 opacity-70" />
            <span>
              {post.readingTime} mins
              <span className="hidden sm:inline"> read</span>
            </span>
          </div>

          <span className="mx-2">|</span>

          {/* Views - Inline */}
          <Views
            id={post.slug || post.id}
            mutate={mutate}
            defaultValue={post.viewsFormatted}
          />
        </div>

        {/* Fixed-width container for Audio Player */}
        <div className="w-8 h-8 flex justify-end items-center">
          {/* Audio Player - Only shows if audio exists */}
          {!slug ? (
            <div className="w-8 h-8"></div>
          ) : (
            <AudioPlayer slug={slug} />
          )}
        </div>
      </div>
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
        <div className="flex items-center text-muted-foreground/70">
          <Eye weight="regular" className="w-4 h-4 mr-2 opacity-70" />
          {views}
          <span className="hidden sm:inline">&nbsp;views</span>
        </div>
      ) : null}
    </>
  );
}
