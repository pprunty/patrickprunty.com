'use client'; // Ensure it's a Client Component if using Next.js App Router

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';
import { urlMapping, SocialIcon } from '@/modules/common/components/SocialIcon';
import Subscribe from '@/modules/blog/components/Subscribe';
import { HR } from '@/app/blog/components/hr';

export default function Footer() {
  const pathname = usePathname();
  const isBlogPage = pathname.includes('blog');

  return (
    <>
      <div className="">
        <HR />
      </div>

      <footer
        className={`container max-w-2xl mx-auto px-6 ${
          isBlogPage ? 'sm:pb-12' : 'sm:pb-4'
        }`}
      >
        <div className="">
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
