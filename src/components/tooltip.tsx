'use client';

import type React from 'react';
import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  showArrow?: boolean;
  spacing?: number;
  maxWidth?: number; // Optional max width
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'right',
  showArrow = false,
  spacing = 0,
  maxWidth, // No default, will be applied only if provided
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const arrowClasses = {
    top: 'left-1/2 -translate-x-1/2',
    right: 'left-[-4px]',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
    left: 'right-[-4px]',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              ...(position === 'right' && { marginLeft: `${spacing}px` }),
              ...(position === 'left' && { marginRight: `${spacing}px` }),
              ...(position === 'top' && { marginBottom: `${spacing}px` }),
              ...(position === 'bottom' && { marginTop: `${spacing}px` }),
              ...(maxWidth && { maxWidth: `${maxWidth}px` }),
            }}
            className={`
              absolute z-[1000] px-2 py-1 text-xs font-medium
              bg-popover text-popover-foreground rounded-md shadow-lg
              w-max break-words whitespace-normal
              leading-relaxed tracking-normal
              hidden sm:block
              ${position === 'right' ? 'left-full' : ''}
              ${position === 'left' ? 'right-full' : ''}
              ${position === 'top' ? 'bottom-full' : ''}
              ${position === 'bottom' ? 'top-full' : ''}
            `}
          >
            {content}
            {showArrow && (
              <div
                className={`
                absolute w-2 h-2 bg-popover transform rotate-45
                ${arrowClasses[position]}
              `}
              ></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
