'use client';

import React, { useState, useEffect } from 'react';
import Grid from './grid';
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

// No props needed since images are imported directly
type PhotoGridProps = Record<string, never>;

const PhotoGrid: React.FC<PhotoGridProps> = () => {
  const [columns, setColumns] = useState(2); // Default to 2 columns

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        // lg breakpoint
        setColumns(3);
      } else {
        setColumns(2);
      }
    };

    // Initialize columns on component mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the number of full rows and adjust the images array
  const fullRows = Math.floor(photographyImages.length / columns);
  const numImagesToDisplay = fullRows * columns;
  const imagesToDisplay = photographyImages.slice(0, numImagesToDisplay);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 py-4 relative z-10">
      {imagesToDisplay.map((src, index) => (
        <div key={index} className="relative h-full">
          <MemoizedImage
            src={src}
            alt={`Photo ${index + 1}`}
            width={600}
            height={600}
            className="object-cover w-full h-full"
            // other props
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(PhotoGrid);
