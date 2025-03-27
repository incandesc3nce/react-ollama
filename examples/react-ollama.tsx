import React from 'react';
import { isAbortable, reactOllama } from 'react-ollama';

export const ServerOllama = async () => {
  const { generate, listRunningModels, listModels } = reactOllama();

  const generateResponse = await generate({
    model: 'llama3.2',
    prompt: 'What is the meaning of life?',
    stream: false
  });

  const content =
    !isAbortable(generateResponse) && generateResponse ? generateResponse.response : '';

  const runningModels = await listRunningModels();
  const models = await listModels();

  return (
    <div>
      <div>{content}</div>
      {runningModels.map((m) => (
        <div key={m.model}>
          <h1>{m.name}</h1>
        </div>
      ))}
      {models.map((m) => (
        <div key={m.model}>
          <h1>{m.name}</h1>
        </div>
      ))}
    </div>
  );
};
