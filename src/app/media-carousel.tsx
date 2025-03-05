'use client';

import type React from 'react';
import { memo } from 'react';
import { MemoizedImage } from '@/modules/common/components/MemoizedImage';
import { MemoizedVideo } from './memoized-video';
import { MemoizedYouTube } from './memoized-youtube';

interface MediaItem {
  type: 'image' | 'video' | 'youtube';
  src: string;
}

interface MediaCarouselProps {
  media: MediaItem[];
  title: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = memo(({ media, title }) => {
  return (
    <div className="mt-2 mb-1.5 sm:mx-0 sm:mb-0">
      <div
        className="overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: 'none' }}
      >
        <div className="flex gap-2 sm:px-0 mb-2">
          {media.map((item, idx) => (
            <div key={idx} className="flex-shrink-0">
              {item.type === 'video' ? (
                <MemoizedVideo
                  src={item.src}
                  alt={`${title} video ${idx + 1}`}
                  width={130}
                  height={130}
                  className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
                />
              ) : item.type === 'youtube' ? (
                <MemoizedYouTube
                  videoId={item.src}
                  title={`${title} YouTube video ${idx + 1}`}
                  width={130}
                  height={130}
                  className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
                />
              ) : (
                <MemoizedImage
                  src={item.src}
                  alt={`${title} image ${idx + 1}`}
                  width={130}
                  height={130}
                  className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
                  quality={100}
                  unoptimized
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

MediaCarousel.displayName = 'MediaCarousel';

export default MediaCarousel;
