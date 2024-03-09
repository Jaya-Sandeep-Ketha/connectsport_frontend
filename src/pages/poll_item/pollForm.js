import React, { useState } from 'react';

function PollForm({ onPollSubmit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some(option => !option.trim())) return; // Validation
    onPollSubmit({ question, options });
    setQuestion('');
    setOptions(['', '']); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter your poll question..."
        style={{ width: '100%', marginBottom: '10px' }}
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          placeholder={`Option ${index + 1}`}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      ))}
      <button type="submit">Create Poll</button>
    </form>
  );
}

export default PollForm;