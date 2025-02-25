'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';
import { H2 } from '@/app/blog/components/h2';

interface SectionItem {
  title: string;
  subtitle?: string;
  url?: string;
  description?: React.ReactNode;
  year?: string | number;
  media?: string[];
  youtubeIds?: string[]; // New property for YouTube video IDs
  hide?: boolean;
}

interface SectionProps {
  sectionName: string;
  items: SectionItem[];
}

interface MediaCarouselProps {
  media: string[];
  title: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = memo(({ media, title }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // Refs for swipe (touch) handling - horizontal
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  // New refs for vertical swipe detection
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // Detect if device is mobile (using 768px as threshold)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If the active item changes, reset loader states
  useEffect(() => {
    setMediaLoaded(false);
  }, [activeIndex]);

  // Debounce the spinner so it only shows if media takes longer than ~300ms to load
  useEffect(() => {
    if (!mediaLoaded) {
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [mediaLoaded, activeIndex]);

  // Helper to check if a media source is a video
  const isVideo = useCallback((src: string) => {
    return src.endsWith('.mp4') || src.endsWith('.mov');
  }, []);

  // Navigation handlers
  const nextItem = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % media.length;
    });
  }, [media.length]);

  const prevItem = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + media.length) % media.length;
    });
  }, [media.length]);

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (activeIndex !== null) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeIndex, closeModal]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [activeIndex]);

  // Touch handlers - now including vertical movement
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Only process if there's exactly one touch
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Only process if there's exactly one touch
    if (e.touches.length !== 1) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    // Ensure this was a single touch gesture
    if (e.changedTouches.length !== 1) return;
    const threshold = 50; // adjust threshold as needed
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      touchStartY.current !== null &&
      touchEndY.current !== null
    ) {
      const deltaX = touchStartX.current - touchEndX.current;
      const deltaY = touchStartY.current - touchEndY.current;
      // Use the dominant direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) {
          nextItem();
        } else if (deltaX < -threshold) {
          prevItem();
        }
      } else {
        if (deltaY > threshold) {
          // Drag down: finger moved downwards (startY < endY) gives deltaY negative.
          // But here, deltaY positive means upward swipe.
          // So, if deltaY > threshold, it's an upward swipe -> trigger prevItem (as drag up = drag right)
          prevItem();
        } else if (deltaY < -threshold) {
          // Drag down (finger moved downward) -> trigger nextItem (as drag down = drag left)
          nextItem();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  // Create clickable thumbnails
  const thumbnails = useMemo(() => {
    return media.map((src, idx) => (
      <div key={idx} className="flex-shrink-0">
        <span onClick={() => setActiveIndex(idx)} className="cursor-pointer">
          {isVideo(src) ? (
            <video
              src={src}
              width={130}
              height={130}
              preload="metadata"
              className="rounded-xl border h-26 w-auto border-[#E2E2E2] dark:border-[#343334]"
              autoPlay
              playsInline
              muted
              loop
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={src}
              alt={`${title} image ${idx + 1}`}
              width={130}
              height={130}
              className="rounded-xl border h-26 w-auto border-[#E2E2E2] dark:border-[#343334]"
              priority
            />
          )}
        </span>
      </div>
    ));
  }, [media, title, isVideo]);

  // Decide how thumbnails are rendered (carousel for multiple, single image for one)
  const carouselContent = useMemo(() => {
    if (media.length > 1) {
      return (
        <div className="mt-2 mb-1.5 sm:mx-0 sm:mb-0">
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex gap-2 sm:px-0">{thumbnails}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-2 mb-1.5 sm:mx-0 sm:mb-0">
          <div className="sm:px-0">
            <span onClick={() => setActiveIndex(0)} className="cursor-pointer">
              {isVideo(media[0]) ? (
                <video
                  src={media[0]}
                  width={130}
                  height={130}
                  preload="metadata"
                  className="max-w-xs rounded-xl sm:mb-1.5 border border-[#E2E2E2] dark:border-[#343334]"
                  autoPlay
                  playsInline
                  muted
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={media[0]}
                  alt={`${title} image`}
                  width={130}
                  height={130}
                  className="max-w-xs rounded-xl sm:mb-1.5 h-26 w-auto border border-[#E2E2E2] dark:border-[#343334]"
                  priority
                />
              )}
            </span>
          </div>
        </div>
      );
    }
  }, [media, title, isVideo, thumbnails]);

  // Always render the modal DOM, but hide it if activeIndex is null
  const modalOverlay = useMemo(() => {
    // We add a conditional 'hidden' class or style if not active
    const hiddenClass = activeIndex === null ? 'hidden' : '';

    return (
      <div
        className={
          `fixed inset-0 z-50 flex items-center justify-center
           bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45
           ` + hiddenClass
        }
        onClick={(e) => {
          // Only close if user clicked the backdrop itself
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {activeIndex !== null && isVideo(media[activeIndex]) ? (
            <video
              src={media[activeIndex]}
              autoPlay
              preload="auto"
              playsInline
              muted={false}
              loop
              onLoadedData={() => setMediaLoaded(true)}
              className="object-contain w-full md:w-auto h-auto md:h-full"
            >
              Your browser does not support the video tag.
            </video>
          ) : activeIndex !== null ? (
            <Image
              src={media[activeIndex]}
              alt={`${title} modal image`}
              width={800}
              height={600}
              onLoad={() => setMediaLoaded(true)}
              className="object-contain w-full md:w-auto h-auto md:h-full"
              priority
            />
          ) : null}

          {showSpinner && !mediaLoaded && activeIndex !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ClipLoader color="#888888" size={20} />
            </div>
          )}

          <button
            onClick={closeModal}
            style={{ zIndex: 10 }}
            className="absolute bottom-4 left-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full"
          >
            Close
          </button>

          {activeIndex !== null && (
            <button
              onClick={nextItem}
              className="absolute bottom-4 right-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full"
            >
              {activeIndex + 1}/{media.length}
            </button>
          )}

          {/* Left Navigation Overlay (Desktop only) */}
          <div
            className="absolute top-0 left-0 h-full w-1/2"
            onClick={!isMobile ? prevItem : undefined}
            style={{ cursor: !isMobile ? 'w-resize' : 'default' }}
          />

          {/* Right Navigation Overlay (Desktop only) */}
          <div
            className="absolute top-0 right-0 h-full w-1/2"
            onClick={!isMobile ? nextItem : undefined}
            style={{ cursor: !isMobile ? 'e-resize' : 'default' }}
          />
        </div>
      </div>
    );
  }, [
    activeIndex,
    media,
    title,
    isVideo,
    nextItem,
    prevItem,
    closeModal,
    mediaLoaded,
    showSpinner,
    isMobile,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <>
      {carouselContent}
      {modalOverlay}
    </>
  );
});

MediaCarousel.displayName = 'MediaCarousel';

const Section: React.FC<SectionProps> = memo(({ sectionName, items }) => {
  return (
    <section className="my-6 text-base">
      <div className="mb-6">
        <H2>{sectionName}</H2>
      </div>
      <ul className="list-disc list-outside pl-6 space-y-2">
        {items.map((item, index) => {
          if (item.hide) return null;
          return (
            <li key={index} className="list-item">
              <div className="flex flex-col md:flex-row gap-2">
                <div>
                  <div className="font-normal dark:text-[#EEEEEE] text-[#111111]">
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
                  {item.media && item.media.length > 0 && (
                    <MediaCarousel media={item.media} title={item.title} />
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
