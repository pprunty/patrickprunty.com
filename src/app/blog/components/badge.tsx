import { ReactNode } from 'react';
import { Check } from '@phosphor-icons/react/dist/ssr';

interface BadgeProps {
  className?: string;
}

export function Badge({ className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium my-1 bg-green-100 text-green-800 ml-2 ${className}`}
    >
      <Check size={12} weight="bold" />
      READ
    </span>
  );
}
