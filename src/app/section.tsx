'use client';

import type React from 'react';
import { memo, useMemo } from 'react';
import MediaCarousel from './media-carousel';
import { H2 } from '@/app/blog/components/h2';

interface MediaItem {
  type: 'image' | 'video' | 'youtube';
  src: string;
}

interface SectionItem {
  title: string;
  subtitle?: string;
  url?: string;
  description?: React.ReactNode;
  year?: string | number;
  media?: string[];
  youtubeIds?: string[];
  hide?: boolean;
}

interface SectionProps {
  sectionName: string | React.ReactNode;
  items: SectionItem[];
}

const Section: React.FC<SectionProps> = memo(({ sectionName, items }) => {
  // Prepare all media items at once outside the render loop
  const allMediaItems = useMemo(() => {
    return items.map((item) => {
      const mediaItems: MediaItem[] = [];

      // Add regular media (images and videos)
      if (item.media) {
        item.media.forEach((src) => {
          if (src.endsWith('.mp4') || src.endsWith('.mov')) {
            mediaItems.push({ type: 'video', src });
          } else {
            mediaItems.push({ type: 'image', src });
          }
        });
      }

      // Add YouTube videos
      if (item.youtubeIds) {
        item.youtubeIds.forEach((id) => {
          mediaItems.push({ type: 'youtube', src: id });
        });
      }

      return mediaItems;
    });
  }, [items]);

  return (
    <section className="my-6 text-base">
      <div className="mb-6">
        <H2>{sectionName}</H2>
      </div>
      <ul className="list-disc list-outside pl-6 space-y-2">
        {items.map((item, index) => {
          if (item.hide) return null;

          const mediaItems = allMediaItems[index];

          return (
            <li key={index} className="list-item">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="w-full">
                  <div className="font-normal">
                    {item.url ? (
                      <a
                        href={item.url}
                        target={
                          item.url.startsWith('https://') ? '_blank' : '_self'
                        }
                        rel={
                          item.url.startsWith('https://')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-[#EEEEEE] text-[#111111] dark:border-gray-500 dark:hover:border-white"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-base text-[#111111] dark:text-[#AAAAAA] mt-1">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-1 text-base text-[#111111] dark:text-[#B0AFB0]">
                      {item.description}
                    </p>
                  )}
                  {mediaItems.length > 0 && (
                    <MediaCarousel media={mediaItems} title={item.title} />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

Section.displayName = 'Section';

export default Section;
