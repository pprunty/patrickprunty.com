'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import OptimizedImage from '@/modules/common/components/OptimizedImage';
import DraftLabel from '@/modules/blog/components/DraftLabel';

/**
 * Minimal pointer-detection hook
 * Returns true if the device likely uses a "coarse" pointer (mobile/touch).
 */
function useCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  return isCoarse;
}

interface BlogPostProps {
  post: BlogPostType;
  index: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const router = useRouter();
  const isCoarse = useCoarsePointer();

  // For mobile only: track whether overlay is visible after first tap
  const [overlayVisible, setOverlayVisible] = useState(false);

  // On desktop: overlay is shown only when hovered => group-hover classes
  // On mobile: overlay appears after first tap
  const showOverlayMobile = isCoarse && overlayVisible;

  // Click logic
  const handleClick = () => {
    if (!isCoarse) {
      // Desktop: single click => navigate
      router.push(`/blog/${post.slug}`);
    } else {
      // Mobile: if overlay not visible, show it; else navigate
      if (!overlayVisible) {
        setOverlayVisible(true);
      } else {
        router.push(`/blog/${post.slug}`);
      }
    }
  };

  return (
    <div
      // Occupy full parent space (w-full h-full), with rounded corners
      className={`
        relative
        w-full h-full
        rounded-md
        overflow-hidden
        cursor-pointer
        group
        /* Remove border */
      `}
      onClick={handleClick}
    >
      {post.draft && <DraftLabel />}

      {/* Main image with zoom on hover or active */}
      <OptimizedImage
        src={post.image}
        alt={post.title || 'Blog post image'}
        className={`
          w-full h-full
          object-cover
          transition-transform duration-300
          group-hover:scale-105    /* Zoom on desktop hover */
          active:scale-105         /* Also zoom on mobile press */
        `}
      />

      {/*
        Overlay:
        - Desktop: hidden unless hovered
        - Mobile: visible if showOverlayMobile (after first tap)
      */}
      <div
        className={`
          absolute inset-0
          bg-black/60
          text-white
          flex flex-col
          p-3
          transition-opacity duration-300
          ${
            isCoarse
              ? showOverlayMobile
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
              : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
          }
        `}
      >
        {/* Title: bigger (text-2xl), top-left, left-aligned */}
        <h3
          className="
            absolute top-3 left-3
            text-left
            text-2xl font-semibold
            leading-tight
            pr-4       /* optional padding on right if you like */
          "
        >
          {post.title}
        </h3>

        {/* Centered description in the middle */}
        {post.description && (
          <p
            className="
              flex-1
              flex items-center justify-center
              text-center
              px-2
              text-[17px]
            "
          >
            {post.description}
          </p>
        )}

        {/* Date in bottom-right, text-xs, font-mono */}
        {post.date && (
          <span
            className="
              absolute bottom-3 right-3
              text-xs font-mono
              opacity-90
            "
          >
            {post.date}
          </span>
        )}

        {/* Mobile: after first tap, show 'tap again' message */}
        {isCoarse && !overlayVisible && (
          <p
            className="
              absolute bottom-3 left-3
              text-xs italic
              text-gray-200
            "
          >
            Tap again to read blog post
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
