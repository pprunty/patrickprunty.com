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
  description?: string;
  year?: string | number;
  media?: string[];
  hide?: boolean; // New property to conditionally hide items
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Refs for swipe (touch) handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset the mediaLoaded state when the active media changes
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

  // Memoized helper to check if a media source is a video
  const isVideo = useCallback(
    (src: string) => src.endsWith('.mp4') || src.endsWith('.mov'),
    [],
  );

  // Memoized navigation handlers
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

  // Prevent background scrolling and close modal on significant scroll (ignoring minor pinch-to-zoom)
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
      const initialScrollY = window.scrollY;
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        // Only close if the scroll difference is greater than 20px (adjust as needed)
        if (Math.abs(currentScrollY - initialScrollY) > 20) {
          closeModal();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [activeIndex, closeModal]);

  // Set volume for the unmuted video when modal opens
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5;
    }
  }, [activeIndex]);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const threshold = 50; // adjust threshold as needed
      if (distance > threshold) {
        // Swiped left: move to the next item
        nextItem();
      } else if (distance < -threshold) {
        // Swiped right: move to the previous item
        prevItem();
      }
    }
    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Cache thumbnails so that they aren’t rebuilt on every render
  const thumbnails = useMemo(() => {
    return media.map((src, idx) => (
      <div key={idx} className="flex-shrink-0">
        <span onClick={() => setActiveIndex(idx)} className="cursor-pointer">
          {isVideo(src) ? (
            <video
              src={src}
              width={130}
              height={130}
              className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
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
              className="rounded-xl border h-24 w-auto border-[#E2E2E2] dark:border-[#343334]"
              priority
            />
          )}
        </span>
      </div>
    ));
  }, [media, title, isVideo]);

  // Cache the carousel content for thumbnails.
  // Added extra bottom margin (mb-1.5) on mobile devices.
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
                  className="max-w-xs rounded-xl sm:mb-1.5 border border-[#E2E2E2] dark:border-[#343334]"
                  priority
                />
              )}
            </span>
          </div>
        </div>
      );
    }
  }, [media, title, isVideo, thumbnails]);

  // Cache the modal overlay content so it isn’t recreated unless needed
  const modalOverlay = useMemo(() => {
    if (activeIndex === null) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isVideo(media[activeIndex]) ? (
            <video
              src={media[activeIndex]}
              autoPlay
              muted={false}
              playsInline
              loop
              ref={videoRef}
              onLoadedData={() => setMediaLoaded(true)}
              className="object-contain w-full md:w-auto h-auto md:h-full"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={media[activeIndex]}
              alt={`${title} modal image`}
              width={800}
              height={600}
              unoptimized
              quality={100}
              onLoad={() => setMediaLoaded(true)}
              className="object-contain w-full md:w-auto h-auto md:h-full"
              priority
            />
          )}

          {/* Spinner overlay (debounced) */}
          {showSpinner && !mediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ClipLoader color="#888888" size={20} />
            </div>
          )}

          {/* Bottom Left: Close Button */}
          <button
            onClick={closeModal}
            style={{ zIndex: 10 }}
            className="absolute bottom-4 left-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full"
          >
            Close
          </button>

          {/* Bottom Right: Index Indicator */}
          <button
            onClick={nextItem}
            className="absolute bottom-4 right-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full"
          >
            {activeIndex + 1}/{media.length}
          </button>

          {/* Left Navigation Overlay with inline cursor style */}
          <div
            className="absolute top-0 left-0 h-full w-1/2"
            onClick={prevItem}
            style={{ cursor: 'w-resize' }}
          />

          {/* Right Navigation Overlay with inline cursor style */}
          <div
            className="absolute top-0 right-0 h-full w-1/2"
            onClick={nextItem}
            style={{ cursor: 'e-resize' }}
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
          // If the hide prop is true, skip rendering this item
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
