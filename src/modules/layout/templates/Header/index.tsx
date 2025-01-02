'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ReactDOM from 'react-dom';

// Import from your project
import ThemeSwitcher from '@/modules/common/templates/ThemeSwitcher';
import { Logo } from '@/modules/layout/components/Logo';
import { SOCIAL_URLS, CTA_SOCIAL_PLATFORM } from '@/config';
import { SocialIcon } from '@/modules/common/components/SocialIcon';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';

// Import icons from lucide-react
import { Menu, X, Search } from 'lucide-react';

const ctaLabels: Record<SocialPlatform, string> = {
  twitter: 'Follow me',
  instagram: 'Follow me',
  github: 'Source',
  linkedin: 'Connect',
  youtube: 'Subscribe',
  email: 'Email me',
  strava: 'Follow me',
  reddit: 'Join me',
  tiktok: 'Follow me',
};

const urlMapping: Record<SocialPlatform, string> = {
  github: SOCIAL_URLS.github,
  twitter: SOCIAL_URLS.twitter,
  linkedin: SOCIAL_URLS.linkedin,
  reddit: SOCIAL_URLS.reddit,
  strava: SOCIAL_URLS.strava,
  email: `mailto:${SOCIAL_URLS.email}`,
  instagram: SOCIAL_URLS.instagram,
  tiktok: SOCIAL_URLS.tiktok,
  youtube: SOCIAL_URLS.youtube,
};

