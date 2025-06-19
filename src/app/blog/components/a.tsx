import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface AProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
}

export function A({ children, className = '', href, ...props }: AProps) {
  // Check if the link is external (starts with http:// or https:// and is not a local domain)
  const isExternalLink = /^https?:\/\/(?!localhost)(?!.*\.local$)/.test(href);

  // If the href starts with "#", render an <a> tag (for internal anchor links)
  if (href.startsWith('#')) {
    return (
      <a
        href={href}
        className={`text-[17px] sm:text-base no-after font-normal text-primary underline decoration-wavy underline-offset-4 decoration-muted hover:decoration-primary hover:text-primary active:decoration-primary active:text-primary ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  } else if (isExternalLink) {
    // For external links, render an <a> tag with target="_blank" and rel attributes
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-[17px] sm:text-base no-after font-normal text-primary underline decoration-wavy underline-offset-4 decoration-muted hover:decoration-primary hover:text-primary active:decoration-primary active:text-primary ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  } else {
    // For internal links, render the Next.js <Link> component
    return (
      <Link
        href={href}
        className={`text-[17px] sm:text-base no-after font-normal text-primary underline decoration-wavy underline-offset-4 decoration-muted hover:decoration-primary hover:text-primary active:decoration-primary active:text-primary ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }
}
