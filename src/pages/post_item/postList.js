import React from 'react';
import Post from './post'; // Ensure correct import path
import PollDisplay from '../poll_item'; // Ensure correct import path

// Enhanced PostList component to handle both regular posts and polls
function PostList({ posts, currentUser, onVote }) {
  return (
    <div>
      {posts.map((post) =>
        post.type === 'poll' ? (
          // Render PollDisplay for poll-type posts
          <PollDisplay key={post.id} poll={post} onVote={onVote} />
        ) : (
          // Render Post for regular posts
          <Post key={post.id} {...post} currentUser={currentUser} />
        )
      )}
    </div>
  );
}

export default PostList;