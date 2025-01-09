'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const showTooltip = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setTimeout(showTooltip, delay);
    },
    [delay, showTooltip],
  );

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
          }}
          role="tooltip"
        >
          {content}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
    </div>
  );
};

export { Tooltip };
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => children;
export const TooltipTrigger: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const TooltipContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
