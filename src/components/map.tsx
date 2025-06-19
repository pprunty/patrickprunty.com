import Image from 'next/image';
import React from 'react';

const Map: React.FC = () => (
  <div className="relative h-fit w-fit overflow-hidden my-4">
    <Image
      src="/images/map.webp"
      alt="Map of London, UK"
      width={500}
      height={250}
      quality={100}
      draggable={false}
      className="w-full h-auto rounded-2xl"
    />
    <a
      href="https://en.wikipedia.org/wiki/London"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-4 right-4 flex items-center gap-1 rounded-md bg-muted border border-border px-3 py-1 text-xs font-normal text-primary dark:text-primary cursor-pointer no-after"
    >
      London, UK
    </a>
    <div aria-hidden="true">
      <div className="absolute left-[48%] top-[56%] z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 animate-marker"></div>
      <div
        className="absolute left-[48%] top-[56%] z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-blue-500 shadow-lg"
        style={{ borderColor: '#fff' }}
      ></div>
    </div>
  </div>
);

export default Map;
