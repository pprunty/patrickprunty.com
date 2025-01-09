'use client';

import { useEffect, useRef } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import { H1 } from '@/app/blog/components//h1';
import useSWR from 'swr';
import { KeyedMutator } from 'swr';

interface HeaderProps {
  currentPost: BlogPostType | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Header({ currentPost }: HeaderProps) {
  const slug = currentPost?.slug;

  // Only call SWR if there is a valid slug
  const { data: post, mutate } = useSWR(
    slug ? `/api/view?id=${slug}` : null, // <-- null will skip SWR if slug is falsy
    fetcher,
    {
      fallbackData: currentPost,
      refreshInterval: 5000,
    },
  );

  //   console.log('post = ', post);

  if (!currentPost) {
    return null;
  }
  // The rest remains the same
  let postDate: Date | null = null;
  let timeAgo = '';

  if (currentPost.date) {
    postDate = new Date(currentPost.date);
    timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
  } else {
    timeAgo = 'Unknown date';
  }

  return (
    <>
      {/* Header Section */}
      <H1>{currentPost.title}</H1>
      <p className="font-mono flex text-xs text-gray-700 dark:text-[#999999]">
        <span className="flex-grow">
          <span className="hidden md:inline">
            <span>
              <a
                href={currentPost.authorUrl}
                className="hover:text-gray-500 dark:hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentPost.author}
              </a>
            </span>

            <span className="mx-2">|</span>
          </span>
          <span suppressHydrationWarning={true}>
            {currentPost.date || 'Unknown date'}{' '}
            <br className="sm:block md:hidden lg:hidden" />
            {postDate ? `(${timeAgo})` : ''} <span className="">| </span>
            {currentPost.readingTime} mins read
          </span>
        </span>
        <span className="pr-1.5">
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
  //   console.log('id = ', id);

  useEffect(() => {
    //       if ("development" === process.env.NODE_ENV) return;
    if (!didLogViewRef.current && id) {
      //       console.log('will do increment view');
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

  return <>{views != null ? <span>{views} views</span> : null}</>;
}
