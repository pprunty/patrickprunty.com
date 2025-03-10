import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface AProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
}

export function A({ children, className = '', href, ...props }: AProps) {
  // If the href starts with "#", render an <a> tag (for internal anchor links)
  if (href.startsWith('#')) {
    return (
      <a
        href={href}
        className={`border-b border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-[#EEEEEE] text-[#000] dark:border-gray-500 dark:hover:border-white ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  } else {
    // For other links, render the Next.js <Link> component
    return (
      <Link
        href={href}
        className={`border-b border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white text-black dark:border-gray-500 dark:hover:border-white ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }
}
