'use client';

import { type ReactNode, Suspense, useState, useEffect } from 'react';
import { type Tweet, getTweet } from 'react-tweet/api';
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  type TweetProps,
} from 'react-tweet';
import { Caption } from './caption';
import './tweet.css';

interface TweetArgs {
  id: string;
  caption: ReactNode;
}

const TweetContent = ({ id, components }: TweetProps) => {
  const [tweet, setTweet] = useState<Tweet | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setTweet(null);
      setLoading(false);
      return;
    }

    const fetchTweet = async () => {
      try {
        const fetchedTweet = await getTweet(id);
        setTweet(fetchedTweet || null);
      } catch (error) {
        console.error('tweet fetch error', error);
        setTweet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [id]);

  if (loading) {
    return <TweetSkeleton />;
  }

  if (!tweet) {
    return <TweetNotFound />;
  }

  return <EmbeddedTweet tweet={tweet} components={components} />;
};

export const ReactTweet = (props: TweetProps) => (
  <TweetContent {...props} />
);

export function Tweet({ id, caption }: TweetArgs) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
}
