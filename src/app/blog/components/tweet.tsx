import { type ReactNode, Suspense } from 'react';
import { type Tweet, getTweet } from 'react-tweet/api';
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  type TweetProps,
} from 'react-tweet';
import redis from '@/app/redis';
import { Caption } from './caption';
import './tweet.css';

interface TweetArgs {
  id: string;
  caption: ReactNode;
}

async function getAndCacheTweet(id: string): Promise<Tweet | undefined> {
  try {
    const tweet = await getTweet(id);

    if (tweet) {
      await redis.set(`tweet:${id}`, tweet);
      return tweet;
    }
  } catch (error) {
    console.error('tweet fetch error', error);
  }

  const cachedTweet: Tweet | null = await redis.get(`tweet:${id}`);

  if (!cachedTweet) return undefined;

  return cachedTweet;
}

const TweetContent = async ({ id, components }: TweetProps) => {
  const tweet = id ? await getAndCacheTweet(id) : undefined;

  if (!tweet) {
    return <TweetNotFound />;
  }

  return <EmbeddedTweet tweet={tweet} components={components} />;
};

export const ReactTweet = (props: TweetProps) => (
  <Suspense fallback={<TweetSkeleton />}>
    <TweetContent {...props} />
  </Suspense>
);

export async function Tweet({ id, caption }: TweetArgs) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
}
