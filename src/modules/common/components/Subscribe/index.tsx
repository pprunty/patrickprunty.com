'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface SubscribeProps {
  // Optionally pass down a scriptUrl if you want
  scriptUrl?: string;
}

const Subscribe: React.FC<SubscribeProps> = ({
  scriptUrl = 'https://script.google.com/macros/s/XXXX/exec',
}) => {
  // Local state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1) Create ref for the input
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 2) Setup the intersection observer
  const { ref: intersectionRef, inView } = useInView({
    threshold: 0.3, // triggers when 30% of Subscribe is visible
    triggerOnce: true, // only run once
  });

  // 3) Focus the input when in view
  useEffect(() => {
    if (inView && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inView]);

  // 4) Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
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

      // With 'no-cors', we can't read the response, so assume success
      setMessage('Thank you for subscribing!');
      // Optionally store subscription status
      localStorage.setItem('isSubscribed', 'true');
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Attach intersectionRef to a parent container you want to watch
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
            className="
              w-full
              pr-[100px]
              px-4
              py-2
              bg-gray-100
              text-gray-800
              placeholder-gray-400
              rounded-l-md
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400
            "
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
              bg-blue-600
              text-white
              rounded-r-md
              text-sm
              hover:bg-blue-700
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
