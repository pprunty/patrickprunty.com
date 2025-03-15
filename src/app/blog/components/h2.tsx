import { ReactNode } from 'react';
import { withHeadingId } from './utils';

interface HeadingProps {
  children: ReactNode; // Ensures children can be any valid React element
}

export function H2({ children }: HeadingProps) {
  return (
    <h2 className="group font-semibold text-2xl relative">
      {withHeadingId(children)}
    </h2>
  );
}
