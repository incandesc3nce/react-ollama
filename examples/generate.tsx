import React from 'react';
import { useGenerate } from 'react-ollama';

export const GenerateExample = () => {
  const { answer, sendMessage } = useGenerate('llama3.2');

  const handleClick = () => {
    sendMessage({
      prompt: 'What is the meaning of life?',
      stream: true
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Generate</button>
      <p>{answer}</p>
    </div>
  );
};
