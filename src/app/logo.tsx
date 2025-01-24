'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AUTHOR } from '@/config';
import { useEffect, useState } from 'react';

export function Logo() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on all "/blog" and "/blog/*" routes
    if (pathname.startsWith('/blog')) {
      // Trigger the first animation after 0.6 seconds
      const initialTimer = setTimeout(() => {
        setShouldAnimate(true); // Start animation
        setTimeout(() => setShouldAnimate(false), 1000); // Reset after the animation duration (1 second)
      }, 600);

      // Set up recurring animation every 3.2 seconds
      const interval = setInterval(() => {
        setShouldAnimate(true); // Start animation
        setTimeout(() => setShouldAnimate(false), 1000); // Reset after the animation duration (1 second)
      }, 3200); // Interval timing: 1 second animation + 2.2 seconds rest

      // Cleanup both the initial timer and interval
      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    } else {
      setShouldAnimate(false); // Stop animation if not on `/blog/*`
    }
  }, [pathname]);

  const animationClass = shouldAnimate ? 'animate-custom-pulse' : '';

  return (
    <span
      className={`text-md md:text-lg whitespace-nowrap font-bold transition-colors ${animationClass}`}
    >
      <Link
        href="/"
        className="hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] p-2 rounded-sm -ml-2 transition-[background-color]"
      >
        {AUTHOR.name}
      </Link>
    </span>
  );
}
