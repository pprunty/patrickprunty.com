import ScrambleIn from '@/components/scramble-in';
import ScrambleCombinedPair from '@/components/scramble-combined-pair';
import { projects, socials, writing, youtube } from '@/data/content';
import Newsletter from '@/components/newsletter';
import ThemeSwitcher from '@/components/theme-switcher';
import PhotoCarousel from '@/components/photo-carousel';
import Link from 'next/link';
import {
  getAnimationDuration,
  ROW_DELAY,
  SCRAMBLE_SPEED,
  SCRAMBLED_LETTER_COUNT,
} from '@/lib/utils';
import Image from 'next/image';
import me from '../../public/images/me.webp';
import MediaCarousel from './media-carousel';

// Helper to normalize media array
function normalizeMedia(
  media: unknown[],
): { type: 'image' | 'video' | 'youtube'; src: string }[] {
  if (!Array.isArray(media)) return [];
  return media.map((m) => {
    if (typeof m === 'string') return { type: 'image' as const, src: m };
    if (
      typeof m === 'object' &&
      m !== null &&
      'type' in m &&
      'src' in m &&
      typeof (m as { type?: unknown }).type === 'string' &&
      typeof (m as { src?: unknown }).src === 'string'
    ) {
      const type = (m as { type: string }).type;
      const src = (m as { src: string }).src;
      if (['image', 'video', 'youtube'].includes(type))
        return { type, src } as {
          type: 'image' | 'video' | 'youtube';
          src: string;
        };
      return { type: 'image' as const, src };
    }
    return { type: 'image' as const, src: '' };
  });
}

