'use client';

import { useEffect, useState } from 'react';

const LastVisitor: React.FC = () => {
  const [uniqueViewers, setUniqueViewers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniqueViewers = async () => {
      try {
        // Fetch unique viewers for the home page
        const response = await fetch('/api/viewers?path=/');
        const data = await response.json();
        setUniqueViewers(data.count);
      } catch (error) {
        console.error('Failed to fetch unique viewers:', error);
        setUniqueViewers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueViewers();
  }, []);

  if (loading) {
    return (
      <span className="text-muted-foreground text-[15px]">Loading...</span>
    );
  }

  const viewerText = uniqueViewers === 1 ? 'unique viewer' : 'unique viewers';

  return (
    <span className="text-muted-foreground text-[15px]">
      {uniqueViewers} {viewerText}
    </span>
  );
};

export default LastVisitor;
