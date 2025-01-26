import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react'; // Importing the ExternalLink icon

interface ProjectCardProps {
  imagePath: string;
  title: string;
  description: string;
  url: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  imagePath,
  title,
  description,
  url,
}) => {
  const isExternalLink = url.startsWith('https://');

  return (
    <Link
      href={url}
      className="flex flex-col sm:flex-row items-stretch w-full h-full border dark:border-[#444] border-gray-300 rounded-md overflow-hidden transition-all ease-in-out duration-300 hover:shadow-sm active:opacity-80 active:scale-98 bg-white dark:bg-[#1C1C1C]"
      {...(isExternalLink
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {/* Image Section */}
      <div className="w-full sm:w-1/2 flex-shrink-0 h-52 sm:h-auto p-0 border-b sm:border-b-0 sm:border-r dark:border-[#444] border-gray-200 shadow-sm sm:shadow-none">
        <Image
          src={imagePath}
          alt={title}
          className="object-cover w-full h-full"
          width={310}
          height={310}
          loading={'lazy'}
        />
      </div>
      {/* Text Section */}
      <div className="p-4 flex flex-col justify-center sm:w-1/2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold mt-2 mb-1 dark:text-gray-100">
            {title}
          </h2>
          {isExternalLink && (
            <ExternalLink
              className="w-3 h-3 text-gray-600 dark:text-gray-300"
              aria-label="External link"
            />
          )}
        </div>
        <p className="my-5 text-[17px] line-clamp-4 text-gray-700 dark:text-[#c2c2c2]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
