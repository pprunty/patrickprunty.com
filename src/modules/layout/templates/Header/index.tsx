'use client';

import { usePathname, useRouter } from 'next/navigation'; // Import from next/navigation
import ThemeSwitcher from '@/modules/common/templates/ThemeSwitcher';
import React from 'react';
import { SOCIAL_URLS, CTA_SOCIAL_PLATFORM } from '@/config';
import { SocialIcon } from '@/modules/common/components/SocialIcon';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';

// Mappings
const ctaLabels: Record<SocialPlatform, string> = {
  twitter: 'Follow me',
  instagram: 'Follow me',
  github: 'Source code',
  linkedin: 'Connect now',
  youtube: 'Subscribe now',
  strava: 'Follow me',
  reddit: 'Join me',
  patreon: 'Support me',
  tiktok: 'Follow me',
};

const urlMapping: Record<SocialPlatform, string> = {
  github: SOCIAL_URLS.github,
  twitter: SOCIAL_URLS.twitter,
  linkedin: SOCIAL_URLS.linkedin,
  reddit: SOCIAL_URLS.reddit,
  strava: SOCIAL_URLS.strava,
  instagram: SOCIAL_URLS.instagram,
  tiktok: SOCIAL_URLS.tiktok,
  youtube: SOCIAL_URLS.youtube,
  patreon: SOCIAL_URLS.patreon,
};

export default function Header() {
  const pathname = usePathname(); // Get the current path
  const router = useRouter(); // Get the router instance
  const ctaPlatform = CTA_SOCIAL_PLATFORM as SocialPlatform;
  const ctaUrl = urlMapping[ctaPlatform];
  const ctaLabel = ctaLabels[ctaPlatform];

  // Split the CTA label so we can hide extra words on mobile
  const words = ctaLabel?.split(' ') ?? [];
  const [firstWord, ...rest] = words;

  const handleNavigation = (href: string) => {
    // Check if the user is already on the current route
    if (pathname !== href) {
      router.push(href); // Navigate only if it's a different route
    }
  };

  return (
    <header className="flex mb-5 md:mb-10 items-center">
      <nav className="flex justify-between items-center w-full">
        {/* Left: Navigation Links */}
        <div className="flex items-center text-xs gap-4 sm:gap-6">
          <button
            onClick={() => handleNavigation('/about')}
            className="inline-flex font-mono hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => handleNavigation('/projects')}
            className="inline-flex font-mono hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => handleNavigation('/blog')}
            className="inline-flex font-mono hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            Blog
          </button>
        </div>

        {/* Right: Navbar Links */}
        <div className="flex items-center text-xs gap-2 sm:gap-4">
          <ThemeSwitcher />

          {/* CTA Social Icon Link */}
          {ctaUrl && ctaLabel && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-mono hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] items-center p-2 rounded-sm transition-[background-color] whitespace-nowrap -mr-2"
            >
              <SocialIcon
                platform={ctaPlatform}
                width="15"
                height="15"
                className="mr-2 text-[#1c1c1c] dark:text-[#fcfcfc]"
              />
              {/* Render first word always, additional words only on sm+ */}
              {firstWord}
              {rest.length > 0 && (
                <span className="hidden sm:inline ml-2">{rest.join(' ')}</span>
              )}
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
