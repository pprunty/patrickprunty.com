// src/app/blog/[slug]/header.tsx

import { getViewCount } from '@/__samwise/utils/fetchViewCount';
import { formatDistanceToNow } from 'date-fns';
import ViewCounter from '@/modules/blog/components/ViewCounter';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import { H1 } from '@/app/blog/components//h1';

interface HeaderProps {
  currentPost: BlogPostType | null;
}

export default async function Header({ currentPost }: HeaderProps) {
  if (currentPost == null) return <></>;

  const views = await getViewCount(currentPost.slug);

  let postDate: Date | null = null;
  let timeAgo: string = '';

  if (currentPost.date) {
    postDate = new Date(currentPost.date);
    timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
  } else {
    timeAgo = 'Unknown date';
  }

  return (
    <div suppressHydrationWarning={true}>
      {/* Header Section */}
      <H1>{currentPost.title}</H1>
      <p className="font-mono flex text-xs text-gray-700 dark:text-[#999999]">
        <span className="flex-grow">
          <span className="hidden md:inline">
            <span>
              <a
                href={currentPost.authorUrl}
                className="hover:text-gray-400 dark:hover:text-gray-400"
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
        <span className="pr-1.5" suppressHydrationWarning={true}>
          <ViewCounter
            id={currentPost.slug}
            defaultValue={views}
            incrementOnMount={true}
          />
        </span>
      </p>
    </div>
  );
}
