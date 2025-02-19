import { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
  className?: string;
}

export function P({ children, className = '' }: PProps) {
  return (
    <p className={`my-5 text-md text-[#646464] dark:text-[#B4B4B4] [blockquote_&]:my-2 ${className}`}>
      {children}
    </p>
  );
}
