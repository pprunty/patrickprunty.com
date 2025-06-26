"use client";

import React from 'react';
import type { MDXComponents } from 'mdx/types';
import * as BlogComponents from '@/app/(blog)/blog/components';

// Import custom components for home page
import Link from 'next/link';
import UniqueViewers from '@/components/unique-viewers';
import Section from '@/components/section';
import ThemeSwitcher from '@/components/theme-switcher';
import Image from 'next/image';
import Map from '@/components/map';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import SubstackButton from '@/components/substack-button';
import AnimatedSection from '@/components/animated-section';
import PhotoGrid from '@/components/photo-grid';

// Try to use the built-in getMDXComponent from contentlayer/generated
import { useMDXComponent } from 'next-contentlayer2/hooks';

interface MdxProps {
  code: string;
}

// Create a combined components object
const customComponents = {
  // Standard HTML element mappings for markdown
  p: BlogComponents.p,
  h1: BlogComponents.h1,
  h2: BlogComponents.h2,
  h3: BlogComponents.h3,
  h4: BlogComponents.h4,
  a: BlogComponents.a,
  ul: BlogComponents.ul,
  ol: BlogComponents.ol,
  li: BlogComponents.li,
  hr: BlogComponents.hr,
  blockquote: BlogComponents.blockquote,
  code: BlogComponents.InlineCode,
  table: BlogComponents.Table,
  th: BlogComponents.TableHeader,
  td: BlogComponents.TableCell,
  tr: BlogComponents.TableRow,
  
  // Custom components (keep original names for explicit usage)
  ...BlogComponents,
  
  // Custom page components
  Link,
  UniqueViewers,
  Section,
  ThemeSwitcher,
  Image,
  Map,
  Contact,
  Footer,
  SubstackButton,
  AnimatedSection,
  PhotoGrid,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  };
}

export const Mdx = React.memo<MdxProps>(function Mdx({ code }) {
  console.log('Mdx component received code:', {
    hasCode: !!code,
    codeType: typeof code,
    codeLength: code?.length,
    codeStart: code?.substring(0, 100) + '...'
  });
  
  if (!code) {
    console.error('MDX code is undefined or empty:', code);
    return <div>No content available</div>;
  }
  
  if (typeof code !== 'string') {
    console.error('MDX code is not a string:', typeof code, code);
    return <div>Invalid content format</div>;
  }
  
  try {
    const Component = useMDXComponent(code);

    return (
      <div className="mdx w-full max-w-full overflow-hidden">
        <Component components={customComponents} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering MDX component:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      codeStart: code?.substring(0, 200) + '...'
    });
    return <div>Error rendering content: {error?.message}</div>;
  }
});
