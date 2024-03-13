import React from 'react';
import Post from './post'; // Ensure correct import path
import PollDisplay from '../poll_item'; // Ensure correct import path

// Enhanced PostList component to handle both regular posts and polls
function PostList({ posts, currentUser, onVote }) {
  return (
    <div>
      {posts.map((post) =>
        post.type === 'poll' ? (
          // Render PollDisplay for poll-type posts using the unique post.id
          <PollDisplay key={post.id} poll={post} onVote={onVote} />
        ) : (
          // Render Post for regular posts using the unique post.id
          <Post key={post.id} {...post} currentUser={currentUser} />
        )
      )}
    </div>
  );
}

export default PostList;
