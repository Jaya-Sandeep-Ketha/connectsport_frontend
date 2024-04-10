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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || options.some(option => !option.trim())) return;
  
    try {
      console.log('Creating poll with question:', question);
      const response = await fetch('/newpoll', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options: options.map(option => ({ option, votes: 0 })), // Adjust based on your backend expectations
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create poll');
      }
      const newPoll = await response.json();
      onPollSubmit(newPoll); // Make sure `onPollSubmit` updates your state or otherwise integrates the new poll into your app
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error(error.message);
    }
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