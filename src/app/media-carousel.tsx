'use client';

import type React from 'react';
import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { MemoizedImage } from '@/components/memoized-image';
import { MemoizedVideo } from './memoized-video';
import { MemoizedYouTube } from './memoized-youtube';
import { useMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  type: 'image' | 'video' | 'youtube';
  src: string;
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
    // State for focused media
    const [focusedIndex, setFocusedIndex] = useState<number | null>(
      initialFocusedIndex,
    );
    // Mouse position to determine cursor
    const [mousePosition, setMousePosition] = useState<'left' | 'right' | null>(
      null,
    );

    // Touch gesture tracking
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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

    // Handle navigation in the focused view
    const navigateMedia = useCallback(
      (direction: 'next' | 'prev') => {
        if (focusedIndex === null || !media.length) return;

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

    // Close the overlay
    const closeFocusedView = useCallback(() => {
      setFocusedIndex(null);

      // Re-enable scrolling on the body
      document.body.style.overflow = '';

      // Call the onClose prop if provided
      if (onClose) {
        onClose();
      }
    }, [onClose]);

    // Track mouse position for cursor styling
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

    // Add body scroll lock when modal opens
    useEffect(() => {
      if (focusedIndex !== null) {
        // Disable body scrolling when modal is open
        document.body.style.overflow = 'hidden';
      } else {
        // Re-enable scrolling when modal is closed
        document.body.style.overflow = '';
      }

      return () => {
        // Clean up - ensure scrolling is re-enabled when component unmounts
        document.body.style.overflow = '';
      };
    }, [focusedIndex]);

    // Handle keyboard navigation
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

    // Handle touch events for swipe navigation
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      // Prevent default behavior to ensure body doesn't scroll
      e.preventDefault();
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      // Always prevent default to avoid page scrolling while swiping
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        if (!touchStartRef.current || focusedIndex === null) return;

        const touchEnd = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };

        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = touchEnd.y - touchStartRef.current.y;

        // Only process if it's a significant swipe (more than 50px)
        const minSwipeDistance = 50;

        // Determine if this is a horizontal or vertical swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
              // Swipe right -> previous
              navigateMedia('prev');
            } else {
              // Swipe left -> next
              navigateMedia('next');
            }
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
              // Swipe down -> previous
              navigateMedia('prev');
            } else {
              // Swipe up -> next
              navigateMedia('next');
            }
          }
        }

        touchStartRef.current = null;
      },
      [focusedIndex, navigateMedia],
    );

    // Handle side clicks for desktop navigation
    const handleSideClick = useCallback(
      (e: React.MouseEvent) => {
        if (isMobile) return; // Skip for mobile, they use touch gestures

        const { clientX, currentTarget } = e;
        const rect = currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        // Click on right side of the screen - go to next item
        // Click on left side of the screen - go to previous item
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

      const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const currentPosition = scrollContainerRef.current.scrollLeft;
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        const maxScrollPosition = Math.max(0, scrollWidth - containerWidth);
        setScrollPosition(currentPosition);
        setMaxScroll(maxScrollPosition);
      };

      const debouncedHandleScroll = debounce(handleScroll, 10);

      // Calculate initial values
      handleScroll();

      // Add scroll event listener with debounced handler
      scrollContainer.addEventListener('scroll', debouncedHandleScroll);

      // Handle resize to recalculate max scroll
      const handleResize = () => {
        handleScroll();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }, [media]);

    // Calculate indicator width and position with boundary checks
    const calculateIndicatorWidth = () => {
      if (!scrollContainerRef.current || maxScroll <= 0) return '0%';
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      // Ensure width is between 10% (minimum for visibility) and 100%
      const percentage = Math.max(
        10,
        Math.min(100, (containerWidth / scrollWidth) * 100),
      );
      return `${percentage}%`;
    };

    const calculateIndicatorPosition = () => {
      if (!scrollContainerRef.current || maxScroll <= 0) return '0%';
      // Clamp scroll position between 0 and maxScroll
      const clampedPosition = Math.max(0, Math.min(scrollPosition, maxScroll));
      // Calculate percentage (0-100) and ensure it doesn't push indicator out of bounds
      const percentage = Math.min(
        100 - Number.parseFloat(calculateIndicatorWidth()),
        (clampedPosition / maxScroll) * 100,
      );
      return `${percentage}%`;
    };

    const scrollIndicatorWidth = calculateIndicatorWidth();
    const scrollIndicatorPosition = calculateIndicatorPosition();

    // Get the appropriate cursor based on mouse position
    const getCursorStyle = () => {
      if (isMobile) return 'default';
      if (mousePosition === 'left') return 'w-resize';
      if (mousePosition === 'right') return 'e-resize';
      return 'default';
    };

    // Render the focused media item in an overlay when selected
    const renderFocusedMedia = () => {
      if (focusedIndex === null || !media[focusedIndex]) return null;

      const item = media[focusedIndex];
      console.log('Rendering focused media:', {
        focusedIndex,
        itemType: item.type,
        itemSrc: item.src,
      });

      // Use a stable key based just on the video ID, not Date.now()
      const youtubeKey = `youtube-${item.src}`;

      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45 touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleSideClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: getCursorStyle() }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 dark:bg-[#333] dark:text-white bg-white border dark:border-[#4B4B4B] border-[#E0E0E0] text-black dark:text-white p-2 px-6 rounded-full transition-colors duration-150 z-[60] shadow-sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent side click handling
              closeFocusedView();
            }}
            aria-label="Close"
          >
            Close
          </button>

          {/* Media content - improved mobile responsiveness */}
          <div className="max-w-[100vw] max-h-[100vh] w-full relative p-0 m-0 flex items-center justify-center">
            {item.type === 'video' ? (
              <MemoizedVideo
                src={item.src}
                alt={`${title} video ${focusedIndex + 1}`}
                width={800}
                height={800}
                className="max-w-full max-h-[100vh]"
                controls
                focusable={false}
              />
            ) : item.type === 'youtube' ? (
              <div
                key={youtubeKey}
                className="max-w-full w-full bg-black overflow-hidden"
                style={{
                  zIndex: 100,
                  position: 'relative',
                  // Larger size for desktop, constrained on mobile
                  width: '100%',
                  maxWidth: '800px',
                  minHeight: '300px',
                  aspectRatio: '16/9',
                }}
                // Stop propagation of mouse events to prevent re-renders
                onMouseMove={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <MemoizedYouTube
                  videoId={item.src}
                  title={`${title} YouTube video ${focusedIndex + 1}`}
                  showPlayer={true}
                  autoplay={true}
                />
              </div>
            ) : (
              <Image
                src={item.src}
                alt={`${title} image ${focusedIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[100vh] object-contain"
                quality={100}
                priority={true}
                unoptimized
              />
            )}
          </div>

          {/* Caption/counter - moved to bottom right */}
          <div
            className="absolute bottom-4 right-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full transition-colors duration-150 z-[60]"
            onClick={(e) => e.stopPropagation()} // Prevent side click handling
          >
            {focusedIndex + 1} / {media.length}
          </div>
        </div>
      );
    };

    return (
      <div className="mt-2 mb-2 sm:mx-0 sm:mb-0">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollSnapType: 'none' }}
        >
          <div className="flex gap-2 sm:px-0 mb-2">
            {media.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Thumbnail clicked:', {
                    idx,
                    itemType: item.type,
                  });
                  setFocusedIndex(idx);
                }}
              >
                {item.type === 'video' ? (
                  <MemoizedVideo
                    src={item.src}
                    alt={`${title} video ${idx + 1}`}
                    width={130}
                    height={130}
                    className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
                    focusable={false}
                  />
                ) : item.type === 'youtube' ? (
                  <MemoizedYouTube
                    videoId={item.src}
                    title={`${title} YouTube video ${idx + 1}`}
                    className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
                    focusable={false}
                    autoplay={false}
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
                    focusable={false}
                    animate={true}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator - only visible on mobile */}
        {isMobile && maxScroll > 0 && (
          <div className="relative h-0.5 w-full bg-secondary-hover rounded mt-1 sm:hidden">
            <div
              className="absolute h-full bg-muted-foreground rounded transition-all duration-150 ease-out"
              style={{
                width: scrollIndicatorWidth,
                left: scrollIndicatorPosition,
              }}
            />
          </div>
        )}

        {/* Render focused view overlay when an item is selected */}
        {focusedIndex !== null && renderFocusedMedia()}
      </div>
    );
  },
);

MediaCarousel.displayName = 'MediaCarousel';

export default MediaCarousel;
