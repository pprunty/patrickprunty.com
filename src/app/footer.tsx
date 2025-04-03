import Link from 'next/link';
import Image from 'next/image';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';
import { urlMapping, SocialIcon } from '@/components/social-icon';
import Subscribe from '@/components/subscribe';
import { HR } from '@/app/blog/components/hr';

export default function Footer() {
  return (
    <>
      <footer className={`container max-w-2xl mx-auto p-6 sm:px-0 pb-12`}>
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
                  'rss',
                ] as SocialPlatform[]
              ).map((platform) =>
                urlMapping[platform] ? (
                  <Link
                    key={platform}
                    href={urlMapping[platform]}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link inline-flex items-center mr-3 mt-2 text-gray-600 dark:text-[#999999]"
                  >
                    <SocialIcon platform={platform} />
                  </Link>
                ) : null,
              )}
            </div>
            {/* © Section */}
            <div className="mt-4 text-xs font-mono text-gray-600 dark:text-[#999999]">
              © {new Date().getFullYear()} Patrick Prunty.
            </div>
          </div>

          {/* 4) Newsletter (Row 2, Col 2) */}
          <div>
            <div className="mb-8">
              <Subscribe />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
