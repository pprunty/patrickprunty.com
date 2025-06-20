'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image, { type ImageProps } from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import SkeletonLoader from './skeleton-loader';

interface MemoizedImageProps extends Omit<ImageProps, 'onClick'> {
  focusable?: boolean;
  className?: string;
  animate?: boolean;
}

export const MemoizedImage = React.memo(function MemoizedImage({
  src,
  alt = 'Image',
  width,
  height,
  priority,
  loading = 'lazy',
  focusable = true,
  fill,
  sizes,
  quality,
  className = '',
  animate = true,
  unoptimized = false,
  ...rest
}: MemoizedImageProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isImageReady, setImageReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollPositionRef = useRef(0);
  const imageRef = useRef<HTMLSpanElement>(null);
  const modalRef = useRef<HTMLSpanElement>(null);
  const hasIntersectedRef = useRef(false);

  const openModal = useCallback(() => {
    if (focusable) {
      scrollPositionRef.current = window.scrollY;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';

      setModalOpen(true);
    }
  }, [focusable]);

  const closeModal = useCallback(() => {
    setModalOpen(false);

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';

    window.scrollTo({
      top: scrollPositionRef.current,
      behavior: 'instant',
    });
  }, []);

  useEffect(() => {
    // Add escape key handler
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    if (!animate) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasIntersectedRef.current) {
          setImageLoaded(true);
          hasIntersectedRef.current = true;
          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 0.1,
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [animate]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants for framer-motion
  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <span
        ref={imageRef}
        className={`overflow-hidden relative ${focusable ? 'cursor-pointer' : ''}`}
        onClick={openModal}
      >
        {!isImageReady && (
          <SkeletonLoader width={width} height={height} className={className} />
        )}
        {animate ? (
          <motion.div
            initial="hidden"
            animate={isImageLoaded ? 'visible' : 'hidden'}
            variants={imageVariants}
            style={{ display: isImageReady ? 'block' : 'none' }}
          >
            <Image
              src={src || '/placeholder.svg'}
              alt={alt}
              width={width}
              height={height}
              quality={quality}
              className={className}
              priority={priority}
              loading={loading}
              fill={fill}
              sizes={sizes}
              unoptimized={unoptimized}
              onLoad={() => setImageReady(true)}
              {...rest}
            />
          </motion.div>
        ) : (
          <Image
            src={src || '/placeholder.svg'}
            alt={alt}
            width={width}
            height={height}
            quality={quality}
            className={className}
            priority={priority}
            loading={loading}
            fill={fill}
            sizes={sizes}
            unoptimized={unoptimized}
            onLoad={() => setImageReady(true)}
            style={{ display: isImageReady ? 'block' : 'none' }}
            {...rest}
          />
        )}
      </span>

      {isModalOpen &&
        isMounted &&
        createPortal(
          <span
            className="fixed inset-0 bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45 flex justify-center items-center z-[9999] transition-colors duration-300 modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <span
              ref={modalRef}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                src={src || '/placeholder.svg'}
                alt={alt}
                width={width}
                quality={quality}
                height={height}
                className="cursor-pointer image-click-animate object-contain max-h-full max-w-full w-auto h-auto md:h-full md:w-auto"
                priority={true}
                loading="eager"
                unoptimized={unoptimized}
                {...rest}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="absolute top-4 right-4 text-foreground hover:text-muted-foreground p-2 rounded-full z-[200] transition-colors duration-200"
                aria-label="Close"
              >
                <X size={20} weight="bold" />
              </button>
            </span>
          </span>,
          document.body,
        )}
    </>
  );
});
