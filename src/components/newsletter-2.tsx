'use client';

import React from 'react';
import Subscribe from './subscribe'; // Fix casing to match actual filename

const Newsletter2: React.FC = () => {
  return (
    <div className="relative w-full h-auto">
      {/* Background Image */}
      <img
        src="/images/manet2.webp"
        alt="Newsletter Background"
        className="w-full h-auto object-cover object-top"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-between sm:p-3">
        {/* Top Left Header */}
        <div className="self-start">
          <h1 className="font-script text-2xl sm:text-5xl text-black/80">
            The Weekly Stand-Up
          </h1>
          <h2 className="text-lg sm:text-2xl text-black/70 mt-2">
            Discover. Inspire. Create.
          </h2>
        </div>

        {/* Bottom Right Subscribe Component */}
        <div className="self-end w-full max-w-md">
          <Subscribe
            inputClassName="bg-white/20 backdrop-blur-sm border-none"
            stackButtonOnMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Newsletter2;
