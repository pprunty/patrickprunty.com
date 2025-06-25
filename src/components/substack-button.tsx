import React from 'react';
import { Button } from '@/components/ui/button';

interface SubstackButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const SubstackLogo = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="mr-2"
  >
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

const SubstackButton: React.FC<SubstackButtonProps> = ({
  href = 'https://furrycircuits.substack.com/',
  children = 'Subscribe on Substack',
  className = '',
  ...props
}) => {
  if (href) {
    return (
      <Button
        asChild
        className={`bg-primary text-primary-foreground hover:bg-[#232323] dark:bg-[#f0f0f0] dark:text-[#161616] dark:hover:bg-[#e0e0e0] active:bg-[#292929] dark:active:bg-[#d6d6d6] border-0 ${className}`}
        {...props}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="no-after"
        >
          <SubstackLogo />
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      className={`bg-primary text-primary-foreground hover:bg-[#232323] dark:bg-[#f0f0f0] dark:text-[#161616] dark:hover:bg-[#e0e0e0] active:bg-[#292929] dark:active:bg-[#d6d6d6] border-0 ${className}`}
      {...props}
    >
      <SubstackLogo />
      {children}
    </Button>
  );
};

export default SubstackButton;
