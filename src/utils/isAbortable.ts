import { Abortable } from '@src/@types';

/**
 * Checks if the response from the Ollama API is an abortable iterator (of type `OllamaAbortableIterator`).
 *
 * This function is an asset for polyfill implementation of `AbortableAsyncIterator` from `OllamaAbortableIterator` type.
 *
 * @param response - The response object from the Ollama API.
 * @returns `true` if the response is an abortable iterator, `false` otherwise.
 */
export const isAbortable = (response: unknown): response is Abortable => {
  return !!response && typeof (response as Abortable).abort === 'function';
};
