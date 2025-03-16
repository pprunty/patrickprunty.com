'use client';

import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface SubscribeProps {
  redisApiEndpoint?: string;
}

const Subscribe: React.FC<SubscribeProps> = ({
  redisApiEndpoint = '/api/subscribe',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [showSubscribedMessage, setShowSubscribedMessage] =
    useState<boolean>(false);

  // Check if user is already subscribed when component mounts
  useEffect(() => {
    const subscriptionStatus = localStorage.getItem('isSubscribed');
    if (subscriptionStatus === 'true') {
      setIsSubscribed(true);
      // We don't show the message on initial load, only after submission
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Email cannot be empty.');
      return;
    }

    setLoading(true);
    setMessage('');
    setFadeOut(false);
    setShowSubscribedMessage(false); // Reset the message visibility

    try {
      const response = await fetch(redisApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.alreadySubscribed) {
        setMessage('You are already subscribed!');
        setIsSubscribed(true);
        setShowSubscribedMessage(false); // Message is shown in the regular message area
      } else {
        setMessage('Thank you for subscribing!');
        setEmail('');
        setIsSubscribed(true);
        setShowSubscribedMessage(false); // Message is shown in the regular message area
      }

      localStorage.setItem('isSubscribed', 'true');
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);

      // Clear the message after 5 seconds with fade-out effect
      setTimeout(() => setFadeOut(true), 4000);
      setTimeout(() => {
        setMessage('');
        // Only show the persistent subscribed message after form submission
        // and after the temporary message fades out
        if (isSubscribed) {
          setShowSubscribedMessage(true);
        }
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="
              w-full
              px-4
              py-2
              rounded-lg
              text-md
              border
              border-border
              bg-input
              text-foreground
              placeholder-muted-foreground/60
              focus:outline-none
              focus:ring-1
              focus:ring-ring
              disabled:opacity-70
              transition-colors
            "
          />
          <button
            type="submit"
            disabled={loading}
            className="
              px-4
              py-2
              bg-primary
              text-primary-foreground
              hover:bg-primary-hover
              rounded-lg
              text-sm
              font-semibold
              border
              border-primary
              transition-colors
              whitespace-nowrap
              disabled:opacity-70
              min-w-[100px]
              flex
              justify-center
              items-center
            "
          >
            {loading ? (
              <ClipLoader size={15} color="currentColor" />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
        {message && (
          <p
            className={`
              ${
                message.includes('Thank you') ||
                message.includes('already subscribed')
                  ? 'text-action'
                  : 'text-destructive'
              } text-sm transition-opacity duration-1000 ease-out
              ${fadeOut ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {message}
          </p>
        )}
        {isSubscribed && !message && showSubscribedMessage && (
          <p className="text-action text-sm">You are already subscribed!</p>
        )}
      </form>
    </div>
  );
};

export default Subscribe;
