'use client';

import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { useTheme } from 'next-themes'; // or your custom useTheme hook

const ThemeSwitcher = () => {
  const { setTheme, systemTheme } = useTheme();  // Removed `resolvedTheme`

  // `preference` can be null, 'dark', 'light', or undefined at initialization
  const [preference, setPreference] = useState<null | string>(null);
  const [currentTheme, setCurrentTheme] = useState<null | string>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringOverride, setIsHoveringOverride] = useState(false);

  const onMediaChange = useCallback(() => {
    const systemCurrent = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setCurrentTheme(systemCurrent);
  }, []);

  useEffect(() => {
    // Set initial theme preference based on localStorage
    setPreference(localStorage.getItem("theme"));
    const systemCurrent = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setCurrentTheme(systemCurrent);

    // Listen for system theme changes
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    matchMedia.addEventListener("change", onMediaChange);
    return () => matchMedia.removeEventListener("change", onMediaChange);
  }, [onMediaChange]);

  const toggleTheme = useCallback(() => {
    const newPreference = currentTheme === "dark" ? "light" : "dark";
    setTheme(newPreference);
    setPreference(newPreference);

    // Save preference to localStorage
    localStorage.setItem("theme", newPreference);
  }, [currentTheme, setTheme]);

  // Handle theme preference based on system theme and user preference
  useEffect(() => {
    if (preference === null) {
      setCurrentTheme(systemTheme ?? "light"); // Use "light" as a fallback if systemTheme is undefined
    } else {
      setCurrentTheme(preference);
    }
  }, [preference, systemTheme]);

  // UI for theme switching button
  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsHoveringOverride(true);
    toggleTheme();
  };

  return (
    <>
      {isHovering && (
        <span className="text-[9px] text-gray-400 hidden md:inline">
          {preference === null ? "System" : preference === "dark" ? "Dark" : "Light"}
        </span>
      )}

      <button
        aria-label="Toggle theme"
        className={`inline-flex ${isHovering && !isHoveringOverride
          ? "bg-gray-200 dark:bg-[#313131]"
          : ""
        } active:bg-gray-300 transition-[background-color] dark:active:bg-[#242424] rounded-sm p-2 bg-gray-200 dark:bg-[#313131]`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsHoveringOverride(false);
        }}
      >
        <span className="sun-icon hidden dark:inline">
          <SunIcon />
        </span>
        <span className="moon-icon inline dark:hidden">
          <MoonIcon />
        </span>
      </button>
    </>
  );
};

// Moon icon for dark mode
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 56 56" {...props}>
      <path
        d="M41.2 36.1c-12.9 0-21-7.8-21-20.3 0-3.5.7-6.7 1.6-8.3.3-.7.4-1 .4-1.5 0-.8-.7-1.7-1.7-1.7-.2 0-.7 0-1.3.3A24.5 24.5 0 004.4 27.1 23.8 23.8 0 0029 51.7c10.2 0 18.4-5.3 22.3-14.1l.3-1.4c0-1-.9-1.6-1.6-1.6a3 3 0 00-1.2.2c-2 .8-4.8 1.3-7.6 1.3zM8.1 27c0-7.3 3.8-14.3 9.9-18-.8 2-1.2 4.5-1.2 7.2 0 14.6 9 23.3 23.9 23.3 2.4 0 4.5-.2 6.4-1a20.8 20.8 0 01-18 9.6C17 48 8.1 39 8.1 27z"
        fill="currentColor"
      />
    </svg>
  );
}

// Sun icon for light mode
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 56 56" {...props}>
      <path
        d="M30 4.6c0-1-.9-2-2-2a2 2 0 00-2 2v5c0 1 .9 2 2 2s2-1 2-2zm9.6 9a2 2 0 000 2.8c.8.8 2 .8 2.9 0L46 13a2 2 0 000-2.9 2 2 0 00-3 0zm-26 2.8c.7.8 2 .8 2.8 0 .8-.7.8-2 0-2.9L13 10c-.7-.7-2-.8-2.9 0-.7.8-.7 2.1 0 3zM28 16a12 12 0 00-12 12 12 12 0 0012 12 12 12 0 0012-12 12 12 0 00-12-12zm0 3.6c4.6 0 8.4 3.8 8.4 8.4 0 4.6-3.8 8.4-8.4 8.4a8.5 8.5 0 01-8.4-8.4c0-4.6 3.8-8.4 8.4-8.4zM51.3 30c1.1 0 2-.9 2-2s-.9-2-2-2h-4.9a2 2 0 00-2 2c0 1.1 1 2 2 2zM4.7 26a2 2 0 00-2 2c0 1.1.9 2 2 2h4.9c1 0 2-.9 2-2s-1-2-2-2zm37.8 13.6a2 2 0 00-3 0 2 2 0 000 2.9l3.6 3.5a2 2 0 002.9 0c.8-.8.8-2.1 0-3zM10 43.1a2 2 0 000 2.9c.8.7 2.1.8 3 0l3.4-3.5c.8-.8.8-2.1 0-2.9-.8-.8-2-.8-2.9 0zm20 3.4c0-1.1-.9-2-2-2a2 2 0 00-2 2v4.9c0 1 .9 2 2 2s2-1 2-2z"
        fill="currentColor"
      />
    </svg>
  );
}

export default ThemeSwitcher;
