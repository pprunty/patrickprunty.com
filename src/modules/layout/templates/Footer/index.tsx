import Link from 'next/link';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';
import { urlMapping, SocialIcon } from '@/modules/common/components/SocialIcon';

export default function Footer() {
  return (
    <footer className="flex text-md flex-col items-center pb-4 mt-10 font-mono">
      <div className="flex justify-center mt-10 text-xs text-gray-700 dark:text-[#999999]">
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
              className="inline-flex items-center hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-md p-2 transition-[background-color]"
            >
              <SocialIcon platform={platform} />
            </Link>
          ) : null,
        )}
      </div>

      <div className="text-gray-700 dark:text-[#999999] mt-3 px-6 text-center text-xs">
        Developed by{' '}
        <Link
          href="https://patrickprunty.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-gray-800 dark:text-gray-300"
        >
          Patrick Prunty
        </Link>{' '}
        under{' '}
        <Link
          href="https://opensource.org/license/mit"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-gray-800 dark:text-gray-300"
        >
          MIT license
        </Link>
      </div>
    </footer>
  );
}
