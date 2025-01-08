'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface SubscribeProps {
  scriptUrl?: string;
}

const Subscribe: React.FC<SubscribeProps> = ({
  scriptUrl = 'https://script.google.com/macros/s/XXXX/exec',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref: intersectionRef, inView } = useInView({
    threshold: 0.3,
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
             pr-[100px]
             px-4
             py-2
             dark:bg-[#fff]
             border border-[#444] // Explicit border width and color
             dark:border-[#333]
             bg-[#0F0F0F] text-[#F3F3F3] placeholder-[#9A9A9A]
             dark:bg-[#F3F3F3] dark:text-[#1c1c1c] dark:placeholder-[#666666]
             rounded-l-md
             focus:outline-none
             focus:ring-2
             focus:ring-[#DC70FF]
             dark:focus:ring-[#C470FF]
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
              bg-[#DC70FF]
              text-white
              rounded-r-md
              text-sm
              hover:bg-[#c85ee8]
              transition-colors
              active:opacity-90
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
