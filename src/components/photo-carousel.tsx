'use client';

import { useState, useEffect, useRef } from 'react';
import { MemoizedImage } from './memoized-image';
import type { StaticImageData } from 'next/image';

// Import all photography images directly
import photo1 from '../../public/photography/0a94d7f5-834a-4567-86db-93f1ce8dc3ca.webp';
import photo2 from '../../public/photography/232afccf-fb3e-443d-af60-c1c67a6189d0.webp';
import photo3 from '../../public/photography/2add6d50-7a3e-4142-9707-b3d7d0e8ed7e.webp';
import photo4 from '../../public/photography/2d8324a2-e783-47d8-aa1c-3891e7a8b541.webp';
import photo5 from '../../public/photography/3cf5f5a9-843c-44e2-9482-45c765a84d30.webp';
import photo6 from '../../public/photography/60a53698-deec-4b91-94a8-5513e534c24a.webp';
import photo7 from '../../public/photography/62b1ca5f-d849-41a7-a83e-42ca04b3b47c.webp';
import photo8 from '../../public/photography/9977ee3f-d4bd-4ce6-a57c-04397898b222.webp';
import photo9 from '../../public/photography/IMG_3572.webp';
import photo10 from '../../public/photography/IMG_4648.webp';
import photo11 from '../../public/photography/IMG_5905.webp';
import photo12 from '../../public/images/me.jpg';
import photo13 from '../../public/photography/c57ad8ca-ee1e-4d3d-a9f6-9b0222e211da.webp';
import photo14 from '../../public/photography/IMG_6798.webp';
import photo15 from '../../public/photography/IMG_7848.webp';
import photo16 from '../../public/photography/IMG_7218.webp';
import photo17 from '../../public/photography/IMG_7462.webp';
import photo18 from '../../public/photography/IMG_6023.webp';
import photo19 from '../../public/photography/IMG_5870.webp';
import photo20 from '../../public/photography/e5aas16nxgable8qdg1i.webp';
import photo21 from '../../public/photography/IMG_8311.webp';

// Define the photography images array
const photographyImages: StaticImageData[] = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
  photo11,
  photo12,
  photo13,
  photo14,
  photo15,
  photo16,
  photo17,
  photo18,
  photo19,
  photo20,
  photo21,
];

interface PhotoCarouselProps {
  className?: string;
}

export default function PhotoCarousel({ className = '' }: PhotoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms = 10) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: unknown, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const handleScroll = () => {
      const currentPosition = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.clientWidth;
      const scrollWidth = scrollContainer.scrollWidth;
      setScrollPosition(currentPosition);
      setMaxScroll(Math.max(0, scrollWidth - containerWidth));
    };
    const debouncedHandleScroll = debounce(handleScroll, 10);
    handleScroll();
    scrollContainer.addEventListener('scroll', debouncedHandleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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

  return (
    <div className={`${className}`}>
      {/* Desktop: Grid layout - hidden on mobile */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {photographyImages.map((photo, index) => {
            const shouldAnimate = true;
            return (
              <div key={index} className="aspect-[3/4] overflow-hidden">
                <MemoizedImage
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                  animate={shouldAnimate}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Carousel - hidden on desktop */}
      <div className="block xl:hidden">
        {/* Photo carousel */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide py-2 -mx-4"
          style={{ scrollSnapType: 'none' }}
        >
          <div className="flex gap-2 px-4">
            {photographyImages.map((photo, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-48 h-72 overflow-hidden relative${index === photographyImages.length - 1 ? ' pr-4' : ''}`}
              >
                <MemoizedImage
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%' }}
                  animate={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom scroll indicator - mobile only */}
        {maxScroll > 0 && (
          <div className="relative h-1 w-full bg-secondary-hover rounded mt-2">
            <div
              className="absolute h-full bg-muted-foreground rounded transition-all duration-300 ease-out"
              style={{
                width: scrollIndicatorWidth,
                left: scrollIndicatorPosition,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
