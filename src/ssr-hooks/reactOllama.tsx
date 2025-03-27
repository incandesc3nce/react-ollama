import ollama, {
  GenerateRequest,
  GenerateResponse,
  ChatRequest,
  ChatResponse,
  CopyRequest,
  CreateRequest,
  EmbedRequest,
  EmbedResponse,
  ModelResponse,
  Ollama,
  PullRequest,
  PushRequest,
  ShowRequest,
  ShowResponse
} from 'ollama/browser';
import { OllamaAbortableIterator, OllamaProgressResponse } from '@src/@types';

/**
 * A hook to interact with the Ollama instance.
 *
 * This hook provides methods to:
 * - Generate a response for a given prompt with a provided model (`generate`)
 * - Generate the next message in a chat with a provided model (`chat`)
 * - Pull a model from ollama library (`pullModel`)
 * - Push a model to model library (`pushModel`)
 * - Create a model from a base model (`createModel`)
 * - Delete a model (`deleteModel`)
 * - Copy a model (`copyModel`)
 * - List all available local models (`listModels`)
 * - Show information about a model (`showModel`)
 * - List all currently running models (`listRunningModels`)
 * - Generate an embed from a model (`generateEmbed`)
 * - Abort all streamed generations (`abort`)
 *
 * All methods support SSR (Server Components), but can also be used within Client Components via React hooks.
 *
 * @param {Ollama} [ollamaInstance=ollama] An instance of the Ollama class. Defaults to the global `ollama` instance.
 */
