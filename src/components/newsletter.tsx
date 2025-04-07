// components/Newsletter.tsx

'use client';

import React from 'react';
import Subscribe from './subscribe'; // Adjust the import path based on your project structure

const Newsletter: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-card rounded-2xl">
      <div className="max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
        {/* Description */}
        <p className="max-w-md mb-8 max-w-[320px] text-base">
          Like what you&apos;re reading? Subscribe to get notified when I
          publish new posts.
        </p>
        {/* Subscribe Form */}
        <Subscribe />
      </div>
    </section>
  );
};

export default Newsletter;