export default function Header() {
  const pathname = usePathname();

  // Ensure CTA_SOCIAL_PLATFORM is cast to SocialPlatform
  const ctaPlatform = CTA_SOCIAL_PLATFORM as SocialPlatform;
  const ctaUrl = urlMapping[ctaPlatform];
  const ctaLabel = ctaLabels[ctaPlatform];

  // Track scroll direction (up or down) to hide/show header
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');

  // Track whether mobile menu is open
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function onScroll() {
      const currentScrollY = window.scrollY;

      // If near or at the top (<=10), always show the header
      if (currentScrollY <= 10) {
        setScrollDir('up');
      } else {
        // Only update if user scrolled more than 10px up/down
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;

        if (currentScrollY > lastScrollY) {
          setScrollDir('down'); // user scrolling down
        } else {
          setScrollDir('up'); // user scrolling up
        }
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Utility to check if the link is active
  const isActive = (route: string) => pathname === route;

  // Toggle the mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        bg-[#000]/80 backdrop-blur-sm
        h-16
        transition-transform duration-300 ease-in-out
        ${scrollDir === 'down' ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      {/* Centered container: max-w-2xl */}
      <div className="mx-auto max-w-2xl w-full">
        <nav
          className="
            flex items-center w-full
            px-4 py-4
            md:px-6 md:py-3
            relative
          "
        >
          {/* Left: Logo + Mobile icons in the same row */}
          <div className="flex items-center justify-between w-full md:w-auto z-[999]">
            {/* Logo */}
            <Logo />

            {/* Mobile icons (search + menu) */}
            <div className="md:hidden flex items-center gap-1">
              {/* Search icon (mobile) */}
              <button
                className="p-2"
                onClick={() => console.log('Search clicked (mobile)')}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Menu icon */}
              <button
                className="p-2"
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Center: Nav Items (hidden on mobile) */}
          <div className="flex-1 justify-center items-center gap-4 hidden md:flex">
            <NavLink href="/" active={isActive('/')}>
              Blog
            </NavLink>
            <NavLink href="/projects" active={isActive('/projects')}>
              Projects
            </NavLink>
            <NavLink href="/about" active={isActive('/about')}>
              About
            </NavLink>
          </div>

          {/* Right: Desktop icons (search + theme switcher + CTA) */}
          <div className="shrink-0 hidden md:flex items-center gap-3">
            {/* Search icon (desktop) */}
            <button
              className="p-2"
              onClick={() => console.log('Search clicked (desktop)')}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <ThemeSwitcher />

            {ctaUrl && ctaLabel && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-xs
                  inline-flex font-mono items-center
                  hover:bg-gray-200 dark:hover:bg-[#313131]
                  active:bg-gray-300 dark:active:bg-[#242424]
                  p-2 rounded-sm
                  transition-[background-color]
                  whitespace-nowrap
                "
              >
                <SocialIcon
                  platform={ctaPlatform}
                  width="16"
                  height="16"
                  className="mr-2"
                />
                {ctaLabel}
              </a>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation: render via Portal */}
      {menuOpen && (
        <MobileMenuOverlay
          isActive={isActive}
          ctaUrl={ctaUrl}
          ctaLabel={ctaLabel}
          toggleMenu={toggleMenu}
        />
      )}
    </header>
  );
}

/** NavLink: Desktop links, text-xs */
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        inline-flex font-mono items-center
        hover:bg-gray-200 dark:hover:bg-[#313131]
        active:bg-gray-300 dark:active:bg-[#242424]
        rounded-sm px-3 py-2
        text-xs
        transition-[background-color]
        ${active ? 'text-[#DA65FB]' : ''}
      `}
    >
      {children}
    </Link>
  );
}

/**
 * MobileMenuOverlay: Fullscreen overlay using React Portal
 * with nav links in text-xl plus optional CTA & theme switcher.
 */
function MobileMenuOverlay({
  isActive,
  ctaUrl,
  ctaLabel,
  toggleMenu,
}: {
  isActive: (r: string) => boolean;
  ctaUrl: string | undefined;
  ctaLabel: string | undefined;
  toggleMenu: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof document === 'undefined' || !mounted) {
    return null; // SSR or not yet mounted
  }

  return ReactDOM.createPortal(
    <div
      className="
        fixed inset-0
        flex flex-col
        bg-black/70
        backdrop-blur
        z-50
        p-4
      "
    >
      {/* X (Close) button (lucide-react) */}
      <button
        className="
          absolute top-4 right-4
          text-white
          p-2
          bg-gray-700/50
          rounded
          hover:bg-gray-600
        "
        onClick={toggleMenu}
        aria-label="Close mobile menu"
      >
        <X size={20} />
      </button>

      {/* Align items top-left: items-start, left-aligned text: w-full text-left */}
      <div className="flex flex-col items-start mt-10 w-full space-y-2">
        <NavLinkMobile href="/" active={isActive('/')} onClick={toggleMenu}>
          Blog
        </NavLinkMobile>
        <NavLinkMobile
          href="/projects"
          active={isActive('/projects')}
          onClick={toggleMenu}
        >
          Projects
        </NavLinkMobile>
        <NavLinkMobile
          href="/about"
          active={isActive('/about')}
          onClick={toggleMenu}
        >
          About
        </NavLinkMobile>

        {/* Theme switcher & CTA inside menu, if desired */}
        <div className="mt-6 flex items-center gap-3">
          {/* Search icon (mobile overlay) */}
          <button
            className="p-2 text-white bg-gray-700/50 hover:bg-gray-600 rounded"
            onClick={() => console.log('Search clicked (mobile overlay)')}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <ThemeSwitcher />
        </div>

        {ctaUrl && ctaLabel && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-4 text-xl
              inline-flex font-mono items-center
              hover:bg-gray-200 dark:hover:bg-[#313131]
              active:bg-gray-300 dark:active:bg-[#242424]
              p-2 rounded-sm
              transition-[background-color]
              whitespace-nowrap
              text-left
            "
            onClick={toggleMenu}
          >
            <SocialIcon
              platform={CTA_SOCIAL_PLATFORM as SocialPlatform}
              width="20"
              height="20"
              className="mr-2"
            />
            {ctaLabel}
          </a>
        )}
      </div>
    </div>,
    document.body, // Portal target
  );
}

/** NavLinkMobile: Mobile links, text-xl, left-aligned */
function NavLinkMobile({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        inline-flex font-mono items-center
        text-xl
        hover:bg-gray-200 dark:hover:bg-[#313131]
        active:bg-gray-300 dark:active:bg-[#242424]
        rounded-sm px-4 py-2
        transition-[background-color]
        w-full text-left
        ${active ? 'text-[#DA65FB]' : 'text-white'}
      `}
    >
      {children}
    </Link>
  );
}
