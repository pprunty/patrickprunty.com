'use client';

import React from 'react';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  aspectRatio?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  aspectRatio,
}) => {
  const style: React.CSSProperties = {
    width,
    height,
    ...(aspectRatio && { aspectRatio }),
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}
      style={style}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default SkeletonLoader;