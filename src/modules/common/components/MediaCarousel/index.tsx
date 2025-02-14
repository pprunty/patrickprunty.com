'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface BasicCarouselProps {
  items: React.ReactNode[];
  itemClassName?: string;
  containerClassName?: string;
}

const MediaCarousel: React.FC<BasicCarouselProps> = ({
  items,
  itemClassName = '',
  containerClassName = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  useEffect(() => {
    const handleMouseUpOutside = () => setIsDragging(false);
    document.addEventListener('mouseup', handleMouseUpOutside);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpOutside);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isDragging],
  );

  return (
    <div className={`w-full ${containerClassName}`}>
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none',
          scrollBehavior: 'auto',
          scrollSnapType: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-x-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex-shrink-0 ${itemClassName}`}
              style={{
                pointerEvents: isDragging ? 'none' : 'auto',
                scrollSnapAlign: 'none',
              }}
              onClick={handleClick}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MediaCarousel);
