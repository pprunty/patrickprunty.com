'use client';

import React, { useState, useEffect } from 'react';
import { AUTHOR } from '@/config';
import { Share } from 'lucide-react'; // Import Share icon from lucide-react

interface ShareButtonProps {
  message?: string; // Optional prop for the share message
}

const ShareButton: React.FC<ShareButtonProps> = ({
  message = `Check out ${AUTHOR.name}'s blog post: `,
}) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  const isDesktopDevice = () => window.innerWidth >= 1024;

  const handleShare = async () => {
    const text = message; // Use the provided message or default value
    if (isDesktopDevice()) {
      setIsNotificationVisible(true);
      setTimeout(() => setIsNotificationVisible(false), 2000);
    }
    if (navigator.share && !isDesktopDevice()) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        if (!isDesktopDevice()) {
          setIsNotificationVisible(true);
          setTimeout(() => setIsNotificationVisible(false), 2000);
        }
      } catch (error) {
        console.error('Failed to copy URL:', error);
        alert('Failed to copy URL. Please copy it manually: ' + url);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="inline-flex items-center font-mono hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-sm p-2 transition-[background-color]"
        aria-label="Share"
      >
        <Share
          width={20} // Adjust size if necessary
          height={20}
          className="text-current" // Ensure it inherits text color for theme
          aria-hidden="true" // Accessibility improvement
        />
      </button>

      <div
        className={`fixed top-0 left-0 right-0 mx-auto transform mt-2 w-full max-w-2xl h-10 text-center py-2 text-sm z-50
          transition-opacity duration-500 ease-in-out ${isNotificationVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}
          bg-black dark:bg-white text-white dark:text-black`}
      >
        <p className="m-0">Link copied</p>
      </div>
    </>
  );
};

export default ShareButton;
