'use client';

import { useState, useCallback, useRef, memo, useEffect } from 'react';

interface MemoizedVideoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export const MemoizedVideo = memo(function MemoizedVideo({
  src,
  alt,
  width,
  height,
  className = '',
}: MemoizedVideoProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const openModal = useCallback(() => {
    scrollPositionRef.current = window.scrollY || window.pageYOffset;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';

    window.scrollTo({
      top: scrollPositionRef.current,
      behavior: 'instant',
    });

    // Pause the video when closing the modal
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, closeModal]);

  return (
    <>
      <video
        src={src}
        width={width}
        height={height}
        className={`cursor-pointer ${className}`}
        autoPlay
        playsInline
        muted
        loop
        onClick={openModal}
      >
        Your browser does not support the video tag.
      </video>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#fcfcfc]/45 backdrop-blur-lg dark:bg-[#222222]/45 flex justify-center items-center z-50 transition-colors duration-300">
          <div
            ref={modalRef}
            className="relative w-full h-full flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={src}
              className="max-w-full max-h-full"
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 dark:bg-[#333] dark:text-white bg-black border dark:border-[#4B4B4B] text-white p-2 px-6 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
});
