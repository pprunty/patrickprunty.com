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
}

export const MemoizedYouTube = memo(function MemoizedYouTube({
  videoId,
  title,
  className = '',
  focusable = true,
  showPlayer = false,
  autoplay = false,
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
  // Thumbnail logic not needed for the fix - just show the thumbnail
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={`${className} h-24 min-w-[10.5rem] max-w-[10.5rem] overflow-hidden flex-shrink-0`}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        width={420}
        height={236}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
});
