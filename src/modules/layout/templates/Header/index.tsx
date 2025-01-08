import Link from 'next/link';
import ThemeSwitcher from '@/modules/common/templates/ThemeSwitcher';
import { Logo } from '@/modules/layout/components/Logo';
import React from 'react';
import { SOCIAL_URLS, CTA_SOCIAL_PLATFORM } from '@/config';
import { SocialIcon } from '@/modules/common/components/SocialIcon';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';

// Create mappings for labels and URLs
const ctaLabels: Record<SocialPlatform, string> = {
  twitter: 'Follow me',
  instagram: 'Follow me',
  github: 'Source',
  linkedin: 'Connect',
  youtube: 'Subscribe',
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
};

export default function Header() {
  // Ensure CTA_SOCIAL_PLATFORM is cast to SocialPlatform
  const ctaPlatform = CTA_SOCIAL_PLATFORM as SocialPlatform;
  const ctaUrl = urlMapping[ctaPlatform];
  const ctaLabel = ctaLabels[ctaPlatform];

  return (
    <header className="flex mb-5 md:mb-10 items-center">
      <nav className="flex justify-between items-center w-full">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Right: Navbar Links */}
        <div className="flex items-center text-xs gap-2 sm:gap-4">
          <ThemeSwitcher />

          <Link
            href="/about"
            className="inline-flex font-mono items-center hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-sm p-2 transition-[background-color]"
          >
            About
          </Link>

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
                className="mr-2"
              />
              {ctaLabel}
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
