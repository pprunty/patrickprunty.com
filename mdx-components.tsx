// mdx-components.js

import { A as a } from "@/app/blog/components/a";
import { P as p } from "@/app/blog/components/p";
import { H1 as h1 } from "@/app/blog/components/h1";
import { H2 as h2 } from "@/app/blog/components/h2";
import { H3 as h3 } from "@/app/blog/components/h3";
import { H4 as h4 } from "@/app/blog/components/h4";
import { OL as ol } from "@/app/blog/components/ol";
import { UL as ul } from "@/app/blog/components/ul";
import { LI as li } from "@/app/blog/components/li";
import { HR as hr } from "@/app/blog/components/hr";
import { Figure } from "@/app/blog/components/figure";
import { Caption } from "@/app/blog/components/caption";
import { YouTube } from "@/app/blog/components/youtube";
import { Ref, FootNotes, FootNote } from "@/app/blog/components/footnotes";
import { Blockquote as blockquote } from "@/app/blog/components/blockquote";
import 'highlight.js/styles/atom-one-dark.css';
import { InlineCode } from "@/app/blog/components/code";
import { Admonition } from '@/app/blog/components/admonition';
import { TableOfContents } from "@/app/blog/components/toc";
import PhotoGrid from "@/modules/common/templates/PhotoGrid";
import Strava from "@/app/blog/components/strava";
import TikTok from "@/app/blog/components/tiktok";
import LinkedIn from "@/app/blog/components/linkedin";
import Twitter from "@/app/blog/components/twitter";
import Instagram from "@/app/blog/components/instagram"; // <-- new import
import { Table, TableHeader, TableCell, TableRow } from '@/app/blog/components/table';
import Image from "next/image";
import { MemoizedImage } from "@/modules/common/components/MemoizedImage";
import Grid from "@/modules/common/components/Grid";
import Carousel from "@/modules/common/components/Carousel";
import LinkButton from "@/modules/common/components/LinkButton";
import PDF from "@/app/blog/components/pdf"; // Import PDFViewer component
import StarRating from "@/app/blog/components/rating";
import MP3 from "@/app/blog/components/mp3";
import { Del } from "@/app/blog/components/del"; // wherever you placed it

// Collect all components into an object
export const MDXComponents = {
  a,
  h1,
  h2,
  h3,
  h4,
  p,
  ol,
  ul,
  li,
  del: Del,
  hr,
  code: InlineCode,
  blockquote,
  Admonition,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt } = props;
    if (!src) return null;
    const width = 620;
    const height = 500;
    return (
      <MemoizedImage
        src={src}
        alt={alt || "Image"}
        width={width}
        height={height}
        loading="lazy"
        priority={false}
      />
    );
  },
  Figure,
  Caption,
  YouTube,
  PhotoGrid,
  Strava,
  TikTok,
  LinkedIn,
  Instagram,
  Twitter,
  Ref,
  FootNotes,
  FootNote,
  TableOfContents,
  table: Table,
  th: TableHeader,
  td: TableCell,
  tr: TableRow,
  Image,
  Grid,
  Carousel,
  LinkButton,
  MemoizedImage,
  PDF,
  StarRating,
  MP3
};

// Export useMDXComponents function
export function useMDXComponents(components = {}) {
  return {
    ...components,
    ...MDXComponents,
  };
}
