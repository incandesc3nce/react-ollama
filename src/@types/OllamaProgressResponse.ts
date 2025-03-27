import { ProgressResponse } from 'ollama/browser';
import { OllamaAbortableIterator } from './OllamaAbortableIterator';

/**
 * The response of request's progress from an Ollama instance.
 *
 * This can be:
 * - an abortable async iterator (if `stream` is `true`), which is a stream of objects and can be aborted using the `abort` function.
 * - a progress response (if `stream` is `false` or `undefined`), which is a single response object.
 * - `null` (if an error was thrown).
 */
export type OllamaProgressResponse =
  | OllamaAbortableIterator<ProgressResponse>
  | ProgressResponse
  | null;
