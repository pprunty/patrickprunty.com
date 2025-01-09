import React from 'react';
import { BlogPostType } from '@/__samwise/types/BlogPost';
import BlogPost from '@/modules/blog/components/BlogPost';

interface PostListProps {
  posts: BlogPostType[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => (
  <div className="mb-2 text-sm">
    <ul className="space-y-6 list-none pt-4">
      {posts.map((post, index) => (
        <li key={post.slug} className="">
          <BlogPost post={post} index={index} />
        </li>
      ))}
    </ul>
  </div>
);

export default PostList;
