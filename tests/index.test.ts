import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat, useGenerate, reactOllama, isAbortable } from '../src';

describe('useChat', () => {
  it('should be defined', () => {
    expect(useChat).toBeDefined();
  });

  it('returns an object with the correct properties', () => {
    const { result } = renderHook(() => useChat('model'));
    const { answer, sendMessage, responseRef, resetAnswer, resetResponse, abort } = result.current;

    expect(answer).toBeDefined();
    expect(sendMessage).toBeDefined();
    expect(responseRef).toBeDefined();
    expect(resetAnswer).toBeDefined();
    expect(resetResponse).toBeDefined();
    expect(abort).toBeDefined();
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

  it('handles errors in streamable response', async () => {
    const mockOllama = {
      chat: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    //@ts-expect-error mocked ollama instance
    const { result } = renderHook(() => useChat('test-model', mockOllama));

    await act(async () => {
      await result.current.sendMessage({
        messages: [{ role: 'user', content: 'Hello' }],
        stream: true
      });
    });

    expect(mockOllama.chat).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Failed to chat with model:', expect.any(Error));
  });

  it('handles errors in non-streamable response', async () => {
    const mockOllama = {
      chat: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    //@ts-expect-error mocked ollama instance
    const { result } = renderHook(() => useChat('test-model', mockOllama));

    await act(async () => {
      await result.current.sendMessage({
        messages: [{ role: 'user', content: 'Hello' }]
      });
    });

    expect(mockOllama.chat).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Failed to chat with model:', expect.any(Error));
  });

  it('calls abort on responseRef if it is an abortable iterator', async () => {
    const { result } = renderHook(() => useChat('model'));
    const { sendMessage, abort, responseRef } = result.current;

    await act(async () => {
      await sendMessage({ messages: [{ role: 'user', content: 'Hello, world!' }], stream: true });
    });

    expect(responseRef.current).toBeDefined();

    const response = responseRef.current as unknown as { abort: () => void };

    const abortSpy = vi.spyOn(response, 'abort');
    act(() => {
      abort();
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});

describe('useGenerate', () => {
  it('should be defined', () => {
    expect(useGenerate).toBeDefined();
  });

  it('returns an object with the correct properties', () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { answer, sendMessage, responseRef, resetAnswer, resetResponse, abort } = result.current;

    expect(answer).toBeDefined();
    expect(sendMessage).toBeDefined();
    expect(responseRef).toBeDefined();
    expect(resetAnswer).toBeDefined();
    expect(resetResponse).toBeDefined();
    expect(abort).toBeDefined();
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

  it('handles errors in streamable response', async () => {
    const mockOllama = {
      generate: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    //@ts-expect-error mocked ollama instance
    const { result } = renderHook(() => useGenerate('test-model', mockOllama));

    await act(async () => {
      await result.current.sendMessage({
        prompt: 'Hello, world!',
        stream: true
      });
    });

    expect(mockOllama.generate).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Failed to generate response:', expect.any(Error));
  });

  it('handles errors in non-streamable response', async () => {
    const mockOllama = {
      generate: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    //@ts-expect-error mocked ollama instance
    const { result } = renderHook(() => useGenerate('test-model', mockOllama));

    await act(async () => {
      await result.current.sendMessage({
        prompt: 'Hello, world!'
      });
    });

    expect(mockOllama.generate).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Failed to generate response:', expect.any(Error));
  });

  it('calls abort on responseRef if it is an abortable iterator', async () => {
    const { result } = renderHook(() => useGenerate('model'));
    const { sendMessage, abort, responseRef } = result.current;

    await act(async () => {
      await sendMessage({ prompt: 'Hello, world!', stream: true });
    });

    expect(responseRef.current).toBeDefined();

    const response = responseRef.current as unknown as { abort: () => void };

    const abortSpy = vi.spyOn(response, 'abort');
    act(() => {
      abort();
    });

    expect(abortSpy).toHaveBeenCalled();
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

describe('reactOllama generate', () => {
  it('returns a streamable generate response', async () => {
    const { generate } = reactOllama();
    const response = await generate({
      model: 'model',
      prompt: 'Hello, world!',
      stream: true
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('abort');
  });

  it('returns a non-streamable generate response', async () => {
    const { generate } = reactOllama();
    const response = await generate({
      model: 'model',
      prompt: 'Hello, world!'
    });

    expect(response).toBeDefined();
    expect(response).not.toHaveProperty('abort');
  });

  it('handles errors during generate', async () => {
    const mockOllama = {
      generate: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { generate } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await generate({
      model: 'model',
      prompt: 'Hello, world!',
      stream: true
    });

    expect(errorSpy).toHaveBeenCalledWith('Failed to generate response:', expect.any(Error));
  });
});

describe('reactOllama chat', () => {
  it('returns a streamable chat response', async () => {
    const { chat } = reactOllama();
    const response = await chat({
      model: 'model',
      messages: [{ role: 'user', content: 'Hello, world!' }],
      stream: true
    });
    expect(response).toBeDefined();
    expect(response).toHaveProperty('abort');
  });

  it('returns a non-streamable chat response', async () => {
    const { chat } = reactOllama();
    const response = await chat({
      model: 'model',
      messages: [{ role: 'user', content: 'Hello, world!' }]
    });

    expect(response).toBeDefined();
    expect(response).not.toHaveProperty('abort');
  });

  it('handles errors during chat', async () => {
    const mockOllama = {
      chat: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { chat } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await chat({
      model: 'model',
      messages: [{ role: 'user', content: 'Hello, world!' }],
      stream: true
    });

    expect(errorSpy).toHaveBeenCalledWith('Failed to chat with model:', expect.any(Error));
  });
});

describe('reactOllama pullModel', () => {
  it('returns a streamable pullModel response', async () => {
    const { pullModel } = reactOllama();
    const response = await pullModel({
      model: 'model',
      stream: true
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('abort');
  });

  it('returns a non-streamable pullModel response', async () => {
    const { pullModel } = reactOllama();
    const response = await pullModel({
      model: 'model'
    });

    expect(response).toBeDefined();
    expect(response).not.toHaveProperty('abort');
  });

  it('handles errors during pullModel', async () => {
    const mockOllama = {
      pull: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { pullModel } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await pullModel({
      model: 'model',
      stream: true
    });

    expect(errorSpy).toHaveBeenCalledWith('Failed to pull model:', expect.any(Error));
  });
});

describe('reactOllama pushModel', () => {
  it('returns a streamable pushModel response', async () => {
    const { pushModel } = reactOllama();
    const response = await pushModel({
      model: 'model',
      stream: true
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('abort');
  });

  it('returns a non-streamable pushModel response', async () => {
    const { pushModel } = reactOllama();
    const response = await pushModel({
      model: 'model'
    });

    expect(response).toBeDefined();
    expect(response).not.toHaveProperty('abort');
  });

  it('handles errors during pushModel', async () => {
    const mockOllama = {
      pull: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { pushModel } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await pushModel({
      model: 'model',
      stream: true
    });

    expect(errorSpy).toHaveBeenCalledWith('Failed to push model:', expect.any(Error));
  });
});

describe('reactOllama createModel', () => {
  it('returns a streamable createModel response', async () => {
    const { createModel } = reactOllama();
    const response = await createModel({
      model: 'model',
      stream: true
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('abort');
  });

  it('returns a non-streamable createModel response', async () => {
    const { createModel } = reactOllama();
    const response = await createModel({
      model: 'model'
    });

    expect(response).toBeDefined();
    expect(response).not.toHaveProperty('abort');
  });

  it('handles errors during createModel', async () => {
    const mockOllama = {
      pull: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { createModel } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await createModel({
      model: 'model',
      stream: true
    });

    expect(errorSpy).toHaveBeenCalledWith('Failed to create model:', expect.any(Error));
  });
});

describe('reactOllama deleteModel', () => {
  it('returns a deleteModel response', async () => {
    const { deleteModel } = reactOllama();
    const response = await deleteModel('llama');

    expect(response).toBeDefined();
    expect(response).toBe('200 OK');
  });

  it('handles errors during deleteModel', async () => {
    const mockOllama = {
      pull: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { deleteModel } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await deleteModel('llama');

    expect(errorSpy).toHaveBeenCalledWith('Failed to delete model:', expect.any(Error));
  });
});

describe('reactOllama copyModel', () => {
  it('returns a copyModel response', async () => {
    const { copyModel } = reactOllama();
    const response = await copyModel({ source: 'llama', destination: 'llama-copy' });

    expect(response).toBeDefined();
    expect(response).toBe('200 OK');
  });

  it('handles errors during copyModel', async () => {
    const mockOllama = {
      pull: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { copyModel } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await copyModel({ source: 'llama', destination: 'llama-copy' });

    expect(errorSpy).toHaveBeenCalledWith('Failed to copy model:', expect.any(Error));
  });
});

describe('reactOllama listModels', () => {
  it('returns a list of models', async () => {
    const { listModels } = reactOllama();
    const response = await listModels();

    expect(response).toBeDefined();
    expect(Array.isArray(response)).toBe(true);
  });

  it('handles errors during listModels', async () => {
    const mockOllama = {
      list: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { listModels } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await listModels();

    expect(errorSpy).toHaveBeenCalledWith('Failed to list all models:', expect.any(Error));
  });
});

describe('reactOllama showModel', () => {
  it('returns a model details', async () => {
    const { showModel } = reactOllama();
    const response = await showModel({ model: 'llama' });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('license');
    expect(response).toHaveProperty('modelfile');
    expect(response).toHaveProperty('parameters');
    expect(response).toHaveProperty('template');
    expect(response).toHaveProperty('system');
    expect(response).toHaveProperty('details');
    expect(Array.isArray(response?.messages)).toBe(true);
    expect(response).toHaveProperty('modified_at');
    expect(response).toHaveProperty('model_info');
  });

  it('handles errors during showModel', async () => {
    const mockOllama = {
      pull: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { showModel } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await showModel({ model: 'llama' });

    expect(errorSpy).toHaveBeenCalledWith('Failed to show model:', expect.any(Error));
  });
});

describe('reactOllama listRunningModels', () => {
  it('returns a list of running models', async () => {
    const { listRunningModels } = reactOllama();
    const response = await listRunningModels();

    expect(response).toBeDefined();
    expect(Array.isArray(response)).toBe(true);
  });

  it('handles errors during listRunningModels', async () => {
    const mockOllama = {
      list: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { listRunningModels } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await listRunningModels();

    expect(errorSpy).toHaveBeenCalledWith('Failed to list all running models:', expect.any(Error));
  });
});

describe('reactOllama generateEmbed', () => {
  it('returns a embed response', async () => {
    const { generateEmbed } = reactOllama();
    const response = await generateEmbed({
      model: 'model',
      input: 'Hello, world!'
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('model');
    expect(Array.isArray(response?.embeddings)).toBe(true);
  });

  it('handles errors during generateEmbed', async () => {
    const mockOllama = {
      generate: vi.fn().mockRejectedValue(new Error('Test error'))
    };

    //@ts-expect-error mocked ollama instance
    const { generateEmbed } = reactOllama(mockOllama);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await generateEmbed({
      model: 'model',
      input: 'Hello, world!'
    });

    expect(errorSpy).toHaveBeenCalledWith('Failed to generate embed:', expect.any(Error));
  });
});

describe('reactOllama abort', () => {
  it('should be defined', () => {
    const { abort } = reactOllama();
    expect(abort).toBeDefined();
  });

  it('calls the abort method', async () => {
    const result = reactOllama();
    const abortSpy = vi.spyOn(result, 'abort');

    act(() => {
      result.abort();
    });

    expect(abortSpy).toHaveBeenCalled();
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
