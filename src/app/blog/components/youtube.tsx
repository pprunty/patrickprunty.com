'use client';

import React, { useEffect, useRef } from 'react';

interface YouTubeProps {
  videoId: string;
  className?: string;
  autoplay?: boolean;
}

export function YouTube({
  videoId,
  className = '',
  autoplay = false,
}: YouTubeProps) {
  console.log(
    'YouTube component rendering with videoId:',
    videoId,
    'autoplay:',
    autoplay,
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Force iframe visibility after mounting
    if (iframeRef.current) {
      console.log('YouTube iframe DOM element:', iframeRef.current);

      // Apply inline styles to ensure visibility
      iframeRef.current.style.display = 'block';
      iframeRef.current.style.opacity = '1';
      iframeRef.current.style.visibility = 'visible';
      iframeRef.current.style.zIndex = '100';
    }
  }, [videoId]);

  // Construct YouTube URL with appropriate parameters
  const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&rel=0&modestbranding=1`;

  return (
    <div
      className={`w-full aspect-video relative ${className}`}
      style={{ minHeight: '300px', zIndex: 70 }}
    >
      <iframe
        ref={iframeRef}
        src={youtubeUrl}
        title={`YouTube Video ${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
        style={{
          display: 'block',
          opacity: 1,
          visibility: 'visible',
          zIndex: 100,
        }}
      />
    </div>
  );
}
