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
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={`${className} h-32 min-w-[14rem] max-w-[14rem] overflow-hidden flex-shrink-0 relative`}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        width={448}
        height={252}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.6)" />
          <polygon points="20,16 36,24 20,32" fill="#fff" />
        </svg>
      </div>
    </div>
  );
});
