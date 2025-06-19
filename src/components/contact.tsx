import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

const contacts = [
  {
    label: 'patrickprunty.business@gmail.com',
    href: 'mailto:patrickprunty.business@gmail.com',
  },
  {
    label: 'X',
    href: 'https://x.com/intent/follow?screen_name=pprunty_&original_referer=https://patrickprunty.com/',
  },
  {
    label: 'Substack',
    href: 'https://pprunty.substack.com/',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/pprunty',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/patrickprunty/',
  },
  {
    label: 'Strava',
    href: 'https://www.strava.com/athletes/72636452',
  },
];

const Contact: React.FC = () => (
  <div className="flex flex-wrap items-center gap-x-2 gap-y-2 py-4">
    {contacts.map((contact) => (
      <a
        key={contact.label}
        href={contact.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center rounded-full bg-[#f0f0f0] dark:bg-[#333] px-3 py-1 text-[15px] font-medium text-primary transition-colors hover:bg-[#e8e8e8] dark:hover:bg-[#404040] active:bg-[#e0e0e0] dark:active:bg-[#4a4a4a] no-after"
      >
        {contact.label}
        <ArrowUpRight
          size={14}
          weight="bold"
          className="ml-1 text-muted-foreground"
        />
      </a>
    ))}
  </div>
);

export default Contact;
