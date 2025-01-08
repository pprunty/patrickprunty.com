'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@/modules/common/components/Grid';
import Carousel from '@/modules/common/components/Carousel';

interface ShowcaseProps {
  items: React.ReactNode[];
}

const Showcase: React.FC<ShowcaseProps> = ({ items }) => {
  const [isCarousel, setIsCarousel] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsCarousel(width < 768); // Use carousel for screens smaller than 768px
    };

    // Initialize layout mode on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isCarousel) {
    return <Carousel items={items} itemClassName="max-w-[75vw] sm:max-w-sm" />;
  }

  return (
    <Grid columns={1} gap="gap-4 py-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg">
          {item}
        </div>
      ))}
    </Grid>
  );
};

export default React.memo(Showcase);
