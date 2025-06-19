import React from 'react';
import ThemeSwitcher from '@/components/theme-switcher';
import LastVisitor from '@/components/last-visitor';

const Footer: React.FC = () => (
  <footer className="mt-12 flex flex-col sm:flex-row w-full items-start sm:items-end justify-between text-[15px] gap-4 sm:gap-2 pb-8 mb-2">
    {/* Left side: Theme switcher and "Built with" */}
    <div className="flex flex-col gap-1">
      <div className="max-w-xs pb-2 mb-2 sm:pb-0 sm:mb-0">
        <ThemeSwitcher />
      </div>
      <div>
        <div className="text-primary text-[15px]">
          Built with{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Next.js
          </a>
        </div>
        <div>
          <LastVisitor />
        </div>
      </div>
    </div>

    {/* Right side: Copyright */}
    <div className="text-muted-foreground text-left sm:text-right flex items-end justify-start sm:justify-end text-[15px]">
      © 2025 Patrick Prunty
    </div>
  </footer>
);

export default Footer;
