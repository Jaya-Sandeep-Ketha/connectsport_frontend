import React from 'react';

function PollDisplay({ poll, onVote }) {
  return (
    <div>
      <h2>{poll.content}</h2>
      <ul>
        {poll.options.map((option, index) => (
          <li key={index}>
            {option.option} - Votes: {option.votes}
            <button onClick={() => onVote(poll.id, option.option)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollDisplay;