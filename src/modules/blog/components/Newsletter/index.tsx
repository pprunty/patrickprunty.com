// components/Newsletter.tsx

'use client';

import React from 'react';
import Subscribe from '@/modules/blog/components/Subscribe'; // Adjust the import path based on your project structure

const Newsletter: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Newsletter
        </h2>
        {/* Description */}
        <p className="text-gray-600 max-w-md dark:text-gray-300 mb-8 max-w-[320px] text-[17px]">
          No spam, just quality 500-word content. Unsubscribe at any time.
        </p>
        {/* Subscribe Form */}
        <Subscribe />
      </div>
    </section>
  );
};

export default Newsletter;
