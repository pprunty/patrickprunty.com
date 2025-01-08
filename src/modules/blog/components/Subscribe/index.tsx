'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface SubscribeProps {
  scriptUrl?: string;
}

const Subscribe: React.FC<SubscribeProps> = ({
  scriptUrl = 'https://script.google.com/macros/s/AKfycbxYXBP_GiOutJgd6hSkO2_PGXOrRNd7yQV066B7Sq3iOCE7nKFgO-mr7gQwy9BhKZNI/exec',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref: intersectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Email cannot be empty.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      setMessage('Thank you for subscribing!');
      localStorage.setItem('isSubscribed', 'true');
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={intersectionRef} className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <input
            ref={inputRef}
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={`
             w-full
                  px-4
                  py-2
                  rounded-md
                  text-md
                  sm:text-sm
                  border
                  border-black
                  dark:border-[#555]
                  dark:active:border-[#fcfcfc]
                  bg-[#F5F5F5]
                  dark:bg-[#1c1c1c]
                  dark:text-[#fcfcfc]
                  text-[#0F0F0F]
             rounded-l-md
             focus:outline-none
             focus:ring-1
             focus:ring-[#fff]
             dark:focus:ring-[#fff]
             transition-colors

           `}
          />
          <button
            type="submit"
            disabled={loading}
            className="
    absolute
    top-0
    right-0
    h-full
    px-4
    py-1
    bg-[#444]
    text-white
    rounded-r-md
    text-sm
    hover:bg-[#000]       // Hover color for light mode
    dark:bg-[#444]        // Background for dark mode
    dark:hover:bg-[#555] // Hover color for dark mode
    transition-colors
  "
          >
            {loading ? 'Loading...' : 'Subscribe'}
          </button>
        </div>
        {message && (
          <p
            className={
              message.includes('Thank you')
                ? 'text-green-600 text-sm'
                : 'text-red-600 text-sm'
            }
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Subscribe;
