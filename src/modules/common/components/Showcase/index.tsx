'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@/modules/common/components/Grid';
import Carousel from '@/modules/common/components/Carousel';

interface ShowcaseProps {
  items: React.ReactNode[];
}

// Assume "desktop" (Grid) on server, then switch if window < 768
const Showcase: React.FC<ShowcaseProps> = ({ items }) => {
  const [isCarousel, setIsCarousel] = useState(false);

  useEffect(() => {
    // Runs on the client after hydration
    const handleResize = () => {
      setIsCarousel(window.innerWidth < 768);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isCarousel) {
    return <Carousel items={items} itemClassName="max-w-[75vw] sm:max-w-sm" />;
  } else {
    return (
      <Grid columns={1} gap="gap-4 py-2">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-lg">
            {item}
          </div>
        ))}
      </Grid>
    );
  }
};

export default React.memo(Showcase);
