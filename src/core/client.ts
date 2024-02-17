import { TogetherChatParams, TogetherChatResponse, TogetherChatStreamedResponse, TogetherCodeParams, TogetherCodeResponse, TogetherEmbeddingParams, TogetherEmbeddingResponse, TogetherImageParams, TogetherImageResponse, TogetherInferenceParams, TogetherInferenceResponse, TogetherLanguageParams, TogetherLanguageResponse, TogetherLanguageStreamedResponse } from './client.types'
import { RawTogetherConfig, rawTogetherRequest } from './raw'
import { camelCase2snakeCase, snakeCase2camelCase } from '../utils/caseConverter'
import { indexArray } from '../utils/indexArray'
import { streamEvents } from './streamEvents'

export type TogetherClientConfig = Omit<RawTogetherConfig, 'endpoint' | 'requestParams'>

export interface TogetherClient {
  /**
   * Queries the chat completion API to produce a chat message from the assistant in response to a chat history
   * @param params - all of the parameters to send to the API
   * @see https://docs.together.ai/reference/chat-completions
   * @throws the response when the status is not 200 or if the body is not present when streaming tokens
   * @returns the response from the API when it has been completed
   */
  chat: (params: TogetherChatParams) => Promise<TogetherChatResponse>
  /**
   * Queries the language completion API to produce a continuation of the prompt
   * @param params - all of the parameters to send to the API
   * @see https://docs.together.ai/reference/completions
   * @throws the response when the status is not 200 or if the body is not present when streaming tokens
   * @returns the response from the API when it has been completed
   */
  language: (params: TogetherLanguageParams) => Promise<TogetherLanguageResponse>
  /**
   * Queries the API to produce any result
   * @deprecated please use other endpoints
   * @param params - all of the parameters to send to the API
   * @see https://docs.together.ai/reference/inference
   * @throws the response when the status is not 200 or if the body is not present when streaming tokens
   * @returns the response from the API when it has been completed
   */
  inference: (params: TogetherInferenceParams) => Promise<TogetherInferenceResponse>
  /**
   * Queries the code completion API to produce a continuation of the prompt
   * @param params - all of the parameters to send to the API
   * @see https://docs.together.ai/reference/completions
   * @throws the response when the status is not 200 or if the body is not present when streaming tokens
   * @returns the response from the API when it has been completed
   */
  code: (params: TogetherCodeParams) => Promise<TogetherCodeResponse>
  /**
   * Queries the embedding API to produce an embedding vector for the input
   * @param params - all of the parameters to send to the API
   * @see https://docs.together.ai/reference/embeddings
   * @throws the response when the status is not 200
   * @returns the response from the API when it has been completed
   */
  embedding: (params: TogetherEmbeddingParams) => Promise<TogetherEmbeddingResponse>
  /**
   * Queries the image creation API to produce an image from the prompt
   * @param params - all of the parameters to send to the API
   * @see https://docs.together.ai/reference/completions
   * @throws the response when the status is not 200
   * @returns the response from the API when it has been completed
   */
  image: (params: TogetherImageParams) => Promise<TogetherImageResponse>
  // startFineTuning: () => Promise<void>
  // stopFineTuning: () => Promise<void>
  // listFineTuningInstances: () => Promise<void>
}

/**
 * The complete together client with all of the endpoints
 * @param config - a configuration object to use for the client
 * @returns the client to use to send requests to the Together API
 */
