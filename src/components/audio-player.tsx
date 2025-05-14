'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from '@phosphor-icons/react';

interface AudioPlayerProps {
  slug: string;
}

export default function AudioPlayer({ slug }: AudioPlayerProps) {
  const [audioExists, setAudioExists] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if audio file exists
  useEffect(() => {
    const checkAudioExists = async () => {
      try {
        const response = await fetch(`/audio/${slug}.mp3`, { method: 'HEAD' });
        setAudioExists(response.ok);
      } catch (error) {
        console.error('Error checking audio file:', error);
        setAudioExists(false);
      }
    };

    checkAudioExists();
  }, [slug]);

  useEffect(() => {
    // Create audio element
    if (audioExists && !audioRef.current) {
      audioRef.current = new Audio(`/audio/${slug}.mp3`);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', () =>
          setIsPlaying(false),
        );
      }
    };
  }, [audioExists, slug]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  if (!audioExists) return null;

  return (
    <div className="flex items-center">
      <button
        onClick={togglePlay}
        className="flex items-center justify-center rounded-full w-10 h-10 bg-border hover:bg-border/70 transition-colors"
        aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
      >
        {isPlaying ? (
          <Pause weight="fill" className="text-muted-foreground" size={20} />
        ) : (
          <Play weight="fill" className="text-muted-foreground" size={20} />
        )}
      </button>
    </div>
  );
}
