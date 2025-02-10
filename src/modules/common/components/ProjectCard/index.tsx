import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  imagePath: string;
  title: string;
  description: string;
  websiteUrl: string;
  sourceUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  imagePath,
  title,
  description,
  websiteUrl,
  sourceUrl,
}) => {
  // Determine if links are external (if needed)
  const isWebsiteExternal = websiteUrl.startsWith('https://');
  const isSourceExternal = sourceUrl ? sourceUrl.startsWith('https://') : false;

  // Common link classes that match the A component styling,
  // including hover effects with ease-in-out transition.
  const linkClasses =
    'border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white';

  return (
    <div className="w-full h-full rounded-xl active:opacity-80 active:scale-98 bg-white dark:bg-[#1C1C1C] border dark:border-[#444] border-gray-300 rounded-md overflow-hidden transition-all ease-in-out duration-300 hover:shadow-sm">
      {/* Image Section */}
      <div className="w-full h-56 sm:h-[180px] p-0">
        <Link
          href={websiteUrl}
          target={isWebsiteExternal ? '_blank' : undefined}
          rel={isWebsiteExternal ? 'noopener noreferrer' : undefined}
          className="no-after"
        >
          <Image
            src={imagePath}
            alt={title}
            className="object-cover rounded-t-xl w-full h-full border-b dark:border-[#444] border-gray-200"
            width={310}
            height={310}
            loading="lazy"
          />
        </Link>
      </div>
      {/* Text Section */}
      <div className="p-4 sm:min-h-0 flex flex-col justify-center">
        <h3 className="text-lg font-bold text-gray-700 dark:text-[#ccc]">
          {title}
        </h3>
        <p className="py-4 text-[17px] line-clamp-5 text-gray-700 dark:text-[#ccc]">
          {description}
        </p>
        {/* Links Section */}
        <div className="flex items-center text-md gap-1">
          <Link
            href={websiteUrl}
            target={isWebsiteExternal ? '_blank' : undefined}
            rel={isWebsiteExternal ? 'noopener noreferrer' : undefined}
            className={linkClasses}
          >
            Website
          </Link>
          {sourceUrl && (
            <>
              <span className="text-gray-700 dark:text-[#c2c2c2]">,</span>
              <Link
                href={sourceUrl}
                target={isSourceExternal ? '_blank' : undefined}
                rel={isSourceExternal ? 'noopener noreferrer' : undefined}
                className={linkClasses}
              >
                Source
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