export const togetherClient = (config: TogetherClientConfig): TogetherClient => {
  const chat = async (params: TogetherChatParams): Promise<TogetherChatResponse> => {
    const response = await rawTogetherRequest({
      ...config,
      endpoint: 'v1/chat/completions',
      requestParams: {
        ...camelCase2snakeCase(params),
        stream: params.streamCallback !== undefined ? true : undefined
      }
    })

    if (response.status !== 200) {
      throw response
    }

    if (params.streamCallback === undefined) {
      return snakeCase2camelCase(await response.json())
    }

    if (response.body == null) {
      throw response
    }

    const completeResponse = {
      model: params.model,
      object: 'chat.completion',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      choices: indexArray(params.n ?? 1).map(i => ({ index: i, message: { role: 'assistant', content: '' } }))
    } as TogetherChatResponse

    const reader = response.body.getReader()
    await streamEvents(reader, async event => {
      if (event === 'done') {
        await params.streamCallback?.(event)
        return
      }

      const data = event as TogetherChatStreamedResponse
      completeResponse.id = data.id
      completeResponse.created = data.created
      completeResponse.usage = {
        promptTokens: completeResponse.usage.promptTokens,
        completionTokens: completeResponse.usage.completionTokens + data.choices.length,
        totalTokens: completeResponse.usage.totalTokens + data.choices.length
      }

      data.choices.forEach(choice => {
        completeResponse.choices[choice.index].message.content += choice.delta.content
      })

      if (data.usage != null) {
        completeResponse.usage = data.usage
      }

      await params.streamCallback?.(data)
    })

    return { ...completeResponse, choices: completeResponse.choices.map(c => ({
      ...c,
      message: {
        ...c.message,
        content: c.message.content.trim()
      } 
    })) }
  }

  const language = async (params: TogetherLanguageParams): Promise<TogetherLanguageResponse> => {
    const response = await rawTogetherRequest({
      ...config,
      endpoint: 'v1/completions',
      requestParams: {
        ...camelCase2snakeCase(params),
        stream: params.streamCallback !== undefined ? true : undefined
      }
    })

    if (response.status !== 200) {
      throw response
    }

    if (params.streamCallback === undefined) {
      return snakeCase2camelCase(await response.json())
    }

    if (response.body == null) {
      throw response
    }

    const completeResponse = {
      model: params.model,
      object: 'language.completion',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      choices: indexArray(params.n ?? 1).map(_ => ({ text: '' })),
      created: Math.floor(Date.now() / 1000)
    } as TogetherLanguageResponse

    const reader = response.body.getReader()
    await streamEvents(reader, async event => {
      if (event === 'done') {
        await params.streamCallback?.(event)
        return
      }

      const data = event as TogetherLanguageStreamedResponse
      completeResponse.id = data.id
      completeResponse.usage = {
        promptTokens: completeResponse.usage.promptTokens,
        completionTokens: completeResponse.usage.completionTokens + data.choices.length,
        totalTokens: completeResponse.usage.totalTokens + data.choices.length
      }

      data.choices.forEach((choice, i) => {
        completeResponse.choices[i].text += choice.text
      })

      if (data.usage != null) {
        completeResponse.usage = data.usage
      }

      await params.streamCallback?.(data)
    })

    return { ...completeResponse, choices: completeResponse.choices.map(c => ({ ...c, text: c.text.trim() })) }
  }

  const inference = async (params: TogetherInferenceParams): Promise<TogetherInferenceResponse> => {
    const response = await rawTogetherRequest({
      ...config,
      endpoint: 'inference',
      requestParams: {
        ...camelCase2snakeCase(params),
        stream: false
      }
    })

    if (response.status !== 200) {
      throw response
    }

    return snakeCase2camelCase(await response.json())
  }

  const code = async (params: TogetherCodeParams): Promise<TogetherCodeResponse> => {
    return await language(params as unknown as TogetherLanguageParams)
  }

  const image = async (params: TogetherImageParams): Promise<TogetherImageResponse> => {
    return await inference({
      ...params,
      requestType: 'image-model-inference',
      seed: params.seed ?? Math.floor(Math.random() * 10000)
    })
  }

  const embedding = async (params: TogetherEmbeddingParams): Promise<TogetherEmbeddingResponse> => {
    const response = await rawTogetherRequest({
      ...config,
      endpoint: 'v1/embeddings',
      requestParams: {
        ...camelCase2snakeCase(params),
        stream: false
      }
    })

    if (response.status !== 200) {
      throw response
    }

    return snakeCase2camelCase(await response.json())
  }

  return {
    chat,
    language,
    inference,
    code,
    embedding,
    image
  }
}
