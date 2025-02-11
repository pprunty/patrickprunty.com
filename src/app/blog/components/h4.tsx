import { ReactNode } from 'react';
import { withHeadingId } from './utils';

interface HeadingProps {
  children: ReactNode; // Ensures children can be any valid React element
  classname?: string;
}

export function H4({ children, classname = '' }: HeadingProps) {
  return (
    <h4 className={`group font-semibold text-md my-8 relative ${classname}`}>
      {withHeadingId(children)}
    </h4>
  );
}
