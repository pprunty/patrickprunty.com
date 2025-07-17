'use client';

import React, { memo, useRef, useState, useEffect, useCallback } from 'react';
import { MemoizedImage } from '@/components/memoized-image';
import { MemoizedVideo } from './memoized-video';
import { MemoizedYouTube } from './memoized-youtube';
import { useMobile } from '@/hooks/use-mobile';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { X } from '@phosphor-icons/react/dist/ssr';

interface MediaItem {
  type: 'image' | 'video' | 'youtube';
  src: string | StaticImageData;
  thumbnail?: string | StaticImageData;
}

interface MediaCarouselProps {
  media: MediaItem[];
  title: string;
  initialFocusedIndex?: number | null;
  onClose?: () => void;
}

const MediaCarousel: React.FC<MediaCarouselProps> = memo(
  ({ media, title, initialFocusedIndex = null, onClose }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const isMobile = useMobile();

    const [focusedIndex, setFocusedIndex] = useState<number | null>(
      initialFocusedIndex,
    );
    const [mousePosition, setMousePosition] = useState<'left' | 'right' | null>(
      null,
    );

    // Track single-finger start
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    // Track if we're in a pinch gesture
    const isPinchingRef = useRef(false);

    const debounce = <T extends (...args: unknown[]) => void>(
      fn: T,
      ms = 10,
    ) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return function (this: unknown, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
      };
    };

    // Helper function to get string path from src
    const getSrcPath = (src: string | StaticImageData): string => {
      if (typeof src === 'string') {
        return src;
      }
      return src.src;
    };

    const navigateMedia = useCallback(
      (direction: 'next' | 'prev') => {
        if (focusedIndex === null || media.length === 0) return;
        if (direction === 'next') {
          setFocusedIndex((current) =>
            current === null ? 0 : (current + 1) % media.length,
          );
        } else {
          setFocusedIndex((current) =>
            current === null
              ? media.length - 1
              : (current - 1 + media.length) % media.length,
          );
        }
      },
      [focusedIndex, media.length],
    );

    const closeFocusedView = useCallback(() => {
      setFocusedIndex(null);
      document.body.style.overflow = '';
      if (onClose) onClose();
    }, [onClose]);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (isMobile) return;
        const { clientX, currentTarget } = e;
        const rect = currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        setMousePosition(clientX > centerX ? 'right' : 'left');
      },
      [isMobile],
    );

    const handleMouseLeave = useCallback(() => {
      setMousePosition(null);
    }, []);

    useEffect(() => {
      if (focusedIndex !== null) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [focusedIndex]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (focusedIndex === null) return;
        switch (e.key) {
          case 'ArrowLeft':
            navigateMedia('prev');
            e.preventDefault();
            break;
          case 'ArrowRight':
            navigateMedia('next');
            e.preventDefault();
            break;
          case 'Escape':
            closeFocusedView();
            e.preventDefault();
            break;
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [focusedIndex, navigateMedia, closeFocusedView]);

    // Handle touch start (detect pinch vs single-touch)
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (e.touches.length > 1) {
        isPinchingRef.current = true;
        return;
      }
      isPinchingRef.current = false;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }, []);

    // Only intercept single-finger horizontal swipes
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      // if pinching or multi-touch, let native handling run
      if (isPinchingRef.current || e.touches.length > 1) return;

      if (touchStartRef.current) {
        const dx = e.touches[0].clientX - touchStartRef.current.x;
        const dy = e.touches[0].clientY - touchStartRef.current.y;
        // horizontal swipe
        if (Math.abs(dx) > Math.abs(dy)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, []);

    // On touch end, skip navigation if it was a pinch
    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        if (isPinchingRef.current) {
          isPinchingRef.current = false;
          touchStartRef.current = null;
          return;
        }
        if (!touchStartRef.current) return;

        const touchEnd = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };
        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = touchEnd.y - touchStartRef.current.y;
        const minSwipeDistance = 50;

        if (
          Math.abs(deltaX) > Math.abs(deltaY) &&
          Math.abs(deltaX) > minSwipeDistance
        ) {
          if (deltaX > 0) {
            navigateMedia('prev');
          } else {
            navigateMedia('next');
          }
        } else if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            navigateMedia('prev');
          } else {
            navigateMedia('next');
          }
        }

        touchStartRef.current = null;
      },
      [navigateMedia],
    );

    const handleSideClick = useCallback(
      (e: React.MouseEvent) => {
        if (isMobile) return;
        const { clientX, currentTarget } = e;
        const rect = currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        if (clientX > centerX) {
          navigateMedia('next');
        } else {
          navigateMedia('prev');
        }
      },
      [isMobile, navigateMedia],
    );

    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const calculateScrollMetrics = () => {
        const currentPosition = scrollContainer.scrollLeft;
        const containerWidth = scrollContainer.clientWidth;
        const scrollWidth = scrollContainer.scrollWidth;
        setScrollPosition(currentPosition);
        setMaxScroll(Math.max(0, scrollWidth - containerWidth));
      };

      const handleScroll = () => {
        const currentPosition = scrollContainer.scrollLeft;
        setScrollPosition(currentPosition);
      };

      const debouncedHandleScroll = debounce(handleScroll, 10);

      // Calculate metrics immediately and after a brief delay to ensure content is rendered
      calculateScrollMetrics();
      const timeoutId = setTimeout(calculateScrollMetrics, 100);

      scrollContainer.addEventListener('scroll', debouncedHandleScroll);
      window.addEventListener('resize', calculateScrollMetrics);

      return () => {
        clearTimeout(timeoutId);
        scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
        window.removeEventListener('resize', calculateScrollMetrics);
      };
    }, [media]);

    const calculateIndicatorWidth = () => {
      if (!scrollContainerRef.current || maxScroll <= 0) return '0%';
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const percent = Math.max(
        10,
        Math.min(100, (containerWidth / scrollWidth) * 100),
      );
      return `${percent}%`;
    };

    const calculateIndicatorPosition = () => {
      if (!scrollContainerRef.current || maxScroll <= 0) return '0%';
      const clamped = Math.max(0, Math.min(scrollPosition, maxScroll));
      const width = parseFloat(calculateIndicatorWidth());
      const percent = Math.min(100 - width, (clamped / maxScroll) * 100);
      return `${percent}%`;
    };

    const scrollIndicatorWidth = calculateIndicatorWidth();
    const scrollIndicatorPosition = calculateIndicatorPosition();

    const getCursorStyle = () => {
      if (isMobile) return 'default';
      if (mousePosition === 'left') return 'w-resize';
      if (mousePosition === 'right') return 'e-resize';
      return 'default';
    };

    const renderFocusedMedia = () => {
      if (focusedIndex === null || !media[focusedIndex]) return null;
      const item = media[focusedIndex];
      const youtubeKey = `youtube-${typeof item.src === 'string' ? item.src : item.src.src}`;

      return (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleSideClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: getCursorStyle(),
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFocusedView();
            }}
            className="absolute top-4 right-4 text-foreground hover:text-muted-foreground p-2 rounded-full z-[9999] transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Media container */}
          <div className="max-w-[100vw] max-h-[100vh] w-full h-full flex items-center justify-center p-0 m-0">
            {item.type === 'video' ? (
              <div className="relative max-w-full max-h-[100vh] flex items-center justify-center overflow-hidden">
                <MemoizedVideo
                  src={getSrcPath(item.src)}
                  width={800}
                  height={800}
                  className="max-w-full max-h-[100vh] object-contain w-auto h-auto"
                  controls
                  focusable={false}
                />
              </div>
            ) : item.type === 'youtube' ? (
              <div
                key={youtubeKey}
                className="max-w-full w-full bg-black overflow-hidden"
                style={{
                  zIndex: 100,
                  position: 'relative',
                  width: '100%',
                  maxWidth: '800px',
                  minHeight: '300px',
                  aspectRatio: '16/9',
                }}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <MemoizedYouTube
                  videoId={getSrcPath(item.src)}
                  title={`${title} YouTube video ${focusedIndex + 1}`}
                  showPlayer
                  autoplay={!isMobile}
                  thumbnail={item.thumbnail}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-0 m-0">
                <Image
                  src={item.src}
                  alt={`${title} image ${focusedIndex + 1}`}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full max-w-full max-h-full"
                  quality={100}
                  priority
                  unoptimized
                  style={{
                    touchAction: 'pinch-zoom',
                  }}
                />
              </div>
            )}
          </div>

          {/* Counter */}
          <div
            className="absolute bottom-4 right-4 text-foreground py-3 px-3 z-[60] text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {focusedIndex + 1} / {media.length}
          </div>
        </div>
      );
    };

    return (
      <div className="mt-2 mb-2">
        {/* Thumbnail strip */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide sm:mx-0 -mx-4 h-[104px]"
          style={{ scrollSnapType: 'none' }}
        >
          <div className="flex gap-2 mb-2 sm:px-0 px-4 sm:pr-0 h-24">
            {media.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusedIndex(idx);
                }}
              >
                {item.type === 'video' ? (
                  <MemoizedVideo
                    src={getSrcPath(item.src)}
                    width={130}
                    height={130}
                    className="rounded-xl h-24 w-auto"
                    focusable={false}
                  />
                ) : item.type === 'youtube' ? (
                  <MemoizedYouTube
                    videoId={getSrcPath(item.src)}
                    title={`${title} YouTube video ${idx + 1}`}
                    className="rounded-xl h-24 w-auto"
                    focusable={false}
                    autoplay={false}
                    thumbnail={item.thumbnail}
                  />
                ) : (
                  <MemoizedImage
                    src={item.src}
                    alt={`${title} image ${idx + 1}`}
                    width={130}
                    height={130}
                    className="rounded-xl h-24 w-auto"
                    quality={100}
                    unoptimized
                    focusable={false}
                    animate={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="h-[6px] mt-1">
          {isMobile && maxScroll > 0 && (
            <div className="relative h-0.5 w-full bg-secondary-hover rounded">
              <div
                className="absolute h-full bg-muted-foreground rounded transition-all duration-150 ease-out"
                style={{
                  width: scrollIndicatorWidth,
                  left: scrollIndicatorPosition,
                }}
              />
            </div>
          )}
        </div>

        {/* Focused overlay */}
        {focusedIndex !== null && renderFocusedMedia()}
      </div>
    );
  },
);

MediaCarousel.displayName = 'MediaCarousel';
export default MediaCarousel;
