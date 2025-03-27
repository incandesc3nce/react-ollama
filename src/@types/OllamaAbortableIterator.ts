export interface Abortable {
  abort(): void;
}

/**
 * Type for polyfilling the `AbortableAsyncIterator` type from Ollama library.
 *
 * Due to being unable to import the `AbortableAsyncIterator` type from the `'ollama/browser'` module,
 * this type is used as a temporary workaround.
 */
export type OllamaAbortableIterator<T> = Omit<AsyncIterator<T> & Abortable, 'next'>;
