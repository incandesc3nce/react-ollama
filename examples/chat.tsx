import React from 'react';
import { useChat } from 'react-ollama';

export const ChatExample = () => {
  const { answer, sendMessage } = useChat('llama3.2');

  const handleClick = () => {
    sendMessage({
      messages: [
        {
          role: 'user',
          content: 'You are an expert philosopher. Give me an answer in 20 words or less.'
        },
        {
          role: 'user',
          content: 'Now, tell me: what is the meaning of life?'
        }
      ],
      stream: true
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Chat</button>
      <p>{answer}</p>
    </div>
  );
};
