'use client';

import React from 'react';
import Image from 'next/image';
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

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media, title }) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Check if the media is a video (.mp4 or .mov)
  const isVideo = (src: string) =>
    src.endsWith('.mp4') || src.endsWith('.mov');

  // Navigate to the next media item
  const nextItem = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % media.length);
  };

  // Navigate to the previous media item
  const prevItem = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + media.length) % media.length);
  };

  const closeModal = () => {
    setActiveIndex(null);
  };

  // Listen for Esc key to close modal when active
  React.useEffect(() => {
    if (activeIndex !== null) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeIndex]);

  // Prevent background scrolling and close modal on scroll when active
  React.useEffect(() => {
    if (activeIndex !== null) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';

      // Close modal on any scroll event
      const handleScroll = () => {
        closeModal();
      };
      window.addEventListener('scroll', handleScroll);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [activeIndex]);

  // Carousel content: both images and videos are clickable to open modal
  const carouselContent =
    media.length > 1 ? (
      <div className="my-2 sm:mx-0">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex gap-2 sm:px-0">
            {media.map((src, idx) => (
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
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="my-2 sm:mx-0">
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

  return (
    <>
      {carouselContent}

      {/* Modal Overlay */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45">
          <div className="relative w-full h-full flex items-center justify-center">
            {isVideo(media[activeIndex]) ? (
              <video
                src={media[activeIndex]}
                autoPlay
                muted
                playsInline
                loop
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
                quality={100} // Full quality when modal is active
                className="object-contain w-full md:w-auto h-auto md:h-full"
                priority
              />
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

            {/* Left Navigation Overlay */}
            <div
              className="absolute top-0 left-0 h-full w-1/2 nav-left"
              onClick={prevItem}
            />

            {/* Right Navigation Overlay */}
            <div
              className="absolute top-0 right-0 h-full w-1/2 nav-right"
              onClick={nextItem}
            />
          </div>
        </div>
      )}

      {/* Custom styles for dynamic cursors */}
      <style jsx>{`
        .nav-left {
          cursor: pointer;
        }
        .nav-right {
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .nav-left {
            cursor: w-resize;
          }
          .nav-right {
            cursor: e-resize;
          }
        }
      `}</style>
    </>
  );
};

const Section: React.FC<SectionProps> = ({ sectionName, items }) => {
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
                        target={item.url.startsWith('https://') ? '_blank' : '_self'}
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
};

export default Section;
