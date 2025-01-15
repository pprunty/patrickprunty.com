'use client';

import React, { useState } from 'react';

interface InfoWithTooltipProps {
  message: string;
}

const InfoWithTooltip: React.FC<InfoWithTooltipProps> = ({ message }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => setTooltipVisible(true);
  const handleMouseLeave = () => setTooltipVisible(false);

  return (
    <div className="relative">
      <button
        onClick={() => setTooltipVisible(!isTooltipVisible)} // Toggle on click
        onMouseEnter={handleMouseEnter} // Show on hover
        onMouseLeave={handleMouseLeave} // Hide when hover ends
        className="flex items-center justify-center pt-1 w-4 h-4"
        aria-label="Info"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          className="
            w-4 h-4
            cursor-pointer
            text-[#555] dark:text-[#999]
            transition-colors duration-200
            hover:text-gray-900 dark:hover:text-white
            active:text-gray-900 active:hover:text-white
          "
          fill="currentColor"
        >
          <path d="M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24S39.3,2,26,2z M26,14.1c1.7,0,3,1.3,3,3s-1.3,3-3,3 s-3-1.3-3-3S24.3,14.1,26,14.1z M31,35.1c0,0.5-0.4,0.9-1,0.9h-3c-0.4,0-3,0-3,0h-2c-0.5,0-1-0.3-1-0.9v-2c0-0.5,0.4-1.1,1-1.1l0,0 c0.5,0,1-0.3,1-0.9v-4c0-0.5-0.4-1.1-1-1.1l0,0c-0.5,0-1-0.3-1-0.9v-2c0-0.5,0.4-1.1,1-1.1h6c0.5,0,1,0.5,1,1.1v8 c0,0.5,0.4,0.9,1,0.9l0,0c0.5,0,1,0.5,1,1.1V35.1z" />
        </svg>
      </button>
      {isTooltipVisible && (
        <div
          className={`absolute left-8 top-0 z-10 px-4 py-2 text-sm text-black dark:text-white bg-white dark:bg-[#1c1c1c] rounded-lg shadow-xl border dark:border-[#444] transition-transform duration-300 max-w-[200px] min-w-[160px] sm:min-w-[180px] sm:max-w-[220px] ${
            isTooltipVisible ? 'animate-modalShow' : ''
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default InfoWithTooltip;
