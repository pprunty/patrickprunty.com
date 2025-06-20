'use client';

import { useEffect, useState } from 'react';

interface LastVisitorData {
  lastLocation: string;
  lastTimestamp: number | null;
}

const LastVisitor: React.FC = () => {
  const [uniqueViewers, setUniqueViewers] = useState<number | null>(null);
  const [lastVisitor, setLastVisitor] = useState<LastVisitorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both unique viewers and last visitor data
        const [viewersResponse, lastVisitorResponse] = await Promise.all([
          fetch('/api/viewers?path=/'),
          fetch('/api/last-visitor'),
        ]);

        const viewersData = await viewersResponse.json();
        const lastVisitorData = await lastVisitorResponse.json();

        setUniqueViewers(viewersData.count);
        setLastVisitor(lastVisitorData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setUniqueViewers(0);
        setLastVisitor({ lastLocation: 'Unknown', lastTimestamp: null });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <span className="text-muted-foreground text-[15px]">Loading...</span>
    );
  }

  const showLocation =
    lastVisitor?.lastLocation && lastVisitor.lastLocation !== 'Unknown';
  const showUniqueViewers = uniqueViewers !== null && uniqueViewers > 0;

  return (
    <span className="text-muted-foreground text-[15px]">
      {showLocation && (
        <>
          Last visitor from {lastVisitor.lastLocation}
          {showUniqueViewers && <br />}
        </>
      )}
      {showUniqueViewers && <>(Unique viewers: {uniqueViewers})</>}
      {!showLocation && !showUniqueViewers && <>No visitor data available</>}
    </span>
  );
};

export default LastVisitor;
