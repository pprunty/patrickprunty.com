// tailwind.config.ts

import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// Import the scrollbar-hide plugin
const scrollbarHide = require('tailwind-scrollbar-hide');

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./scripts/**/*.{js,ts,jsx,tsx,mdx}" // Fix wildcard pattern for scripts folder
  ],
  theme: {
    extend: {
    backgroundImage: {
            'gradient-light':
              'linear-gradient(90deg, #fcfcfc 2px, transparent 1%) 50%, linear-gradient(#fcfcfc 2px, transparent 1%) 50%, #000',
            'gradient-dark':
              'linear-gradient(90deg, #333333 2px, transparent 1%) 50%, linear-gradient(#333333 2px, transparent 1%) 50%, #fcfcfc',
          },
      keyframes: {
        modalShow: {
          '0%': { opacity: '0', transform: 'scale(0.95)' }, // Cast opacity as a string
          '100%': { opacity: '1', transform: 'scale(1)' },  // Cast opacity as a string
        },
        modalHide: {
          '0%': { opacity: '1', transform: 'scale(1)' },    // Cast opacity as a string
          '100%': { opacity: '0', transform: 'scale(0.95)' }, // Cast opacity as a string
        },
      },
      animation: {
        modalShow: 'modalShow 0.3s ease-out forwards',
        modalHide: 'modalHide 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }: { addVariant: (name: string, rule: string) => void }) {
      // Adding theme-system variant
      addVariant("theme-system", ".theme-system &");
    }),
    scrollbarHide, // Add the scrollbar-hide plugin here
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
