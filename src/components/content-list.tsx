import ContentItem from '@/components/content-item';
import { ROW_DELAY, getAnimationDuration } from '@/lib/utils';

interface ContentListItem {
  title: string;
  year: string;
  links: string;
  description?: string;
  img?: string;
  media?: unknown[];
}

interface ContentListProps {
  items: ContentListItem[];
  baseDelay: number;
  showImages?: boolean;
  useList?: boolean;
}

export default function ContentList({
  items,
  baseDelay,
  showImages = false,
  useList = false,
}: ContentListProps) {
  const content = items.map((item, index) => (
    <ContentItem
      key={index}
      title={item.title}
      year={item.year}
      links={item.links}
      description={item.description}
      img={item.img}
      media={item.media}
      delay={
        baseDelay + getAnimationDuration('patrick prunty') + ROW_DELAY * index
      }
      showImage={showImages}
    />
  ));

  if (useList) {
    return (
      <ul className="flex-1">
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  return <div className="flex-1 w-full">{content}</div>;
}
