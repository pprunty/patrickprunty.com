import type { ReactNode } from 'react';

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-5 text-sm text-gray-600 dark:text-[#999999] pl-3 border-l-4 dark:border-[#999999] ">
      {children}
    </blockquote>
  );
}
