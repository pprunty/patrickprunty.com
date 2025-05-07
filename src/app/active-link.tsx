'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Client component for active link highlighting
export default function ActiveLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBlogActive = pathname === href;

  return (
    <Link
      href={href}
      prefetch={true}
      className={`inline-flex font-mono items-center rounded-sm p-2 transition-colors ${
        isBlogActive
          ? 'sm:bg-gray-200 sm:dark:bg-[#313131] text-black dark:text-white sm:text-muted-foreground font-bold'
          : 'text-muted-foreground hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] hover:text-black dark:hover:text-white sm:hover:text-current sm:dark:hover:text-current'
      }`}
    >
      {children}
    </Link>
  );
}
