'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog Roll', href: '/blog' },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block w-full">
        <div className="pt-4 p-6 sm:px-2">
          <div className="z-[100] max-w-xl pt-0 m-auto text-pretty sm:px-5">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-light">Patrick Prunty</h1>
              <nav className="flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm hover:text-primary transition-colors ${
                      pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Just the chevron */}
      <div className="md:hidden fixed top-4 right-4 z-[9999]">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
          aria-label="Toggle menu"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[9998] bg-background/80"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute top-16 right-4">
            <nav className="p-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm hover:text-primary transition-colors ${
                      pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;