export default function Home() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground font-normal text-[4.9vw] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight sm:leading-tight">
      <div className="px-4 pt-10 pb-10 sm:px-6 sm:pt-10 sm:pb-10 md:px-8 md:pt-10 md:pb-10 lg:px-12 lg:pt-12 lg:pb-12">
        <div className="relative max-w-screen-2xl mx-auto flex flex-col gap-16 sm:gap-18 md:gap-20 lg:gap-28">
          {/* Theme Switcher - Aligned with design/tech/build section */}
          <div className="absolute top-[0.25rem] sm:top-0 right-0 z-10 flex items-center h-[1.2em]">
            <ThemeSwitcher />
          </div>

          {/* Header - Row 1 */}
          <div className="flex flex-col sm:flex-row">
            <div className="w-full mb-[2vw] sm:mb-0 sm:text-right sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <h1>
                <ScrambleIn
                  delay={0}
                  scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                  scrambleSpeed={SCRAMBLE_SPEED}
                  className="font-bold"
                >
                  patrick prunty
                </ScrambleIn>
              </h1>
            </div>
            <div className="">
              <h1 className="pb-0.5 md:pb-0.5 lg>pb-1">
                <ScrambleIn
                  delay={getAnimationDuration('patrick prunty')}
                  scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                  scrambleSpeed={SCRAMBLE_SPEED}
                  className="font-light text-muted-foreground"
                >
                  explore ✺&#xfe0e; design ∿&#xfe0e; build ◳&#xfe0e;
                </ScrambleIn>
              </h1>
              <a
                href="https://www.optum.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer border-b-2 border-transparent md:hover:border-foreground transition-colors"
              >
                <ScrambleIn
                  delay={getAnimationDuration('patrick prunty') + ROW_DELAY}
                  scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                  scrambleSpeed={SCRAMBLE_SPEED}
                  className="whitespace-pre font-light text-muted-foreground"
                >
                  <span
                    className="w-full block sm:inline whitespace-pre-line"
                    style={{ minHeight: '2.5em', display: 'block' }}
                  >
                    senior software engineer @ united
                    <br className="block sm:hidden mt-2" />
                    health group / optum ↗
                  </span>
                </ScrambleIn>
              </a>
              <div className="mt-6 md:mt-4">
                <Image
                  src={me}
                  alt="Patrick Prunty"
                  width={320}
                  height={448}
                  className="shadow-md w-64 h-96 md:w-64 md:h-96 xl:w-80 xl:h-[28rem] object-cover"
                  quality={100}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col sm:flex-row">
            <h2 className="w-full mb-[2vw] sm:mb-0 sm:text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 3 + getAnimationDuration('patrick prunty')}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
                className="font-bold"
              >
                newsletter
              </ScrambleIn>
            </h2>
            <div className="flex-1 w-full flex flex-col">
              <Newsletter
                delay={ROW_DELAY * 4 + getAnimationDuration('patrick prunty')}
              />
              <div className="font-light text-muted-foreground text-xl md:text-xl lg:text-2xl xl:text-3xl leading-snug mt-4 mb-2 whitespace-pre-line">
                No spam. Only thoughtful updates and creative inspiration.
              </div>
            </div>
          </div>

          {/* Writing */}
          <div className="flex sm:flex-row flex-col">
            <h2 className="w-full sm:text-right mb-[2vw] sm:mb-0 sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 3}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
                className="font-bold"
              >
                writing
              </ScrambleIn>
            </h2>
            <div className="flex-1 w-full">
              {writing.map((item, index) => {
                const isExternal = item.links.startsWith('http');
                const linkContent = (
                  <ScrambleCombinedPair
                    leftText={
                      <span className="w-full whitespace-pre">
                        {item.title}
                        {isExternal ? ' ↗' : ''}
                      </span>
                    }
                    leftTextString={item.title}
                    rightText={item.year}
                    delay={
                      ROW_DELAY * 3 +
                      getAnimationDuration('patrick prunty') +
                      ROW_DELAY * index
                    }
                    scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                    scrambleSpeed={SCRAMBLE_SPEED}
                    className="font-light"
                    img={item.img}
                    imgAlt={`${item.title} preview`}
                    showImage={!!item.img}
                    containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1 transition-colors"
                  />
                );

                return (
                  <div key={index} className="mb-2">
                    {isExternal ? (
                      <a
                        href={item.links}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {linkContent}
                      </a>
                    ) : (
                      <Link href={item.links}>{linkContent}</Link>
                    )}
                    {item.description && (
                      <ScrambleIn
                        delay={
                          ROW_DELAY * 3 +
                          getAnimationDuration('patrick prunty') +
                          ROW_DELAY * index
                        }
                        scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                        scrambleSpeed={SCRAMBLE_SPEED}
                        className="font-light text-muted-foreground text-xl md:text-xl lg:text-2xl xl:text-3xl leading-snug mt-1 mb-2 whitespace-pre-line"
                      >
                        {item.description}
                      </ScrambleIn>
                    )}
                    {/* Render MediaCarousel if media exists and is non-empty */}
                    {Array.isArray(item.media) && item.media.length > 0 && (
                      <div className="my-4">
                        <MediaCarousel
                          media={normalizeMedia(item.media)}
                          title={item.title}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* YouTube */}
          <div className="flex flex-col sm:flex-row">
            <h2 className="w-full mb-[2vw] sm:mb-0 sm:text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12  sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 7}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
                className="font-bold"
              >
                youtube
              </ScrambleIn>
            </h2>
            <ul className="flex-1">
              {youtube.map((item, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={item.links}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ScrambleCombinedPair
                      leftTextString={item.title}
                      leftText={
                        <span className="w-full whitespace-pre">
                          {item.title} ↗
                        </span>
                      }
                      rightText={item.year}
                      delay={
                        ROW_DELAY * 7 +
                        getAnimationDuration('patrick prunty') +
                        ROW_DELAY * index
                      }
                      scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                      scrambleSpeed={SCRAMBLE_SPEED}
                      className="font-light"
                      img={item.img}
                      imgAlt={`${item.title} preview`}
                      showImage={!!item.img}
                      containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1 transition-colors"
                    />
                  </a>
                  {item.description && (
                    <ScrambleIn
                      delay={
                        ROW_DELAY * 7 +
                        getAnimationDuration('patrick prunty') +
                        ROW_DELAY * index
                      }
                      scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                      scrambleSpeed={SCRAMBLE_SPEED}
                      className="font-light text-muted-foreground text-xl md:text-xl lg:text-2xl xl:text-3xl leading-snug mt-1 mb-2 whitespace-pre-line"
                    >
                      {item.description}
                    </ScrambleIn>
                  )}
                  {/* Render MediaCarousel if media exists and is non-empty */}
                  {Array.isArray(item.media) && item.media.length > 0 && (
                    <div className="my-4">
                      <MediaCarousel
                        media={normalizeMedia(item.media)}
                        title={item.title}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Software */}
          <div className="flex flex-col sm:flex-row">
            <h2 className="w-full mb-[2vw] sm:mb-0 sm:text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12  sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 11}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
                className="font-bold"
              >
                software
              </ScrambleIn>
            </h2>
            <ul className="flex-1">
              {projects.map((project, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={project.links}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ScrambleCombinedPair
                      key={index}
                      leftTextString={project.title}
                      leftText={
                        <span className="w-full whitespace-pre">
                          {project.title} ↗
                        </span>
                      }
                      rightText={project.year}
                      delay={
                        ROW_DELAY * 11 +
                        getAnimationDuration('patrick prunty') +
                        ROW_DELAY * index
                      }
                      img={project.img}
                      imgAlt={`${project.title} project thumbnail`}
                      showImage={true}
                      scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                      scrambleSpeed={SCRAMBLE_SPEED}
                      className="font-light"
                      containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1 transition-colors"
                    />
                  </a>
                  {project.description && (
                    <ScrambleIn
                      delay={
                        ROW_DELAY * 11 +
                        getAnimationDuration('patrick prunty') +
                        ROW_DELAY * index
                      }
                      scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                      scrambleSpeed={SCRAMBLE_SPEED}
                      className="font-light text-muted-foreground text-xl md:text-xl lg:text-2xl xl:text-3xl leading-snug mt-1 mb-2 whitespace-pre-line"
                    >
                      {project.description}
                    </ScrambleIn>
                  )}
                  {/* Render MediaCarousel if media exists and is non-empty */}
                  {Array.isArray(project.media) && project.media.length > 0 && (
                    <div className="my-4">
                      <MediaCarousel
                        media={normalizeMedia(project.media)}
                        title={project.title}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Photos */}
          <div className="flex flex-col sm:flex-row">
            <h2 className="w-full mb-[2vw] sm:mb-0 sm:text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 13}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
                className="font-bold"
              >
                photos
              </ScrambleIn>
            </h2>
            <div className="flex-1">
              <PhotoCarousel />
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row">
            <h2 className="w-full mb-[2vw] sm:mb-0 sm:text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12  sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 17}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
                className="font-bold"
              >
                contact
              </ScrambleIn>
            </h2>
            <ul>
              <li>
                <a
                  href="mailto:patrickprunty.business@gmail.com"
                  className="cursor-pointer border-b-2 border-b-transparent md:hover:border-foreground pb-0.5 md:pb-0.5 lg:pb-1 inline-block transition-colors"
                >
                  <ScrambleCombinedPair
                    leftText={
                      <span className="w-full whitespace-pre">
                        patrickprunty.business@gmail.com{' '}
                      </span>
                    }
                    leftTextString="patrickprunty.business@gmail.com"
                    rightText=""
                    delay={
                      ROW_DELAY * 17 + getAnimationDuration('patrick prunty')
                    }
                    scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                    scrambleSpeed={SCRAMBLE_SPEED}
                    className="font-light"
                    containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1 transition-colors"
                  />
                </a>
              </li>
              <br />
              {socials
                .filter((social) => social.name.toLowerCase() !== 'rss')
                .map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.links}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer border-b-2 border-b-transparent md:hover:border-foreground pb-0.5 md:pb-0.5 lg:pb-1 inline-block transition-colors"
                    >
                      <ScrambleCombinedPair
                        leftText={
                          <span className="w-full whitespace-pre">
                            {social.name} ↗
                          </span>
                        }
                        leftTextString={social.name}
                        rightText=""
                        delay={
                          ROW_DELAY * 19 +
                          getAnimationDuration('patrick prunty') +
                          ROW_DELAY * index
                        }
                        scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                        scrambleSpeed={SCRAMBLE_SPEED}
                        className="font-light"
                        containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1 transition-colors"
                      />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
