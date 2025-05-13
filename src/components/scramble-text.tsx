'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useScramble, type UseScrambleProps } from 'use-scramble';
import { cn } from '@/lib/utils';

// Extend the UseScrambleProps type to include the 'characters' property
interface ExtendedScrambleProps extends UseScrambleProps {
  characters?: string;
}

interface ScrambleTextProps {
  text: string;
  /**
   * Controls the speed of the scramble effect.
   * Lower values = faster animation (e.g. 20 is very fast, 200 is slow)
   * Recommended range: 20-200
   */
  scrambleSpeed?: number;
  /**
   * Number of letters that will be scrambled at once
   */
  scrambledLetterCount?: number;
  className?: string;
  scrambledClassName?: string;
  autoStart?: boolean;
  useIntersectionObserver?: boolean;
  retriggerOnIntersection?: boolean;
  intersectionThreshold?: number;
  intersectionRootMargin?: string;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface ScrambleTextHandle {
  start: () => void;
  reset: () => void;
}

const ScrambleText = forwardRef<ScrambleTextHandle, ScrambleTextProps>(
  (
    {
      text,
      scrambleSpeed = 80,
      scrambledLetterCount = 2,
      className = '',
      scrambledClassName = '',
      autoStart = true,
      useIntersectionObserver = false,
      retriggerOnIntersection = false,
      intersectionThreshold = 0.3,
      intersectionRootMargin = '0px',
      onStart,
      onComplete,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const hasCompletedOnce = useRef(false);

    // Define default characters for scrambling
    const defaultCharacters = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

    // The useScramble library expects speed as a direct millisecond value
    // Lower values = faster animation
    const { ref: scrambleRef, replay } = useScramble({
      text,
      speed: scrambleSpeed, // Pass the raw value directly
      tick: scrambledLetterCount,
      step: 1,
      scramble: scrambledLetterCount,
      playOnMount: autoStart && !useIntersectionObserver,
      onAnimationStart: onStart,
      onAnimationEnd: () => {
        hasCompletedOnce.current = true;
        onComplete?.();
      },
      overdrive: false, // Disable underscore characters
      characters: defaultCharacters, // Use the default characters
    } as ExtendedScrambleProps); // Use our extended type

    useImperativeHandle(ref, () => ({
      start: () => replay(),
      reset: () => {
        // Reset internal state
        hasCompletedOnce.current = false;
        // Replay the animation
        replay();
      },
    }));

    // Handle Intersection Observer
    useEffect(() => {
      if (!useIntersectionObserver || !containerRef.current) return;

      const observerOptions = {
        root: null,
        rootMargin: intersectionRootMargin,
        threshold: intersectionThreshold,
      };

      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasCompletedOnce.current || retriggerOnIntersection) {
              replay();
            }

            // If not set to retrigger, unobserve after first animation
            if (!retriggerOnIntersection) {
              observer.unobserve(entry.target);
            }
          }
        });
      };

      const observer = new IntersectionObserver(
        handleIntersection,
        observerOptions,
      );

      const currentElement = containerRef.current;
      observer.observe(currentElement);

      return () => {
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      };
    }, [
      useIntersectionObserver,
      retriggerOnIntersection,
      intersectionThreshold,
      intersectionRootMargin,
      replay,
    ]);

    return (
      <>
        <span className="sr-only">{text}</span>
        <span
          ref={containerRef}
          className={cn('inline-block whitespace-pre-wrap', className)}
          aria-hidden="true"
        >
          <span ref={scrambleRef} className={scrambledClassName} />
        </span>
      </>
    );
  },
);

ScrambleText.displayName = 'ScrambleText';
export default ScrambleText;
