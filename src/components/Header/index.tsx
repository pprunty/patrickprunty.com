import Link from "next/link";
import ThemeSwitcher from '@/components/ThemeSwitcher';
import {Logo} from "@/components/Logo";
import React from 'react';
import {AUTHOR} from '@/config';


export default function Header() {
  return (
    <header className="flex mb-5 md:mb-10 items-center">
        <nav className="flex justify-between items-center w-full">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Right: Navbar Links */}
          <div className="flex items-center text-xs gap-2 sm:gap-4">
            <ThemeSwitcher />

            <Link
              href="/about"
              className="inline-flex font-mono items-center hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-sm p-2 transition-[background-color]"
            >
              About
            </Link>
               <a
                      href={AUTHOR.twitterUrl}
                      target="_blank"
                      className="inline-flex font-mono hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] items-center p-2 rounded-sm transition-[background-color] whitespace-nowrap -mr-2"
                    >
                      <TweetIcon className="mr-2" /> Follow{" "}
                      <span className="hidden md:inline">&nbsp;me</span>
                    </a>
          </div>
        </nav>
      </header>
  );
}

function TweetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      {...props} // Apply props to the SVG element
    >
      <path
        fill="currentColor"
        fillRule="nonzero"
        stroke="none"
        strokeWidth={1}
        d="M8.28 20.26c7.55 0 11.68-6.26 11.68-11.67v-.53c.8-.58 1.49-1.3 2.04-2.13-.74.33-1.53.54-2.36.65.85-.5 1.5-1.32 1.8-2.28-.78.48-1.66.81-2.6 1a4.1 4.1 0 0 0-7 3.74c-3.4-.17-6.43-1.8-8.46-4.29a4.1 4.1 0 0 0 1.28 5.48c-.68-.02-1.3-.2-1.86-.5v.05a4.11 4.11 0 0 0 3.29 4.02 4 4 0 0 1-1.85.08 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.43a11.67 11.67 0 0 0 6.28 1.83"
      />
    </svg>
  );
}