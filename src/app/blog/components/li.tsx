import { ReactNode } from 'react';

interface LIProps {
  children: ReactNode;
}

export function LI({ children }: LIProps) {
  return (
    <li
      className={`
        my-2
        text-md
        text-[#646464] dark:text-[#B4B4B4]
        [ul_&]:relative
        [ul_&]:pl-4
        [ul_&]:before:text-gray-400
        [ul_&]:before:content-['–']
        [ul_&]:before:mr-2
        [ul_&]:before:absolute
        [ul_&]:before:-ml-4
      `}
    >
      {children}
    </li>
  );
}
