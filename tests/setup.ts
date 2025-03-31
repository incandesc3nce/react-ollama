import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

vi.mock(import('ollama/browser'), async (importOriginal) => {
  const ollamaModule = await importOriginal();
  const ollama = ollamaModule.default;

  // Mocked responses
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

  const progress = {
    status: 'ok',
    digest: 'test',
    total: 100,
    completed: 100
  };

  const statusResponse = {
    status: '200 OK'
  };

  const detailsResponse = {
    parent_model: 'test',
    format: 'raw',
    family: 'llama',
    families: ['llama'],
    parameter_size: '7B',
    quantization_level: 'q4_0'
  };

  const listResponse = {
    models: [
      {
        name: 'test',
        modified_at: new Date(),
        model: 'test',
        size: 100,
        digest: 'test',
        details: detailsResponse,
        expires_at: new Date(),
        size_vram: 1024
      }
    ]
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
          yield progress;
        },
        abort: () => {
          return;
        }
      };
    } else {
      return progress;
    }
  };

  // @ts-expect-error - This includes a simplified mocked iterator, that does not match the actual implementation.
  ollama.pull = async (req) => {
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
  ollama.push = async (req) => {
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
  ollama.create = async (req) => {
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

  ollama.delete = async () => {
    return statusResponse;
  };

  ollama.copy = async () => {
    return statusResponse;
  };

  ollama.list = async () => {
    return listResponse;
  };

  ollama.show = async () => {
    return {
      license: 'MIT',
      modelfile: 'test',
      parameters: '7B',
      template: 'test',
      system: 'test',
      details: detailsResponse,
      messages: [],
      modified_at: new Date(),
      model_info: new Map(),
      projector_info: new Map()
    };
  };

  ollama.ps = async () => {
    return listResponse;
  };

  ollama.embed = async () => {
    return {
      model: 'llama',
      embeddings: [
        [100, 200, 300],
        [400, 500, 600]
      ]
    };
  };

  return {
    ...ollamaModule,
    ollama
  };
});

afterEach(() => {
  cleanup();
});
