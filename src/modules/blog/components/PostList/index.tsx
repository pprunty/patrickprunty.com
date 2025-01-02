import React from 'react';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import BlogPost from '@/modules/blog/components/BlogPost';

interface PostListProps {
  posts: BlogPostType[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div
      className="
        relative
        overflow-x-auto
        scroll-smooth
        snap-x
        snap-mandatory
        mb-2 text-sm
      "
    >
      <ul
        className="
          inline-flex
          list-none
          p-0
          m-0
          space-x-4
          /* ^ Adjust spacing between cards */
        "
      >
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className="
              snap-start
              shrink-0
              w-64 sm:w-80
              /* ^ Card width; adjust as needed */
            "
          >
            <BlogPost post={post} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