export const reactOllama = (ollamaInstance: Ollama = ollama) => {
  /**
   * Generate a response for a given prompt with a provided model.
   *
   * Refer to [Ollama API documentation of "Generate a completion"](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion) for more information.
   *
   * @param param0
   * @returns
   */
  const generate = async ({
    model,
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
  }: GenerateRequest): Promise<
    GenerateResponse | OllamaAbortableIterator<GenerateResponse> | null
  > => {
    try {
      if (stream) {
        const iterator = await ollamaInstance.generate({
          model,
          prompt,
          suffix,
          system,
          template,
          raw,
          images,
          format,
          stream: true,
          keep_alive,
          options
        });

        return iterator;
      } else {
        const response = await ollamaInstance.generate({
          model,
          prompt,
          suffix,
          system,
          template,
          raw,
          images,
          format,
          stream: false,
          keep_alive,
          options
        });

        return response;
      }
    } catch (e) {
      console.error('Failed to generate response:', e);
      return null;
    }
  };

  /**
   * Generate the next message in a chat with a provided model.
   *
   * Refer to the [Ollama API documentation of "Generate a chat completion"](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion) for more information.
   *
   * @param {ChatRequest} request The request to chat with a model.
   * @returns {Promise<ChatResponse | OllamaAbortableIterator<ChatResponse> | null>} A promise that resolves with the chat response. If the request fails, null is returned.
   */
  const chat = async ({
    model,
    messages,
    stream,
    format,
    keep_alive,
    tools,
    options
  }: ChatRequest): Promise<ChatResponse | OllamaAbortableIterator<ChatResponse> | null> => {
    try {
      if (stream) {
        const iterator = await ollamaInstance.chat({
          model,
          messages,
          stream: true,
          format,
          keep_alive,
          tools,
          options
        });

        return iterator;
      } else {
        const response = await ollamaInstance.chat({
          model,
          messages,
          stream: false,
          format,
          keep_alive,
          tools,
          options
        });

        return response;
      }
    } catch (e) {
      console.error('Failed to chat with model:', e);
      return null;
    }
  };

  /**
   * Downloads a model from the Ollama library.
   *
   * Refer to the [Ollama API documentation of "Pull a Model"](https://github.com/ollama/ollama/blob/main/docs/api.md#pull-a-model) for more information.
   *
   * @param {PullRequest} request The request to pull a model.
   * @returns {Promise<OllamaProgressResponse>} A progress response of the pull operation.
   */
  const pullModel = async ({
    model,
    insecure,
    stream
  }: PullRequest): Promise<OllamaProgressResponse> => {
    try {
      if (stream) {
        const progress = await ollamaInstance.pull({
          model,
          insecure,
          stream
        });

        return progress;
      } else {
        const progress = await ollamaInstance.pull({
          model,
          insecure,
          stream: false
        });

        return progress;
      }
    } catch (e) {
      console.error('Failed to pull model:', e);
      return null;
    }
  };

  /**
   * Uploads a model to the Ollama library.
   *
   * Refer to the [Ollama API documentation of "Push a Model"](https://github.com/ollama/ollama/blob/main/docs/api.md#push-a-model) for more information.
   *
   * @param {PushRequest} request The request to push a model.
   * @returns {Promise<OllamaProgressResponse>} A progress response of the push operation.
   */
  const pushModel = async ({
    model,
    insecure,
    stream
  }: PushRequest): Promise<OllamaProgressResponse> => {
    try {
      if (stream) {
        const progress = await ollamaInstance.push({
          model,
          insecure,
          stream
        });

        return progress;
      } else {
        const progress = await ollamaInstance.push({
          model,
          insecure,
          stream: false
        });

        return progress;
      }
    } catch (e) {
      console.error('Failed to push model:', e);
      return null;
    }
  };

  /**
   * Creates a new model from a base model. The request object should contain the name of the new model and the base model.
   *
   * Refer to the [Ollama API documentation of "Create a Model"](https://github.com/ollama/ollama/blob/main/docs/api.md#create-a-model) for more information.
   *
   * @param {CreateRequest} request -
   * @returns {Promise<OllamaProgressResponse>} A progress response of the create operation.
   */
  const createModel = async ({
    model,
    from,
    stream,
    quantize,
    template,
    license,
    system,
    parameters,
    messages,
    adapters
  }: CreateRequest): Promise<OllamaProgressResponse> => {
    try {
      if (stream) {
        const progress = await ollamaInstance.create({
          model,
          from,
          stream,
          quantize,
          template,
          license,
          system,
          parameters,
          messages,
          adapters
        });

        return progress;
      } else {
        const progress = await ollamaInstance.create({
          model,
          from,
          stream: false,
          quantize,
          template,
          license,
          system,
          parameters,
          messages,
          adapters
        });

        return progress;
      }
    } catch (e) {
      console.error('Failed to create model:', e);
      return null;
    }
  };

  /**
   * Deletes a model and it's data. The request object should contain the name of the model.
   *
   * Refer to the [Ollama API documentation of "Delete a Model"](https://github.com/ollama/ollama/blob/main/docs/api.md#delete-a-model) for more information.
   *
   * @param model Model name to delete.
   * @returns {Promise<string | null>} A promise that resolves with:
   * - a status code of either `200 OK` if successful or `404 Not Found` if the model to be deleted doesn't exist.
   * - null if the request failed.
   */
  const deleteModel = async (model: string): Promise<string | null> => {
    try {
      const response = await ollamaInstance.delete({ model });

      return response.status;
    } catch (e) {
      console.error('Failed to delete model:', e);

      return null;
    }
  };

  /**
   * Copies a model. Creates a model with another name from an existing model.
   *
   * Refer to the [Ollama API documentation of "Copy a Model"](https://github.com/ollama/ollama/blob/main/docs/api.md#copy-a-model) for more information.
   *
   * @param request - The request containing source and destination model names respectively.
   * @returns {Promise<string | null>} A promise that resolves with:
   * - a status code of either `200 OK` if successful or `404 Not Found` if the source model doesn't exist.
   * - null if the request failed.
   */
  const copyModel = async ({ source, destination }: CopyRequest): Promise<string | null> => {
    try {
      const response = await ollamaInstance.copy({ source, destination });
      return response.status;
    } catch (e) {
      console.error('Failed to copy model:', e);

      return null;
    }
  };

  /**
   * Lists all available local models.
   *
   * Refer to the [Ollama API documentation of "List Local Models"](https://github.com/ollama/ollama/blob/main/docs/api.md#list-local-models) for more information.
   *
   * @returns A Promise that resolves with a list of all available models. If the request fails, an empty array is returned.
   */
  const listModels = async (): Promise<ModelResponse[]> => {
    try {
      const list = await ollamaInstance.list();
      return list.models;
    } catch (e) {
      console.error('Failed to list all models:', e);
      return [];
    }
  };

  /**
   * Shows the metadata of a model. The request object should contain the name of the model.
   *
   * @param request
   * @returns {Promise<ShowResponse | null>} A promise that resolves with the model metadata. If the request fails, null is returned.
   */
  const showModel = async ({
    model,
    system,
    template,
    options
  }: ShowRequest): Promise<ShowResponse | null> => {
    try {
      const response = await ollamaInstance.show({ model, system, template, options });
      return response;
    } catch (e) {
      console.error('Failed to show model:', e);
      return null;
    }
  };

  /**
   * Lists all currently running models within the Ollama instance.
   *
   * @returns {Promise<ModelResponse[]>} A list of all running models.
   */
  const listRunningModels = async (): Promise<ModelResponse[]> => {
    try {
      const list = await ollamaInstance.ps();
      return list.models;
    } catch (e) {
      console.error('Failed to list all running models:', e);
      return [];
    }
  };

  /**
   * Generates an embed from a model.
   *
   * @returns {Promise<EmbedResponse | null>} A promise that resolves with the embed response. If the request fails, null is returned.
   */
  const generateEmbed = async ({
    model,
    input,
    truncate,
    keep_alive,
    options
  }: EmbedRequest): Promise<EmbedResponse | null> => {
    try {
      const response = await ollamaInstance.embed({
        model,
        input,
        truncate,
        keep_alive,
        options
      });
      return response;
    } catch (e) {
      console.error('Failed to generate embed:', e);
      return null;
    }
  };

  /**
   * Aborts all streamed generations currently running within the Ollama instance.
   *
   * All synchronous threads listening to streams (typically the `for await (const chunk of stream)`) will throw an `AbortError` exception.
   */
  const abort = (): void => {
    ollamaInstance.abort();
  };

  return {
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
  };
};
