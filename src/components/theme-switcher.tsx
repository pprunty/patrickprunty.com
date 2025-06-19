'use client';

import { useEffect, useLayoutEffect, useState, useCallback } from 'react';

const themeEffect = function () {
  const pref = localStorage.getItem('theme');
  if (null === pref) {
    document.documentElement.classList.add('theme-system');
  } else {
    document.documentElement.classList.remove('theme-system');
  }
  if (
    pref === 'dark' ||
    (!pref && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('pause-transitions');
    document.documentElement.classList.add('dark');
    document.head
      .querySelector('meta[name=theme-color]')
      ?.setAttribute('content', '#222222');
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('pause-transitions');
    });
    return 'dark';
  } else if (
    pref === 'light' ||
    (!pref && window.matchMedia('(prefers-color-scheme: light)').matches)
  ) {
    document.documentElement.classList.add('pause-transitions');
    document.documentElement.classList.remove('dark');
    document.head
      .querySelector('meta[name=theme-color]')
      ?.setAttribute('content', '#F5F5F5');
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('pause-transitions');
    });
    return 'light';
  } else {
    // fallback
    return 'system';
  }
};

export function ThemeSwitcher() {
  const [preference, setPreference] = useState<undefined | null | string>(
    undefined,
  );
  const [currentTheme, setCurrentTheme] = useState<null | string>(null);

  const onMediaChange = useCallback(() => {
    const current = themeEffect();
    setCurrentTheme(current);
  }, []);

  useLayoutEffect(() => {
    setPreference(localStorage.getItem('theme'));
    const current = themeEffect();
    setCurrentTheme(current);
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    matchMedia.addEventListener('change', onMediaChange);
    return () => matchMedia.removeEventListener('change', onMediaChange);
  }, [onMediaChange]);

  const onStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === 'theme') setPreference(event.newValue);
  }, []);

  useEffect(() => {
    setCurrentTheme(themeEffect());
  }, [preference]);

  useEffect(() => {
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [onStorageChange]);

  const setTheme = (theme: string) => {
    if (theme === 'system') {
      localStorage.removeItem('theme');
      setPreference(null);
    } else {
      localStorage.setItem('theme', theme);
      setPreference(theme);
    }
  };

  const isActive = (theme: string) => {
    if (theme === 'system') return !preference;
    return preference === theme;
  };

  return (
    <div className="inline-flex rounded-full border border-border bg-background p-0.5 shadow-sm">
      <button
        aria-label="System theme"
        className={`group flex items-center justify-center rounded-full px-1.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          isActive('system') ? 'bg-muted' : 'hover:bg-accent'
        }`}
        onClick={() => setTheme('system')}
        type="button"
      >
        <MonitorIcon
          className={`h-3 w-3 ${isActive('system') ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </button>
      <button
        aria-label="Light theme"
        className={`group flex items-center justify-center rounded-full px-1.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          isActive('light') ? 'bg-muted' : 'hover:bg-accent'
        }`}
        onClick={() => setTheme('light')}
        type="button"
      >
        <SunIcon
          className={`h-3 w-3 ${isActive('light') ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </button>
      <button
        aria-label="Dark theme"
        className={`group flex items-center justify-center rounded-full px-1.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          isActive('dark') ? 'bg-muted' : 'hover:bg-accent'
        }`}
        onClick={() => setTheme('dark')}
        type="button"
      >
        <MoonIcon
          className={`h-3 w-3 ${isActive('dark') ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </button>
    </div>
  );
}

function MonitorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={props.className}
      width={12}
      height={12}
      {...props}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="12"
        rx="2"
        fill="currentColor"
        className="fill-muted-foreground/10"
      />
      <rect
        x="3"
        y="4"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9"
        y="18"
        width="6"
        height="2"
        rx="1"
        fill="currentColor"
        className="fill-muted-foreground/20"
      />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      strokeWidth={0}
      viewBox="0 0 56 56"
      {...props}
    >
      <path
        d="M41.2 36.1c-12.9 0-21-7.8-21-20.3 0-3.5.7-6.7 1.6-8.3.3-.7.4-1 .4-1.5 0-.8-.7-1.7-1.7-1.7-.2 0-.7 0-1.3.3A24.5 24.5 0 004.4 27.1 23.8 23.8 0 0029 51.7c10.2 0 18.4-5.3 22.3-14.1l.3-1.4c0-1-.9-1.6-1.6-1.6a3 3 0 00-1.2.2c-2 .8-4.8 1.3-7.6 1.3zM8.1 27c0-7.3 3.8-14.3 9.9-18-.8 2-1.2 4.5-1.2 7.2 0 14.6 9 23.3 23.9 23.3 2.4 0 4.5-.2 6.4-1a20.8 20.8 0 01-18 9.6C17 48 8.1 39 8.1 27z"
        stroke="none"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      strokeWidth={0}
      viewBox="0 0 56 56"
      {...props}
    >
      <path
        d="M30 4.6c0-1-.9-2-2-2a2 2 0 00-2 2v5c0 1 .9 2 2 2s2-1 2-2zm9.6 9a2 2 0 000 2.8c.8.8 2 .8 2.9 0L46 13a2 2 0 000-2.9 2 2 0 00-3 0zm-26 2.8c.7.8 2 .8 2.8 0 .8-.7.8-2 0-2.9L13 10c-.7-.7-2-.8-2.9 0-.7.8-.7 2.1 0 3zM28 16a12 12 0 00-12 12 12 12 0 0012 12 12 12 0 0012-12 12 12 0 00-12-12zm0 3.6c4.6 0 8.4 3.8 8.4 8.4 0 4.6-3.8 8.4-8.4 8.4a8.5 8.5 0 01-8.4-8.4c0-4.6 3.8-8.4 8.4-8.4zM51.3 30c1.1 0 2-.9 2-2s-.9-2-2-2h-4.9a2 2 0 00-2 2c0 1.1 1 2 2 2zM4.7 26a2 2 0 00-2 2c0 1.1.9 2 2 2h4.9c1 0 2-.9 2-2s-1-2-2-2zm37.8 13.6a2 2 0 00-3 0 2 2 0 000 2.9l3.6 3.5a2 2 0 002.9 0c.8-.8.8-2.1 0-3zM10 43.1a2 2 0 000 2.9c.8.7 2.1.8 3 0l3.4-3.5c.8-.8.8-2.1 0-2.9-.8-.8-2-.8-2.9 0zm20 3.4c0-1.1-.9-2-2-2a2 2 0 00-2 2v4.9c0 1 .9 2 2 2s2-1 2-2z"
        stroke="none"
        fill="currentColor"
      />
    </svg>
  );
}

export default ThemeSwitcher;
