'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Tooltip } from '@/components/tooltip';
import ExternalLink from '@/components/external-link';
import { routes, type RouteItem } from '@/routes';

const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();

  const renderNavItem = (route: RouteItem) => {
    const { href, label, icon: Icon, external } = route;
    const isActive =
      !external && (pathname === href || pathname.startsWith(href + '/'));
    const LinkComponent = external ? ExternalLink : Link;

    return (
      <Tooltip
        key={href}
        content={label}
        position="right"
        showArrow={false}
        spacing={-10}
      >
        <LinkComponent
          href={href}
          className={`
          flex items-center justify-center
          px-5 py-2
          transition-colors duration-300
          ${isActive ? 'text-foreground' : 'text-muted-foreground'}
          ${external ? 'hover:no-underline hover:text-foreground' : 'hover:text-foreground'}
        `}
        >
          <Icon className="w-6 h-6" weight={isActive ? 'fill' : 'regular'} />
        </LinkComponent>
      </Tooltip>
    );
  };

  return (
    <nav
      className="
        hidden md:flex
        flex-col
        items-center
        h-screen
        w-16
        fixed
        top-0
        left-0
        border-r border-r-border
        bg-background
        py-4
        z-[1000]
      "
    >
      {/* Top: Logo section */}
      <div>
        <Logo showName={false} />
      </div>

      {/* Middle: main nav icons - Added gap-y-4 to control vertical spacing */}
      <div className="flex flex-col flex-1 justify-center items-center gap-y-4">
        {routes.filter((route) => !route.hide).map(renderNavItem)}
      </div>

      {/* Bottom: Additional components */}
      <div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
