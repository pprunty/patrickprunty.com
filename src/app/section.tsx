'use client';

import React from 'react';
import Image from 'next/image';
import { H2 } from '@/app/blog/components/h2';

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
          alt={`${title} image`}
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
    <section className="my-6 text-base">
      {/* Section Heading */}
      <div className="mb-6">
        <H2>{sectionName}</H2>
      </div>

      {/* Use list-outside for bullets in the left margin/padding */}
      <ul className="list-disc list-outside pl-6 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="list-item">
            {/* If you want the content in flex columns, wrap it in a div */}
            <div className="flex flex-col md:flex-row gap-2">
              <div>
                {/* Title / URL */}
                <div className="font-normal dark:text-[#EEEEEE] text-[#111111]">
                  {item.url ? (
                    <a
                      href={item.url}
                      target={
                        item.url.startsWith('https://') ? '_blank' : '_self'
                      }
                      rel={
                        item.url.startsWith('https://')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="border-b text-gray-600 border-gray-300 transition-[border-color]
                                 hover:border-gray-600 dark:text-[#EEEEEE] text-[#111111]
                                 dark:border-gray-500 dark:hover:border-white"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>

                {/* Subtitle */}
                {item.subtitle && (
                  <p className="text-base text-[#111111] dark:text-[#AAAAAA] mt-1">
                    {item.subtitle}
                  </p>
                )}

                {/* Description */}
                {item.description && (
                  <p className="mt-1 text-base text-[#111111] dark:text-[#B0AFB0]">
                    {item.description}
                  </p>
                )}

                {/* Images */}
                {item.images && item.images.length > 0 && (
                  <SectionImages images={item.images} title={item.title} />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Section;
