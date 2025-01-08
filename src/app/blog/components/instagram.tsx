'use client';

import React from 'react';
import { InstagramEmbed } from 'react-social-media-embed';

interface InstagramProps {
  postUrl: string; // Full URL of the Instagram post
}

const Instagram: React.FC<InstagramProps> = ({ postUrl }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="w-full">
        <InstagramEmbed url={postUrl} className="h-auto" width="100%" />
      </div>
    </div>
  );
};

export default Instagram;
