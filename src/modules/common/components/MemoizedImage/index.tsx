'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface MemoizedImageProps extends Omit<ImageProps, 'onClick'> {
  focusable?: boolean;
  className?: string;
  uniqueId: string | number; // Unique identifier for shared layout animations
}

export const MemoizedImage = React.memo(function MemoizedImage({
  src,
  alt = 'Image',
  id,
  width,
  height,
  priority,
  loading = 'lazy',
  focusable = true,
  fill,
  sizes,
  quality,
  className = '',
  uniqueId,
  ...rest
}: MemoizedImageProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after the component mounts on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    if (focusable) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Create a unique layoutId for the shared element animation
  const layoutId = `shared-image-${uniqueId}`;

  return (
    <>
      {/* Grid Image */}
      <motion.span
        className={`overflow-hidden ${focusable ? 'cursor-pointer' : ''}`}
        onClick={openModal}
        layoutId={`shared-image-container-${uniqueId}`}
      >
        <motion.div
          layoutId={layoutId}
          transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            quality={quality}
            className={className}
            priority={priority}
            loading={loading}
            fill={fill}
            sizes={sizes}
            {...rest}
          />
        </motion.div>
      </motion.span>

      {/* Focused Modal Image rendered in a Portal after mount */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 flex justify-center items-center"
                onClick={closeModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 1000 }} // Ensures the modal is above the grid
              >
                <motion.div
                  layoutId={layoutId}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                  }}
                  style={{ cursor: 'pointer' }}
                  transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    quality={quality}
                    className=""
                    priority={true}
                    {...rest}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
});
