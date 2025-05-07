'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AUTHOR } from '@/config';
import { useRef } from 'react';

export function Logo() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const logoRef = useRef(null);

  return (
    <span
      ref={logoRef}
      className="text-md md:text-xl whitespace-nowrap font-bold transition-colors"
    >
      <Link
        href="/"
        className={`hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] p-2 rounded-sm -ml-2 transition-[background-color] ${
          isHome ? 'text-foreground' : 'text-muted-foreground hover:text-black dark:hover:text-white'
        }`}
      >
        {AUTHOR.name}
      </Link>
    </span>
  );
}
