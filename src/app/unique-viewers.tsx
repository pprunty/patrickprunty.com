'use client';

import { useEffect, useState } from 'react';

const UniqueViewers: React.FC = () => {
  const [uniqueCount, setUniqueCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/viewers');
        const data = await res.json();
        setUniqueCount(data.count);
      } catch (error) {
        console.error('Failed to fetch unique viewers:', error);
      }
    }
    fetchCount();
  }, []);

  return (
    <div className="font-mono text-xs text-[#555555] dark:text-[#B0AFB0]">
      {uniqueCount !== null ? (
        ':' + uniqueCount
      ) : (
        // Skeleton loader with pulse animation
        <span className="inline-block w-10 h-3 bg-gray-200 dark:bg-[#2F2F2F] animate-pulse rounded" />
      )}
    </div>
  );
};

export default UniqueViewers;
