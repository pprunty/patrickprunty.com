import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ROW_DELAY = 30;
export const SCRAMBLE_SPEED = 27;
export const SCRAMBLED_LETTER_COUNT = 5;

export const getAnimationDuration = (text: string) => {
  return Math.min((text.length - SCRAMBLED_LETTER_COUNT) * SCRAMBLE_SPEED, 100);
};

export function normalizeMedia(
  media: unknown[],
): { type: 'image' | 'video' | 'youtube'; src: string }[] {
  if (!Array.isArray(media)) return [];
  return media.map((m) => {
    if (typeof m === 'string') return { type: 'image' as const, src: m };
    if (
      typeof m === 'object' &&
      m !== null &&
      'type' in m &&
      'src' in m &&
      typeof (m as { type?: unknown }).type === 'string' &&
      typeof (m as { src?: unknown }).src === 'string'
    ) {
      const type = (m as { type: string }).type;
      const src = (m as { src: string }).src;
      if (['image', 'video', 'youtube'].includes(type))
        return { type, src } as {
          type: 'image' | 'video' | 'youtube';
          src: string;
        };
      return { type: 'image' as const, src };
    }
    return { type: 'image' as const, src: '' };
  });
}
