'use client';

import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import a spinner from react-spinners

interface SubscribeProps {
  scriptUrl?: string;
}

const Subscribe: React.FC<SubscribeProps> = ({
  scriptUrl = 'https://script.google.com/macros/s/AKfycbxYXBP_GiOutJgd6hSkO2_PGXOrRNd7yQV066B7Sq3iOCE7nKFgO-mr7gQwy9BhKZNI/exec',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Email cannot be empty.');
      return;
    }

    setLoading(true);
    setMessage('');
    setFadeOut(false);

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
      setEmail('');
      localStorage.setItem('isSubscribed', 'true');
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);

      // Clear the message after 5 seconds with fade-out effect
      setTimeout(() => setFadeOut(true), 4000);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-0">
        <div className="relative">
          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={`
             w-full
                  px-4
                  py-2
                  rounded-sm
                  text-md
                  sm:text-sm
                  border
                  border-[#2F2F2F2]
                  placeholder-[#646464]
                  dark:placeholder-[#787878]
                  active:border-[#555]
                  dark:border-[#555]
                  dark:active:border-[#fcfcfc]
                  bg-[#F2F2F2]
                  dark:bg-[#222222]
                  dark:text-[#B4B4B4]
                  text-[#0F0F0F]
             rounded-l-sm
             focus:outline-none
             focus:ring-1
             focus:ring-[#555]
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
             bg-[#646464]
             text-white
             rounded-r-sm
             text-sm
             hover:bg-[#444]
             dark:active:border-[#fcfcfc]
             dark:active:border-2
             dark:bg-[#444]
             dark:hover:bg-[#555]
             transition-colors
           "
            style={{ minWidth: '100px' }} // Ensure button width remains consistent
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <ClipLoader size={15} color="#fff" />
              </div>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
        {message && (
          <p
            className={`
              ${
                message.includes('Thank you')
                  ? 'text-green-600'
                  : 'text-red-600'
              } text-sm transition-opacity duration-1000 ease-out
              ${fadeOut ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Subscribe;
