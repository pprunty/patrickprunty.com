'use client';

import { useEffect, useState } from 'react';
import {
  getViewCount,
  incrementViewCount,
} from '@/__samwise/utils/fetchViewCount'; // Adjust your imports

interface ViewCounterProps {
  id: string;
  defaultValue: number;
  incrementOnMount?: boolean;
}

const ViewCounter: React.FC<ViewCounterProps> = ({
  id,
  defaultValue,
  incrementOnMount = false,
}) => {
  const [views, setViews] = useState<number>(defaultValue);

  useEffect(() => {
    async function fetchViews() {
      const count = await getViewCount(id);
      setViews(count);
    }

    fetchViews();

    if (incrementOnMount && process.env.NODE_ENV !== 'development') {
      incrementViewCount(id).then((newCount) => setViews(newCount));
    }
  }, [id, incrementOnMount]);

  return <span>{views.toLocaleString()} views</span>;
};

export default ViewCounter;
