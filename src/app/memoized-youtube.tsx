'use client';

import React, { memo } from 'react';
import { YouTube } from '@/app/blog/components/youtube';
import Image from 'next/image';

interface MemoizedYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  focusable?: boolean;
  showPlayer?: boolean;
  autoplay?: boolean;
  thumbnail?: string | import('next/image').StaticImageData;
}

export const MemoizedYouTube = memo(function MemoizedYouTube({
  videoId,
  title,
  className = '',
  focusable = true,
  showPlayer = false,
  autoplay = false,
  thumbnail,
}: MemoizedYouTubeProps) {
  // If we're showing the player directly (in MediaCarousel's focused view)
  if (showPlayer) {
    console.log(
      'MemoizedYouTube rendering player directly with videoId:',
      videoId,
      'autoplay:',
      autoplay,
    );
    // Force unique key to ensure proper re-rendering
    const uniqueKey = `youtube-${videoId}-${Date.now()}`;

    return (
      <div
        className={`${className} w-full h-full relative z-50`}
        style={{ minHeight: '360px' }}
      >
        <YouTube
          key={uniqueKey}
          videoId={videoId}
          className="z-50"
          autoplay={autoplay}
        />
      </div>
    );
  }

  // Otherwise we're just showing a thumbnail
  const thumbnailUrl =
    thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={`${className} h-24 min-w-[10.5rem] max-w-[10.5rem] overflow-hidden flex-shrink-0 relative cursor-pointer`}
      tabIndex={focusable ? 0 : -1}
      role="button"
      aria-label={`Play YouTube video: ${title}`}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        width={420}
        height={236}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Play button overlay */}
      <span
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <span className="bg-[#FF0000]/95 px-4 py-1.5 flex items-center justify-center shadow-lg rounded-lg">
          {/* SVG Play Icon (triangle only, no circle) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <polygon points="6,4 16,10 6,16" fill="white" />
          </svg>
        </span>
      </span>
    </div>
  );
});
