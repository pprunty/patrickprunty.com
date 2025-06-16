import ScrambleIn from '@/components/scramble-in';
import { SCRAMBLED_LETTER_COUNT, SCRAMBLE_SPEED } from '@/lib/utils';

interface ContentSectionProps {
  title: string;
  delay: number;
  children: React.ReactNode;
}

export default function ContentSection({
  title,
  delay,
  children,
}: ContentSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row">
      <h2 className="w-full mb-[2vw] sm:mb-0 sm:text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-[22%]">
        <ScrambleIn
          delay={delay}
          scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
          scrambleSpeed={SCRAMBLE_SPEED}
          className="font-bold"
        >
          {title}
        </ScrambleIn>
      </h2>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
