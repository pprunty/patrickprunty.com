'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useMobile } from '@/hooks/use-mobile';

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

// Define Network Information API types
interface NetworkInformation {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
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
  const isMobile = useMobile();

  // Helper function to get optimal quality based on device and network
  const getOptimalQuality = useCallback(() => {
    // Check network conditions if available
    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (isMobile) {
      // On mobile, prefer lower quality for better performance
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          return { primary: 'small', fallback: 'medium' }; // 240p/360p
        } else if (effectiveType === '3g') {
          return { primary: 'medium', fallback: 'large' }; // 360p/480p
        }
      }
      // Default mobile: 720p with 480p fallback
      return { primary: 'hd720', fallback: 'large' };
    } else {
      // Desktop: keep existing high quality
      return { primary: 'hd1080', fallback: 'hd720' };
    }
  }, [isMobile]);

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
              // Set optimal quality based on device and network
              if (event.target && event.target.setPlaybackQuality) {
                const { primary, fallback } = getOptimalQuality();
                event.target.setPlaybackQuality(primary);

                // Fallback if primary quality is not available
                setTimeout(() => {
                  const currentQuality = event.target.getPlaybackQuality();
                  if (currentQuality !== primary) {
                    event.target.setPlaybackQuality(fallback);
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
  }, [videoId, autoplay, getOptimalQuality]);

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
