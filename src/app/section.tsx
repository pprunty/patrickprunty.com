import React from 'react';
import { H4 } from '@/app/blog/components/h4';

interface SectionItem {
  title: string;
  url?: string;
  description?: string;
  year?: string | number;
  images?: string[];
}

interface SectionProps {
  sectionName: string;
  items: SectionItem[];
}

const Section: React.FC<SectionProps> = ({ sectionName, items }) => {
  return (
    <section className="">
      {/* Section Heading */}
      <div className="mb-4">
        <H4>{sectionName}</H4>
      </div>

      {/* Section Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="mb-6 ml-6 sm:ml-0 flex flex-col md:flex-row gap-2"
        >
          {/* Left Column (Year) - only render if a year is provided */}
          {item.year && (
            <div className="md:w-1/3 text-gray-500 dark:text-[#7D7D7D]">
              {item.year}
            </div>
          )}

          {/* Right Column (Title, Description, Images) */}
          <div className="md:w-2/3">
            {/* Title / URL */}
            <div className="text-md font-medium dark:text-[#EEEEEE] text-[#111111]">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                <span>{item.title}</span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="mt-1 text-[15px] text-[#555555] dark:text-[#B0AFB0]">
                {item.description}
              </p>
            )}

            {/* Images: Render all images side by side if provided */}
            {item.images && item.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${item.title} image ${idx + 1}`}
                    className="max-w-xs rounded shadow rounded-2xl"
                    width={150}
                    height={150}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Section;
