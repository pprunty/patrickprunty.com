import Balancer from 'react-wrap-balancer';
import type { ReactNode } from 'react';

interface CaptionProps {
  children: ReactNode;
  large?: boolean;
}

export function Caption({ children, large = false }: CaptionProps) {
  return (
    <span
      className={`block w-full font-mono ${
        large
          ? 'text-[13px] text-gray-500 dark:text-[#b0b0b0]'
          : 'text-xs text-gray-700 dark:text-[#999999]'
      } my-3 text-center leading-normal`}
    >
      <Balancer>
        <span className="[&>a]:post-link">{children}</span>
      </Balancer>
    </span>
  );
}
