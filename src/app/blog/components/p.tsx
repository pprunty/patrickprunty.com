import { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
  className?: string;
}

export function P({ children, className = '' }: PProps) {
  return (
    <p
      className={`my-3 leading-relaxed text-[17px] sm:text-base text-muted-foreground [blockquote_&]:my-2 ${className}`}
    >
      {children}
    </p>
  );
}
