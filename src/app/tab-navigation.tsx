'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const tabs = [
  { path: '/', label: 'About', exact: true },
  { path: '/blog', label: 'Blog', exact: false },
];

export const TabNavigation = () => {
  const pathname = usePathname();
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) =>
      tab.exact ? pathname === tab.path : pathname.startsWith(tab.path),
    );
    if (activeTabIndex === -1) return;

    const activeTab = tabRefs.current[activeTabIndex];
    if (activeTab) {
      setUnderlineStyle({
        left: activeTab.offsetLeft,
        width: activeTab.clientWidth,
      });
    }
  }, [pathname]);

  // Move the conditional return **after** hooks
  if (pathname.startsWith('/blog/')) {
    return null;
  }

  return (
    <nav className="relative my-6">
      <ul className="flex relative">
        {tabs.map((tab, index) => {
          const isActive = tab.exact
            ? pathname === tab.path
            : pathname.startsWith(tab.path);
          return (
            <li
              key={tab.path}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className="list-none"
            >
              <Link
                href={tab.path}
                className={`block px-4 py-2 transition-colors duration-200 ${
                  isActive
                    ? 'dark:text-[#EEEEEE] text-[#111111]'
                    : 'text-[#646464] dark:text-[#787878]'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div
        className="absolute bottom-0 h-0.5 dark:bg-[#EEEEEE] bg-[#111111] transition-all ease-in-out duration-200"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </nav>
  );
};
