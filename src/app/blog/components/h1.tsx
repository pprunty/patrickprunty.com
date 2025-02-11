import { withHeadingId } from './utils';
import type { ReactNode } from 'react';

interface H1Props {
  children?: ReactNode;
}

// Refactored H1 component using StyledH1
export function H1({ children }: H1Props) {
  return (
    <h1 className="text-2xl font-semibold mt-2 mb-1 dark:text-gray-100">
      {withHeadingId(children)}
    </h1>
  );
}
