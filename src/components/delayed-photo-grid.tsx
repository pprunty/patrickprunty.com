'use client';

import React, { useState, useEffect } from 'react';
import PhotoGrid from './photo-grid';

interface DelayedPhotoGridProps {
  delay?: number;
}

const DelayedPhotoGrid: React.FC<DelayedPhotoGridProps> = ({ delay = 800 }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return null;
  }

  return <PhotoGrid />;
};

export default DelayedPhotoGrid;
