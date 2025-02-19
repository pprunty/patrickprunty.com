"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const tabs = [
  { path: '/', label: 'About', exact: true },
  { path: '/blog', label: 'Writing', exact: false },
];

export const TabNavigation = () => {
  const pathname = usePathname();
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    // Find the active tab index based on the current pathname
    const activeTabIndex = tabs.findIndex((tab) =>
      tab.exact ? pathname === tab.path : pathname.startsWith(tab.path)
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

  return (
    <nav className="relative">
      <ul className="flex relative">
        {tabs.map((tab, index) => {
          const isActive = tab.exact
            ? pathname === tab.path
            : pathname.startsWith(tab.path);
          return (
            <li
              key={tab.path}
              ref={(el) => (tabRefs.current[index] = el)}
              className="list-none"
            >
              <Link
                href={tab.path}
                className={`block px-4 py-2 transition-colors duration-300 ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Underline element: a simple sliding line under the active tab */}
      <div
        className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </nav>
  );
};
