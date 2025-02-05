'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoizedImageProps extends Omit<ImageProps, 'onClick'> {
  focusable?: boolean;
  className?: string;
  uniqueId: string | number; // Add a unique identifier prop
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
  uniqueId, // Receive the unique identifier
  ...rest
}: MemoizedImageProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    if (focusable) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Create a unique layoutId based on the uniqueId prop
  const layoutId = `shared-image-${uniqueId}`;

  return (
    <>
      <motion.span
        className={`overflow-hidden ${focusable ? 'cursor-pointer' : ''}`}
        onClick={openModal}
        layoutId={`shared-image-container-${uniqueId}`} // If you need a container layoutId, make it unique as well
      >
        <motion.div layoutId={layoutId}>
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

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <motion.div
              layoutId={layoutId}
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              style={{ cursor: 'pointer' }}
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
      </AnimatePresence>
    </>
  );
});
