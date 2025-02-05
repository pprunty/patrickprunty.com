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

  // Common link classes that match the A component styling:
  const linkClasses =
    'border-b text-black border-gray-600 dark:text-white border-white flex items-center gap-1';

  return (
    <div className="w-full h-full active:opacity-80 active:scale-98 bg-white dark:bg-[#1C1C1C]">
      {/* Image Section */}
      <div className="w-full h-56 sm:h-auto p-0">
        <Image
          src={imagePath}
          alt={title}
          className="object-cover rounded-xl w-full h-full"
          width={310}
          height={310}
          loading="lazy"
        />
      </div>
      {/* Text Section */}
      <div className="py-4">
        <h3 className="text-lg font-bold text-gray-700 dark:text-[#c2c2c2]">
          {title}
        </h3>
        <p className="py-2 text-[17px] line-clamp-4 text-gray-700 dark:text-[#c2c2c2]">
          {description}
        </p>
        {/* Links Section */}
        <div className="flex gap-4">
          <Link
            href={websiteUrl}
            target={isWebsiteExternal ? '_blank' : undefined}
            rel={isWebsiteExternal ? 'noopener noreferrer' : undefined}
            className={linkClasses}
          >
            Website
          </Link>
          {sourceUrl && (
            <Link
              href={sourceUrl}
              target={isSourceExternal ? '_blank' : undefined}
              rel={isSourceExternal ? 'noopener noreferrer' : undefined}
              className={linkClasses}
            >
              Source
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
