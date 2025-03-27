import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat, useGenerate, reactOllama, isAbortable } from '../src';

vi.mock(import('ollama/browser'), async (importOriginal) => {
  const ollamaModule = await importOriginal();
  const ollama = ollamaModule.default;
  const response = {
    model: 'model',
    created_at: new Date(),
    message: { role: 'user', content: 'Hello, world!' },
    done: true,
    done_reason: 'test',
    total_duration: 0,
    load_duration: 0,
    prompt_eval_count: 0,
    prompt_eval_duration: 0,
    eval_count: 0,
    eval_duration: 0
  };

  // @ts-expect-error - This includes a simplified mocked iterator, that does not match the actual implementation.
  ollama.chat = async (req) => {
    if (req.stream) {
      return {
        [Symbol.asyncIterator]: async function* () {
          yield response;
        },
        abort: () => {
          return;
        }
      };
    } else {
      return response;
    }
  };

  // @ts-expect-error - This includes a simplified mocked iterator, that does not match the actual implementation.
  ollama.generate = async (req) => {
    if (req.stream) {
      return {
        [Symbol.asyncIterator]: async function* () {
          yield response;
        },
        abort: () => {
          return;
        }
      };
    } else {
      return response;
    }
  };

  return {
    ...ollamaModule,
    ollama
  };
});

describe('useChat', () => {
  it('should be defined', () => {
    expect(useChat).toBeDefined();
  });

  it('returns an object with the correct properties', () => {
    const { result } = renderHook(() => useChat('model'));
    const { answer, sendMessage, responseRef, resetAnswer, resetResponse } = result.current;

    expect(answer).toBeDefined();
    expect(sendMessage).toBeDefined();
    expect(responseRef).toBeDefined();
    expect(resetAnswer).toBeDefined();
    expect(resetResponse).toBeDefined();
  });

  it('sends a message without stream and sets answer', async () => {
    const { result } = renderHook(() => useChat('model'));
    const { sendMessage } = result.current;

    const messages = [{ role: 'user', content: 'Hello, world!' }];

    await act(async () => {
      await sendMessage({ messages });
    });

    await waitFor(() => {
      expect(result.current.answer).not.toBe('');
    });
  });

  it('sends a message with stream and sets answer', async () => {
    const { result } = renderHook(() => useChat('model'));
    const { sendMessage } = result.current;

    const messages = [{ role: 'user', content: 'Hello, world!' }];

    await act(async () => {
      await sendMessage({ messages, stream: true });
    });

    await waitFor(() => {
      expect(result.current.answer).not.toBe('');
    });
  });

  it('resets the answer', async () => {
    const { result } = renderHook(() => useChat('model'));
    const { sendMessage, resetAnswer } = result.current;

    const messages = [{ role: 'user', content: 'Hello, world!' }];

    await act(async () => {
      await sendMessage({ messages });
    });

    await waitFor(() => {
      expect(result.current.answer).not.toBe('');
    });

    act(() => {
      resetAnswer();
    });

    expect(result.current.answer).toBe('');
  });

  it('resets the response reference', async () => {
    const { result } = renderHook(() => useChat('model'));
    const { sendMessage, resetResponse } = result.current;

    const messages = [{ role: 'user', content: 'Hello, world!' }];

    await act(async () => {
      await sendMessage({ messages });
    });

    await waitFor(() => {
      expect(result.current.responseRef.current).toBeDefined();
    });

    act(() => {
      resetResponse();
    });

    expect(result.current.responseRef.current).toBeNull();
  });
});

describe('useGenerate', () => {
  it('should be defined', () => {
    expect(useGenerate).toBeDefined();
  });

  it('returns an object with the correct properties', () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { answer, sendMessage, responseRef, resetAnswer, resetResponse } = result.current;

    expect(answer).toBeDefined();
    expect(sendMessage).toBeDefined();
    expect(responseRef).toBeDefined();
    expect(resetAnswer).toBeDefined();
    expect(resetResponse).toBeDefined();
  });

  it('sends a message without stream and sets answer', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!' });
    });

    await waitFor(() => {
      expect(result.current.answer).not.toBe('');
    });
  });

  it('sends a message with stream and sets answer', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!', stream: true });
    });

    await waitFor(() => {
      expect(result.current.answer).not.toBe('');
    });
  });

  it('resets the answer', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage, resetAnswer } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!' });
    });

    await waitFor(() => {
      expect(result.current.answer).not.toBe('');
    });

    act(() => {
      resetAnswer();
    });

    expect(result.current.answer).toBe('');
  });

  it('resets the response reference', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage, resetResponse } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!' });
    });

    await waitFor(() => {
      expect(result.current.responseRef.current).toBeDefined();
    });

    act(() => {
      resetResponse();
    });

    expect(result.current.responseRef.current).toBeNull();
  });
});

describe('reactOllama', () => {
  it('should be defined', () => {
    expect(reactOllama).toBeDefined();
  });

  it('returns the an object with the correct properties', () => {
    const {
      generate,
      chat,
      pullModel,
      pushModel,
      createModel,
      deleteModel,
      copyModel,
      listModels,
      showModel,
      listRunningModels,
      generateEmbed,
      abort
    } = reactOllama();

    expect(generate).toBeDefined();
    expect(chat).toBeDefined();
    expect(pullModel).toBeDefined();
    expect(pushModel).toBeDefined();
    expect(createModel).toBeDefined();
    expect(deleteModel).toBeDefined();
    expect(copyModel).toBeDefined();
    expect(listModels).toBeDefined();
    expect(showModel).toBeDefined();
    expect(listRunningModels).toBeDefined();
    expect(generateEmbed).toBeDefined();
    expect(abort).toBeDefined();
  });
});

describe('isAbortable', () => {
  it('should be defined', () => {
    expect(isAbortable).toBeDefined();
  });

  it('returns false for null', () => {
    expect(isAbortable(null)).toBe(false);
  });

  it('returns true for abortable response', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage, responseRef } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!', stream: true });
      expect(isAbortable(responseRef.current)).toBe(true);
    });
  });

  it('returns false for non-abortable response', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage, responseRef } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!' });
      expect(isAbortable(responseRef.current)).toBe(false);
    });
  });
});
