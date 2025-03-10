import React from 'react';
import { ArrowSquareOut } from '@phosphor-icons/react/dist/ssr';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline text-muted-foreground hover:text-foreground inline-flex items-center space-x-1 transition-colors duration-200 ${className}`}
    >
      <span>{children}</span>
      <ArrowSquareOut className="w-3 h-3 ml-1" />
    </a>
  );
};

export default ExternalLink;
