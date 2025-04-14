'use client';

import React from 'react';
import Subscribe from './subscribe'; // Adjust the import path based on your project structure

interface NewsletterProps {
  title?: string;
  subtitle?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
  title = 'Join the Journey',
  subtitle = "Like what you're reading? Subscribe to get notified when I publish new posts.",
}) => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-card rounded-xl border border-border">
      <div className="max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
        {/* Heading */}
        <h2 className="text-2xl font-bold tracking-tight mb-3">{title}</h2>
        {/* Description */}
        <p className="max-w-md mb-8 max-w-[320px] text-base">{subtitle}</p>
        {/* Subscribe Form */}
        <Subscribe />
      </div>
    </section>
  );
};

export default Newsletter;
