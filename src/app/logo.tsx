'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AUTHOR } from '@/config';
import { useEffect, useRef, useState } from 'react';

export function Logo() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const logoRef = useRef<HTMLSpanElement | null>(null); // Reference for the logo element
  const [isInView, setIsInView] = useState(false); // Track if the component is in view

  // Configure whether to include subpaths ("/blog/*")
  const includeSubPaths = true; // Change to false to trigger only on "/blog"

  // Intersection Observer to track visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting); // Update state when in/out of view
      },
      { threshold: 0.1 } // Trigger when 10% of the component is in view
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => {
      if (logoRef.current) observer.unobserve(logoRef.current);
    };
  }, []);

  // Trigger animations only when component is in view and matches route
  useEffect(() => {
    const shouldTriggerAnimation = includeSubPaths
      ? pathname.startsWith('/blog') // Match "/blog" and all subpaths
      : pathname === '/blog'; // Match only "/blog"

    if (shouldTriggerAnimation && isInView) {
      // Trigger the first animation after 0.8 seconds
      const initialTimer = setTimeout(() => {
        setShouldAnimate(true); // Start animation
        setTimeout(() => setShouldAnimate(false), 1400); // Reset after the animation duration (1.2 seconds)
      }, 900);

      // Set up recurring animation every 4.3 seconds
      const interval = setInterval(() => {
        setShouldAnimate(true); // Start animation
        setTimeout(() => setShouldAnimate(false), 1400); // Reset after the animation duration (1.2 seconds)
      }, 4300); // Interval timing: 1.2 second animation + 3.1 seconds rest

      // Cleanup both the initial timer and interval
      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    } else {
      setShouldAnimate(false); // Stop animation if not on `/blog` or not in view
    }
  }, [pathname, isInView]);

  const animationClass = shouldAnimate ? 'animate-custom-pulse' : '';

  return (
    <span
      ref={logoRef} // Attach the ref to track visibility
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
