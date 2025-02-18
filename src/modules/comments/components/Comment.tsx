'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar'; // Adjust the import path as needed

export interface CommentProps {
  id?: string;
  text: string;
  author: string;
  timestamp: string; // Used to calculate "time ago"
  replies?: CommentProps[];
}

const Comment: React.FC<CommentProps> = ({
  id,
  text,
  author,
  timestamp,
  replies,
}) => {
  const [showReplyEditor, setShowReplyEditor] = useState<boolean>(false);

  const toggleReplyEditor = () => {
    setShowReplyEditor((prev) => !prev);
  };

  // Calculate the time difference using date-fns
  const postDate = new Date(timestamp);
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });

  return (
    <div className="mb-3 bg-inherit">
      <div className="flex">
        {/* Render the avatar using the author's UID */}
        <Avatar uid={author} size={30} />
        <div className="flex-1 ml-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{author}</span>
            <span className="text-[10px] font-mono text-gray-700 dark:text-[#999999]">
              {timeAgo}
            </span>
          </div>
          <p className="mt-2 text-[15px] dark:text-[#EEEEEE] text-[#111111]">
            {text}
          </p>
          <div className="mt-2 flex gap-3">
            <button
                          onClick={toggleReplyEditor}
                          className="bg-none border-none text-xs text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        >
                          Reply
                        </button>
          </div>
          {showReplyEditor && (
            // Insert your reply editor component here
            <div className="mt-2">Reply editor goes here.</div>
          )}
        </div>
      </div>
      {replies && (
        <div className="ml-5 pl-4 mt-3">
          {replies.map((reply) => (
            <Comment key={reply.id} {...reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
