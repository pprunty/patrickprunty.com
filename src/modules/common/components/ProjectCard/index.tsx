import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <Link
      href={url}
      className="flex flex-col sm:flex-row items-center w-full h-full border dark:border-[#555] border-gray-200 rounded-md overflow-hidden transition-all ease-in-out duration-300 hover:shadow-sm active:opacity-80 active:scale-98 bg-white dark:bg-[#1C1C1C]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Image Section */}
      <div className="w-full sm:w-1/2 flex-shrink-0 h-52 sm:h-34 p-0 border-b sm:border-b-0 sm:border-r dark:border-[#555] border-gray-200 shadow-sm sm:shadow-none">
        <Image
          src={imagePath}
          alt={title}
          className="object-cover w-full h-full m-0 border-b sm:border-b-0 dark:border-[#555] border-gray-200 "
          width={310}
          height={310}
          priority
        />
      </div>
      {/* Text Section */}
      <div className="p-4 flex flex-col justify-center sm:w-1/2">
        <h2 className="text-xl font-bold mt-2 mb-1 dark:text-gray-100">
          {title}
        </h2>
        <p className="my-5 text-[17px] [blockquote_&]:my-2">{description}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
