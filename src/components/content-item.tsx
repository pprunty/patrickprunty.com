import Link from 'next/link';
import ScrambleIn from '@/components/scramble-in';
import ScrambleCombinedPair from '@/components/scramble-combined-pair';
import MediaCarousel from '@/app/media-carousel';
import {
  SCRAMBLED_LETTER_COUNT,
  SCRAMBLE_SPEED,
  ROW_DELAY,
  getAnimationDuration,
  normalizeMedia,
} from '@/lib/utils';

interface ContentItemProps {
  title: string;
  year: string;
  links: string;
  description?: string;
  img?: string;
  media?: unknown[];
  delay: number;
  showImage?: boolean;
}

export default function ContentItem({
  title,
  year,
  links,
  description,
  img,
  media = [],
  delay,
  showImage = false,
}: ContentItemProps) {
  const isExternal = links.startsWith('http');

  const linkContent = (
    <ScrambleCombinedPair
      leftText={
        <span className="w-full whitespace-pre underline decoration-wavy decoration-muted-foreground underline-offset-4 sm:no-underline">
          {title}
          {isExternal ? ' ↗' : ''}
        </span>
      }
      leftTextString={title}
      rightText={year}
      delay={delay}
      scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
      scrambleSpeed={SCRAMBLE_SPEED}
      className="font-light"
      img={img}
      imgAlt={`${title} preview`}
      showImage={showImage || !!img}
      containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1 transition-colors"
    />
  );

  return (
    <div className="mb-2">
      {isExternal ? (
        <a href={links} target="_blank" rel="noopener noreferrer">
          {linkContent}
        </a>
      ) : (
        <Link href={links}>{linkContent}</Link>
      )}
      {description && (
        <ScrambleIn
          delay={delay}
          scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
          scrambleSpeed={SCRAMBLE_SPEED}
          className="font-light text-muted-foreground text-[4.5vw] sm:text-lg md:text-lg lg:text-xl xl:text-2xl leading-tight sm:leading-tight mt-1 mb-2 whitespace-pre-line"
        >
          {description}
        </ScrambleIn>
      )}
      {Array.isArray(media) && media.length > 0 && (
        <div className="my-4">
          <MediaCarousel media={normalizeMedia(media)} title={title} />
        </div>
      )}
    </div>
  );
}
