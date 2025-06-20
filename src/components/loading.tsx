'use client';

import { useState, useEffect } from 'react';

export default function LoadingSpinner() {
  const [loadingIcon, setLoadingIcon] = useState('◴');

  useEffect(() => {
    const icons = ['◴', '◷', '◶', '◵'];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % icons.length;
      setLoadingIcon(icons[i]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <span>{loadingIcon}</span>;
}
