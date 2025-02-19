// SocialIcons.tsx
import Link from 'next/link';
import { SocialPlatform } from '@/__samwise/types/SocialPlatform';
import { urlMapping, SocialIcon } from '@/modules/common/components/SocialIcon';

export interface SocialIconsProps {
  platforms?: SocialPlatform[];
  containerClassName?: string;
  linkClassName?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  platforms = [
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
  ] as SocialPlatform[],
  containerClassName = 'flex flex-wrap',
  linkClassName = 'social-link inline-flex items-center mr-3 mt-2 text-gray-600 dark:text-[#999999]',
}) => {
  return (
    <div className={containerClassName}>
      {platforms.map((platform) =>
        urlMapping[platform] ? (
          <Link
            key={platform}
            href={urlMapping[platform]}
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <SocialIcon platform={platform} />
          </Link>
        ) : null,
      )}
    </div>
  );
};
