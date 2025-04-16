# react-ollama

Integrate [Ollama](https://github.com/ollama/ollama) into your React application.

react-ollama is a simple wrapper library around [ollama-js](https://github.com/ollama/ollama-js), providing React hooks to interact with Ollama in React applications in a more convenient way.

| Statements | Branches | Functions | Lines |
|-----------|----------|-----------|-------|
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

## Install

```
npm i react-ollama
```

## Features

- ⚛️ React hooks to interact with Ollama🦙
- 🤝 Fully compatible with browser environment (even static sites!)
- 🌐 SSR support
- 🟦 100% TypeScript
- ✅ Supports all Ollama API endpoints

## Usage

react-ollama provides the following functions to interact with Ollama:

- `useGenerate` - React hook to generate a response for a given prompt with a provided model.

```tsx
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
```

- `useChat` - React hook to interact with Ollama in a chat-like interface.

```tsx
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
```

- `reactOllama` - function to interact with the Ollama in a more flexible way. Supports Server Components and all of the Ollama API endpoints.
  Provides the following methods:

  - `generate` - Generate a response for a given prompt with a provided model.
  - `chat` - Generate the next message in a chat with a provided model.
  - `pullModel` - Downloads a model from the Ollama library.
  - `pushModel` - Uploads a model to the Ollama library.
  - `createModel` - Creates a new model from a base model.
  - `deleteModel` - Deletes a model and it's data.
  - `copyModel` - Copies a model to create a new model with a different name.
  - `listModels` - Lists all available local models.
  - `showModel` - Shows metadata of a specific model.
  - `listRunningModels` - Lists all currently running models.
  - `generateEmbed` - Generates an embed from a model.
  - `abort` - Aborts all streamed generations currently running.

```tsx
import { isAbortable, reactOllama } from 'react-ollama';

export const ServerReactOllama = async () => {
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
```

react-ollama comes in with default Ollama client, but you are free to provide your own clients:

```tsx
import { Ollama } from 'react-ollama';

export const ollamaInstance = new Ollama({
  host: 'http://localhost:8000'
});
```

```tsx
import { ollamaInstance } from './ollamaInstance';
import { useGenerate } from 'react-ollama';

export const CustomOllamaComponent = () => {
  const { answer, sendMessage } = useGenerate('llama3.2', ollamaInstance);

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
```

## Contributing

Any contributions are welcome! Feel free to open an issue or a pull request here:

- [Pull request](https://github.com/incandesc3nce/react-ollama/pulls)
- [Issue](https://github.com/incandesc3nce/react-ollama/issues)

## Credits

- [Ollama](https://ollama.com/) for creating a great tool to run LLMs locally.
- [ollama-js](https://github.com/ollama/ollama-js) for JS library to interact with Ollama and making this possible.
