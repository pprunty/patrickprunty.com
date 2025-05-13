'use client';

import React, { useEffect, useRef, useState } from 'react';
import Subscribe from './subscribe';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface NewsletterProps {
  title?: string;
  subtitle?: string;
  animate?: boolean;
  variant?: 'default' | 'minimal';
}

const Newsletter: React.FC<NewsletterProps> = ({
  title = 'Stay Updated',
  subtitle = 'AI, web design and personal discoveries delivered weekly.',
  animate = true,
  variant = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMinimal = variant === 'minimal';

  useEffect(() => {
    if (!ref.current || !animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }, // Trigger when 50% of the element is visible
    );

    const currentRef = ref.current; // Store ref in a variable
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animate]);

  const ContentWrapper = animate ? motion.section : 'section';
  const animationProps = animate
    ? {
        initial: { opacity: 0, scale: 0.98 },
        animate: isVisible
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.98 },
        transition: {
          duration: 0.5,
          scale: { type: 'spring', bounce: 0.3, duration: 0.6 },
        },
      }
    : {};

  return (
    <ContentWrapper
      ref={ref}
      {...animationProps}
      className={`
        relative overflow-hidden
        ${
          isMinimal
            ? 'py-4 px-5 rounded-xl border border-border shadow-sm'
            : 'p-0 sm:py-6 sm:px-5 rounded-2xl border border-border shadow-sm'
        }
        text-accent-foreground dark:text-secondary-foreground bg-card
      `}
    >
      {/* Consistent vertical layout on both mobile and desktop */}
      <div className="w-full mx-auto flex flex-col items-start relative z-10">
        {/* Image - full width on both mobile and desktop, only shown in default variant */}
        {!isMinimal && (
          <div className="w-full h-[200px] sm:h-[240px] flex-shrink-0 overflow-hidden">
            <Image
              src="/images/manet.png"
              alt="Newsletter image"
              width={800}
              height={400}
              priority
              className="w-full h-full object-cover object-top sm:rounded-lg"
            />
          </div>
        )}

        {/* Content - consistent padding on all screen sizes */}
        <div
          className={`w-full flex flex-col justify-center items-start text-left ${isMinimal ? 'p-0' : 'pt-4 pb-2 sm:pb-0 px-4 md:px-0'}`}
        >
          {/* Heading - only shown in default variant */}
          {!isMinimal && <h2 className="text-4xl font-script mb-2">{title}</h2>}

          {/* Description */}
          <p
            className={`${isMinimal ? 'text-base mb-3' : 'mb-4 text-base'} text-muted-foreground`}
          >
            {subtitle}
          </p>

          {/* Subscribe Form */}
          <Subscribe
            className="w-full"
            stackButtonOnMobile={true}
            inputClassName="dark:bg-[#222] dark:border-border"
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Newsletter;
