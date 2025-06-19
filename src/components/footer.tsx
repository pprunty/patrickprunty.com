import React from 'react';
import ThemeSwitcher from '@/components/theme-switcher';

const Footer: React.FC = () => (
  <footer className="mt-12 flex w-full items-end justify-between text-[15px] gap-2 pb-8 mb-2">
    <div>
      <div className="text-primary">
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
      <div className="text-muted-foreground">Last visit from Ben Arous, TN</div>
    </div>
    <div className="flex flex-col items-end gap-1">
      <ThemeSwitcher />
      <div className="text-muted-foreground text-right">
        © 2025 Patrick Prunty
      </div>
    </div>
  </footer>
);

export default Footer;
