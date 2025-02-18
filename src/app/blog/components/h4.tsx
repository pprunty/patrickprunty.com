import { ReactNode } from 'react';
import { withHeadingId } from './utils';

interface HeadingProps {
  children: ReactNode; // Ensures children can be any valid React element
  classname?: string;
}

export function H4({ children, classname = '' }: HeadingProps) {
  return (
    <h4 className={`font-medium text-md relative ${classname}`}>
      {withHeadingId(children)}
    </h4>
  );
}
