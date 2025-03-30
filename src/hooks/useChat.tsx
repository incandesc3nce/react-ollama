import ollama, { ChatRequest } from 'ollama/browser';
import { useRef, useState } from 'react';
import { OllamaChatResponse } from '@src/@types';
import { isAbortable } from '../utils';

/**
 * A hook that allows to generate the next message in a chat with a provided model.
 *
 * `useChat` provides:
 * - `answer` - state that contains the answer from the model. If the model is streaming, the answer will be updated as the model sends new messages.
 * - `sendMessage` - a function that sends a message to the model. The function accepts a `ChatRequest` object. (refer to the [Ollama API documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion) for more information)
 * - `responseRef` - a reference to the response object. Can be used to read response metadata and to abort the request.
 * - `resetAnswer` - a function that resets the answer state.
 * - `resetResponse` - a function that resets the response reference.
 *
 * @param model The name of the model to chat with.
 * @param ollamaInstance The Ollama instance to use for chatting. Defaults to the global `ollama` instance.
 * @returns
 */
export const useChat = (model: string, ollamaInstance = ollama) => {
  const [answer, setAnswer] = useState('');
  const responseRef = useRef<OllamaChatResponse>(null);

  /**
   * Sends a message to the model.
   *
   * If the model is streaming, the answer will be updated as the model sends new messages.
   *
   * If the model is not streaming, the answer will be updated with the response message once.
   *
   * @param request The request to send a message to the model.
   */
  const sendMessage = async ({
    messages,
    stream,
    format,
    keep_alive,
    tools,
    options
  }: Omit<ChatRequest, 'model'>): Promise<void> => {
    if (stream) {
      try {
        const response = await ollamaInstance.chat({
          model,
          messages,
          stream,
          format,
          keep_alive,
          tools,
          options
        });

        responseRef.current = response;

        let content = '';
        for await (const chunk of response) {
          content += chunk.message.content;
          setAnswer(content);
        }
      } catch (e) {
        console.error('Failed to chat with model:', e);
      }
    } else {
      const responsePromise = ollamaInstance.chat({
        model,
        messages,
        stream,
        format,
        keep_alive,
        tools,
        options
      });

      responseRef.current = responsePromise;

      try {
        const response = await responsePromise;
        setAnswer(response.message.content);
      } catch (e) {
        console.error('Failed to chat with model:', e);
      }
    }
  };

  /**
   * Resets the answer state.
   */
  const resetAnswer = (): void => {
    setAnswer('');
  };

  /**
   * Resets the response reference.
   */
  const resetResponse = (): void => {
    responseRef.current = null;
  };

  /**
   * Aborts current streamable request.
   */
  const abort = (): void => {
    if (isAbortable(responseRef.current)) {
      responseRef.current.abort();
    }
  };

  return { answer, sendMessage, responseRef, resetAnswer, resetResponse, abort };
};
