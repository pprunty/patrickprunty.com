'use client';

import React, { useEffect, useRef } from 'react';

interface YouTubeProps {
  videoId: string;
  className?: string;
  autoplay?: boolean;
}

// Define minimal types for YT API
interface YTPlayer {
  destroy: () => void;
  setPlaybackQuality: (quality: string) => void;
  getPlaybackQuality: () => string;
  playVideo: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          width: string;
          height: string;
          playerVars: Record<string, string | number | boolean>;
          events: {
            onReady: (event: YTPlayerEvent) => void;
          };
        },
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function YouTube({
  videoId,
  className = '',
  autoplay = false,
}: YouTubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let isMounted = true;
    let ytScript: HTMLScriptElement | null = null;

    function loadYouTubeAPI() {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
        } else {
          const existingScript = document.getElementById('youtube-iframe-api');
          if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            return;
          }
          ytScript = document.createElement('script');
          ytScript.id = 'youtube-iframe-api';
          ytScript.src = 'https://www.youtube.com/iframe_api';
          ytScript.onload = () => resolve();
          document.body.appendChild(ytScript);
        }
      });
    }

    (async () => {
      await loadYouTubeAPI();
      if (!isMounted || !containerRef.current) return;

      // Remove any previous iframe
      containerRef.current.innerHTML = '';

      window.onYouTubeIframeAPIReady = () => {
        if (!isMounted || !containerRef.current) return;
        playerRef.current = new window.YT!.Player(containerRef.current, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: YTPlayerEvent) => {
              // Try to set HD quality
              if (event.target && event.target.setPlaybackQuality) {
                event.target.setPlaybackQuality('hd1080');
                // Fallback to hd720 if hd1080 is not available
                setTimeout(() => {
                  const quality = event.target.getPlaybackQuality();
                  if (quality !== 'hd1080') {
                    event.target.setPlaybackQuality('hd720');
                  }
                }, 500);
              }
              if (autoplay) {
                event.target.playVideo();
              }
            },
          },
        });
      };
      // If API is already loaded, call immediately
      if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      }
    })();

    return () => {
      isMounted = false;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      if (ytScript) {
        ytScript.onload = null;
      }
    };
  }, [videoId, autoplay]);

  return (
    <div
      className={`w-full aspect-video relative ${className}`}
      style={{ minHeight: '300px', zIndex: 70 }}
    >
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
