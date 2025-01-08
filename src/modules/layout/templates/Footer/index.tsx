'use client'; // Ensure it's a Client Component if using Next.js App Router

import Link from 'next/link';
import Image from 'next/image';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';
import { urlMapping, SocialIcon } from '@/modules/common/components/SocialIcon';
import Subscribe from '@/modules/blog/components/Subscribe';
import { HR } from '@/app/blog/components/hr';

export default function Footer() {
  return (
    <>
      {/*
        Dotted line
        Light mode: dots = #fcfcfc on #1c1c1c background
        Dark mode: (needs a custom approach or a different background style)
      */}
      {/* <div className="sm:px-4">
        <div
          className="w-full h-[9px] p-2"
          style={{
            background:
              'linear-gradient(90deg, #fcfcfc 2px, transparent 1%) 50%, ' +
              'linear-gradient(#fcfcfc 2px, transparent 1%) 50%, #1c1c1c',
            backgroundPosition: '0 0',
            backgroundSize: '3px 3px',
          }}
        />
      </div>*/}
      <div className="py-4">
          <HR />
      </div>

      <footer
        className="container
      mx-auto max-w-2xl px-1 sm:px-0"
      >
        <div className="">
          {/*
            2x2 grid:
            Row 1: [Patrick Prunty] | [Projects]
            Row 2: [Stay Connected] | [Newsletter]
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* 3) Stay Connected (Row 2, Col 1) */}
            <div>
              <div className="flex flex-wrap">
                {(
                  [
                    'github',
                    'twitter',
                    'instagram',
                    'reddit',
                    'tiktok',
                    'email',
                    'patreon',
                    'strava',
                    'linkedin',
                    'youtube',
                  ] as SocialPlatform[]
                ).map((platform) =>
                  urlMapping[platform] ? (
                    <Link
                      key={platform}
                      href={urlMapping[platform]}
                      passHref
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mr-3 mt-2 text-gray-600 dark:text-[#999999]"
                    >
                      <SocialIcon platform={platform} />
                    </Link>
                  ) : null,
                )}
              </div>
            </div>

            {/* 2) Projects (Row 1, Col 2) */}
            {/*      <div>
              <h2 className="text-md font-bold text-gray-800 dark:text-white mb-2">
                Projects
              </h2>
              <p className="text-gray-600 text-md dark:text-[#999999] mt-2 mb-2">
                Check out some of my projects by clicking below.
              </p>
              <div className="flex gap-3">
                <Link href="/projects/icon1" className="block" target="_blank">
                  <Image
                    src="/icon.webp"
                    alt="Project 1"
                    className="rounded-md"
                    width={48}
                    height={48}
                  />
                </Link>
                <Link href="/projects/icon2" className="block" target="_blank">
                  <Image
                    src="/icon.webp"
                    alt="Project 2"
                    className="rounded-md"
                    width={48}
                    height={48}
                  />
                </Link>
                <Link href="/projects/icon3" className="block" target="_blank">
                  <Image
                    src="/icon.webp"
                    alt="Project 3"
                    className="rounded-md"
                    width={48}
                    height={48}
                  />
                </Link>
                <Link href="/projects/icon4" className="block" target="_blank">
                  <Image
                    src="/icon.webp"
                    alt="Project 4"
                    className="rounded-md"
                    width={48}
                    height={48}
                  />
                </Link>
              </div>
            </div>*/}

            {/* 4) Newsletter (Row 2, Col 2) */}
            <div>
              <div className="mb-8">
                <Subscribe />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
