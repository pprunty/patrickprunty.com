'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';

interface PhotoGridProps {
  images: string[];
}

const PhotoGrid: React.FC<PhotoGridProps> = React.memo(({ images }) => {
  const [columns, setColumns] = useState(2);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 1024) {
        setColumns(3);
      } else {
        setColumns(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMediaLoaded(false);
    setShowSpinner(true);
  }, []);

  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [activeIndex]);

  const nextItem = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  const prevItem = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const closeModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex !== null) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveIndex(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeIndex]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    },
    [],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.changedTouches.length !== 1) return;
      const threshold = 50;
      if (
        touchStartX.current !== null &&
        touchEndX.current !== null &&
        touchStartY.current !== null &&
        touchEndY.current !== null
      ) {
        const deltaX = touchStartX.current - touchEndX.current;
        const deltaY = touchStartY.current - touchEndY.current;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > threshold) {
            nextItem();
          } else if (deltaX < -threshold) {
            prevItem();
          }
        } else {
          if (deltaY > threshold) {
            nextItem();
          } else if (deltaY < -threshold) {
            prevItem();
          }
        }
      }
      touchStartX.current = null;
      touchEndX.current = null;
      touchStartY.current = null;
      touchEndY.current = null;
    },
    [nextItem, prevItem],
  );

  const fullRows = Math.floor(images.length / columns);
  const numImagesToDisplay = fullRows * columns;
  const imagesToDisplay = images.slice(0, numImagesToDisplay);

  const modalOverlay = useMemo(() => {
    const hiddenClass = activeIndex === null ? 'hidden' : '';

    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45 ${hiddenClass}`}
        onClick={() => setActiveIndex(null)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {activeIndex !== null && (
            <>
              {showSpinner && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ClipLoader color="#888888" size={20} />
                </div>
              )}
              <Image
                src={images[activeIndex] || '/placeholder.svg'}
                alt={`Photo ${activeIndex + 1}`}
                width={800}
                height={600}
                unoptimized
                quality={100}
                onLoad={() => {
                  setMediaLoaded(true);
                  setShowSpinner(false);
                }}
                className={`object-contain w-full md:w-auto h-auto md:h-full ${!mediaLoaded ? 'invisible' : ''}`}
                priority
              />
            </>
          )}

          <button
            onClick={closeModal}
            className="absolute bottom-4 left-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full z-10"
          >
            Close
          </button>

          {activeIndex !== null && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextItem();
              }}
              className="absolute bottom-4 right-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full z-10"
            >
              {activeIndex + 1}/{images.length}
            </button>
          )}

          {!isMobile && (
            <>
              <div
                className="absolute top-0 left-0 h-full w-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  prevItem();
                }}
                style={{ cursor: 'w-resize' }}
              />
              <div
                className="absolute top-0 right-0 h-full w-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  nextItem();
                }}
                style={{ cursor: 'e-resize' }}
              />
            </>
          )}
        </div>
      </div>
    );
  }, [
    activeIndex,
    images,
    nextItem,
    prevItem,
    closeModal,
    mediaLoaded,
    showSpinner,
    isMobile,
    handleTouchEnd,
    handleTouchStart,
    handleTouchMove,
  ]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 py-4">
        {imagesToDisplay.map((src, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={src || '/placeholder.svg'}
              alt={`Photo ${index + 1}`}
              width={600}
              height={600}
              className="object-cover cursor-pointer"
              onClick={() => setActiveIndex(index)}
              unoptimized={false}
            />
          </div>
        ))}
      </div>
      {modalOverlay}
    </>
  );
});

PhotoGrid.displayName = 'PhotoGrid';

export default PhotoGrid;
