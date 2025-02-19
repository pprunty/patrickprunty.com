import React from 'react';
import Image from 'next/image';
import { H4 } from '@/app/blog/components/h4';

interface SectionItem {
  title: string;
  subtitle?: string;
  url?: string;
  description?: string;
  year?: string | number;
  images?: string[];
}

interface SectionProps {
  sectionName: string;
  items: SectionItem[];
}

interface SectionImagesProps {
  images: string[];
  title: string;
}

const SectionImages: React.FC<SectionImagesProps> = ({ images, title }) => {
  if (images.length > 1) {
    return (
      <div className="my-2 sm:mx-0">
        <div className="overflow-x-auto overflow-y-hidden">
          {/* Apply horizontal padding to align images with the description */}
          <div className="flex gap-2 sm:px-0">
            {images.map((src, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={src}
                  alt={`${title} image ${idx + 1}`}
                  width={130}
                  height={130}
                  className="rounded-xl border sm:mb-1.5 border-[#E2E2E2] dark:border-[#343334]"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For a single image
  return (
    <div className="my-2 sm:mx-0">
      <div className="sm:px-0">
        <Image
          src={images[0]}
          alt={`${title} image 1`}
          width={130}
          height={130}
          className="max-w-xs rounded-xl sm:mb-1.5 border border-[#E2E2E2] dark:border-[#343334]"
          priority
        />
      </div>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ sectionName, items }) => {
  return (
    <section className="my-6 text-sm">
      {/* Section Heading */}
      <div className="mb-6">
        <H4>{sectionName}</H4>
      </div>

      {/* Section Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="mb-4 ml-6 sm:ml-0 flex flex-col md:flex-row gap-2"
        >
          {/* Left Column (Year) */}
          {item.year && (
            <div className="md:w-1/4 mb-[-5px] text-gray-500 dark:text-[#7D7D7D]">
              {item.year}
            </div>
          )}

          {/* Right Column (Title, Subtitle, Description, Images) */}
          <div className="md:w-3/4">
            {/* Title / URL */}
            <div className="font-normal dark:text-[#EEEEEE] text-[#111111]">
              {item.url ? (
                <a
                  href={item.url}
                  target={item.url.startsWith('https://') ? '_blank' : '_self'}
                  rel={
                    item.url.startsWith('https://')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                <span>{item.title}</span>
              )}
            </div>

            {/* Subtitle */}
            {item.subtitle && (
              <p className="text-sm text-[#777777] dark:text-[#AAAAAA] mt-1">
                {item.subtitle}
              </p>
            )}

            {/* Description */}
            {item.description && (
              <p className="mt-1 text-sm text-[#555555] dark:text-[#B0AFB0]">
                {item.description}
              </p>
            )}

            {/* Images */}
            {item.images && item.images.length > 0 && (
              <SectionImages images={item.images} title={item.title} />
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Section;
