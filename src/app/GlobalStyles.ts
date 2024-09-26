"use client";

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --fg: #000;
    --bg: #fff;
    --border-color: #e3e2e0;
    --hover-bg: #e5e7eb;
    --focus-border-color: #3b82f6;
    --placeholder-color: #999999;
  }

  [data-theme="dark"] {
    --fg: #fff;
    --bg: #000;
    --border-color: #313131;
    --hover-bg: #4b5563;
    --focus-border-color: #00BFFF;
    --placeholder-color: #666666;
  }
    html, body {
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
      font-family: Quicksand, system-ui, sans-serif;
      font-feature-settings: normal;
      font-variation-settings: normal;
      -webkit-tap-highlight-color: transparent;

      /* Smooth scrolling */
      scroll-behavior: smooth;
    }
`;