import ollama, { GenerateRequest } from 'ollama/browser';
import { useRef, useState } from 'react';
import { OllamaGenerateResponse } from '@src/@types';
import { isAbortable } from '../utils';

/**
 * A hook that allows to generate a response for a given prompt with a provided model.
 *
 * `useGenerate` provides:
 * - `answer` - state that contains the answer from the model. If the model is streaming, the answer will be updated as the model sends new messages.
 * - `sendMessage` - a function that sends a message to the model. The function accepts a `GenerateRequest` object. (refer to the [Ollama API documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion) for more information)
 * - `responseRef` - a reference to the response object. Can be used to read response metadata and to abort the request.
 * - `resetAnswer` - a function that resets the answer state.
 * - `resetResponse` - a function that resets the response reference.
 *
 * @param model
 * @param ollamaInstance
 * @returns
 */
export const useGenerate = (model: string, ollamaInstance = ollama) => {
  const [answer, setAnswer] = useState('');
  const responseRef = useRef<OllamaGenerateResponse>(null);

  /**
   * Sends a prompt to the model.
   *
   * If the model is streaming, the answer will be updated as the model sends new messages.
   *
   * If the model is not streaming, the answer will be updated with the response message once.
   *
   * @param request The request to send a prompt to the model.
   */
  const sendMessage = async ({
    prompt,
    suffix,
    system,
    template,
    raw,
    images,
    format,
    stream,
    keep_alive,
    options
  }: Omit<GenerateRequest, 'model'>): Promise<void> => {
    if (stream) {
      try {
        const response = await ollamaInstance.generate({
          model,
          prompt,
          suffix,
          system,
          template,
          stream,
          raw,
          format,
          images,
          keep_alive,
          options
        });
        responseRef.current = response;

        let content = '';
        for await (const chunk of response) {
          content += chunk.response;
          setAnswer(content);
        }
      } catch (e) {
        console.error('Failed to generate response:', e);
      }
    } else {
      const responsePromise = ollamaInstance.generate({
        model,
        prompt,
        suffix,
        system,
        template,
        stream,
        raw,
        format,
        images,
        keep_alive,
        options
      });
      responseRef.current = responsePromise;

      try {
        const response = await responsePromise;
        setAnswer(response.response);
      } catch (e) {
        console.error('Failed to generate response:', e);
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
