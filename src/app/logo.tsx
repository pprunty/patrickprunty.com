'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AUTHOR } from '@/config';
import { useEffect, useState } from 'react';

export function Logo() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (pathname === '/blog') {
      // Trigger animation with a consistent interval
      const interval = setInterval(() => {
        setShouldAnimate(true); // Start animation
        setTimeout(() => setShouldAnimate(false), 1000); // End animation after the full duration (1 second for 2 pulses)
      }, 2200); // Repeat every 1.6 seconds (1 second animation + 0.6 second pause)

      // Cleanup the interval
      return () => clearInterval(interval);
    } else {
      setShouldAnimate(false); // Stop animation when leaving `/blog`
    }
  }, [pathname]);

  const animationClass = shouldAnimate ? 'animate-custom-pulse' : '';

  return (
    <span
      className={`text-md md:text-lg whitespace-nowrap font-bold rounded-md transition-colors ${animationClass}`}
    >
      {pathname === '/' ? (
        <span className="cursor-default">{AUTHOR.name}</span>
      ) : (
        <Link
          href="/"
          className="hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-sm transition-colors"
        >
          {AUTHOR.name}
        </Link>
      )}
    </span>
  );
}
