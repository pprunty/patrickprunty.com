import { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
  className?: string;
}

export function P({ children, className = '' }: PProps) {
  return (
    <p
      className={`my-3 leading-relaxed text-base text-muted-foreground break-normal w-full ${className}`}
    >
      {children}
    </p>
  );
}
