'use client';

import { useState } from 'react';
import ScrambleIn from './scramble-in';
import ScrambleCombined from './scramble-combined';
import { motion } from 'framer-motion';
import {
  getAnimationDuration,
  SCRAMBLE_SPEED,
  SCRAMBLED_LETTER_COUNT,
} from '@/lib/utils';
import LoadingSpinner from './loading';

export default function Newsletter({ delay = 0 }: { delay?: number }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [showScrambledPlaceholder, setShowScrambledPlaceholder] =
    useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        setStatus('success');
        setEmail('');

        // Reset status after success
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-row gap-4 lowercase w-full"
    >
      <div className="relative w-full flex items-center">
        <div className="relative flex w-full items-center">
          <input
            type="email"
            value={email}
            placeholder={showScrambledPlaceholder ? '' : 'enter your email'}
            aria-label="Enter your email address to subscribe to the newsletter"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent focus:outline-none pb-[1.5vw] sm:pb-1.5 md:pb-2 w-full placeholder:text-muted-foreground text-[#00C853] dark:text-[#00C853]"
            required
          />
          {showScrambledPlaceholder && email.length === 0 && (
            <div className="absolute top-0 left-0  pointer-events-none overflow-hidden">
              <ScrambleIn
                delay={delay}
                scrambleSpeed={SCRAMBLE_SPEED}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                className="w-full truncate text-muted-foreground"
                scrambledClassName="text-muted-foreground"
                onComplete={() => setShowScrambledPlaceholder(false)}
              >
                enter your email
              </ScrambleIn>
            </div>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="self-start w-20 sm:w-36 md:w-64 text-right sm:text-right flex items-center justify-end"
            aria-label="subscribe"
          >
            {status === 'loading' ? (
              <LoadingSpinner />
            ) : status === 'success' ? (
              <p>done ✓</p>
            ) : status === 'error' ? (
              <p className="text-destructive">error ⚠</p>
            ) : (
              <ScrambleCombined
                delay={
                  showScrambledPlaceholder
                    ? delay + getAnimationDuration('enter your email')
                    : 0
                }
                scrambleSpeed={SCRAMBLE_SPEED}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
              >
                <span className="inline-flex items-center gap-1 font-light text-muted-foreground">
                  <span>subscribe</span>
                  <span aria-hidden="true">⍈</span>
                </span>
              </ScrambleCombined>
            )}
          </button>
        </div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 border-t-[0.5vw] sm:border-t-[1.5px] md:border-t-2 border-solid border-foreground"
          initial={{
            scaleX: 1,
            width: '0%',
            filter: 'drop-shadow(0 0 0px transparent)',
          }}
          animate={{
            scaleX: 1,
            width: '100%',
            filter: [
              'drop-shadow(0 0 0px transparent)',
              'drop-shadow(0 0 8px hsl(var(--foreground) / 0.3))',
              'drop-shadow(0 0 4px hsl(var(--foreground) / 0.2))',
              'drop-shadow(0 0 0px transparent)',
            ],
          }}
          transition={{
            delay: delay / 1000,
            duration: 0.8,
            type: 'spring',
            bounce: 0,
            filter: {
              duration: 1.2,
              times: [0, 0.3, 0.7, 1],
              ease: 'easeInOut',
            },
          }}
        />
      </div>
    </form>
  );
}
