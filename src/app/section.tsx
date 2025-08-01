'use client';

import type React from 'react';
import { memo, useMemo, useState, useEffect } from 'react';
import MediaCarousel from './media-carousel';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { StaticImageData } from 'next/image';

interface MediaItem {
  type: 'image' | 'video' | 'youtube';
  src: string | StaticImageData;
  thumbnail?: string | StaticImageData;
}

interface SectionItem {
  title: string;
  subtitle?: string;
  url?: string;
  description?: React.ReactNode;
  year?: string | number;
  media?: (string | StaticImageData)[];
  youtubeIds?: string[];
  youtubeThumbnails?: (string | StaticImageData)[];
  hide?: boolean;
}

interface SectionProps {
  sectionName: string | React.ReactNode;
  items: SectionItem[];
  delay?: number;
}

const Section: React.FC<SectionProps> = memo(
  ({ sectionName, items, delay = 750 }) => {
    // sectionName is intentionally unused in this component but kept for API consistency
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }, [delay]);

    // Prepare all media items at once outside the render loop
    const allMediaItems = useMemo(() => {
      return items.map((item) => {
        const mediaItems: MediaItem[] = [];

        // Add regular media (images and videos)
        if (item.media) {
          item.media.forEach((src) => {
            // For StaticImageData objects, check if it has a src property
            if (typeof src === 'object' && 'src' in src) {
              mediaItems.push({ type: 'image', src });
            } else if (typeof src === 'string') {
              if (src.endsWith('.mp4') || src.endsWith('.mov')) {
                mediaItems.push({ type: 'video', src });
              } else {
                mediaItems.push({ type: 'image', src });
              }
            }
          });
        }

        // Add YouTube videos with optional thumbnail override
        if (item.youtubeIds) {
          item.youtubeIds.forEach((id, idx) => {
            const thumbnail = item.youtubeThumbnails?.[idx];
            mediaItems.push({ type: 'youtube', src: id, thumbnail });
          });
        }

        return mediaItems;
      });
    }, [items]);

    if (!isVisible) {
      return null;
    }

    return (
      <section className="text-base my-5">
        <div className="space-y-4">
          {items.map((item, index) => {
            if (item.hide) return null;

            const mediaItems = allMediaItems[index];

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-1">
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
                      className="text-base no-after font-normal text-primary underline decoration-wavy underline-offset-4 decoration-muted hover:decoration-primary hover:text-primary active:decoration-primary active:text-primary inline-flex items-center gap-1"
                    >
                      <span className="flex items-center gap-1 flex-wrap">
                        <span>{item.title}</span>
                        <ArrowUpRight
                          size={16}
                          weight="bold"
                          className="text-muted-foreground flex-shrink-0"
                        />
                      </span>
                    </a>
                  ) : (
                    <span className="text-base font-normal text-primary">
                      {item.title}
                    </span>
                  )}
                </div>

                <div className="text-base text-muted-foreground break-normal w-full">
                  {item.year && (
                    <div className="flex items-baseline">
                      {item.description && (
                        <span className="text-base break-normal w-full">
                          {' '}
                          {item.year} · {item.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {mediaItems.length > 0 && (
                  <div className="mt-6 mb-8">
                    <MediaCarousel media={mediaItems} title={item.title} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  },
);

Section.displayName = 'Section';

export default Section;
