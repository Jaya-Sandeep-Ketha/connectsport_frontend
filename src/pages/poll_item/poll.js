import React, { useState } from 'react';

function Poll({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) return; // Prevents submitting an empty vote
    onVote(poll.id, selectedOption);
    setSelectedOption(''); // Reset after submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{poll.question}</p>
      {poll.options.map((option, index) => (
        <div key={index}> {/* Use div for better structure */}
          <label>
            <input
              type="radio"
              name="pollOption" // Added a name for proper radio button grouping
              value={option.option} // Adjust to match data structure
              checked={selectedOption === option.option}
              onChange={handleOptionChange}
            />
            {option.option}
          </label>
        </div>
      ))}
      <button type="submit">Vote</button>
    </form>
  );
}

export default Poll;