import { TogetherChatModel, TogetherCodeModel, TogetherEmbeddingModel, TogetherImageModel, TogetherLanguageModel, TogetherModerationModel } from './models.types'

export interface ChatMessage {
  /**
   * The message content.
   */
  content: string
  /**
   * The message author.
   */
  role: 'user' | 'system' | 'assistant'
}

export interface TokenUsage {
  /**
   * The number of tokens used for the prompt.
   */
  promptTokens: number
  /**
   * The number of tokens used for the completion.
   */
  completionTokens: number
  /**
   * The total number of tokens used.
   */
  totalTokens: number
}

export interface TogetherChatParams {
  /**
   * The name of the model to query.
   */
  model: TogetherChatModel
  /**
   * A list of messages comprising the conversation so far.
   */
  messages: ChatMessage[]
  /**
   * The maximum number of tokens to generate.
   * @default 512
   */
  maxTokens?: number
  /**
   * A list of string sequences that will truncate (stop) inference text output.
   * For example, "" will stop generation as soon as the model generates the given token.
   * @default []
   */
  stop?: string[]
  /**
   * A decimal number that determines the degree of randomness in the response.
   * A value of 1 will always yield the same output.
   * A temperature less than 1 favors more correctness and is appropriate for question answering or summarization.
   * A value greater than 1 introduces more randomness in the output.
   * @default 0.7
   */
  temperature?: number
  /**
   * The nucleus parameter is used to dynamically adjust the number of choices for each predicted token based on the cumulative probabilities.
   * It specifies a probability threshold, below which all less likely tokens are filtered out.
   * This technique helps to maintain diversity and generate more fluent and natural-sounding text.
   * @default 0.7
   */
  topP?: number
  /**
   * Used to limit the number of choices for the next predicted word or token.
   * It specifies the maximum number of tokens to consider at each step, based on their probability of occurrence.
   * This technique helps to speed up the generation process
   * and can improve the quality of the generated text by focusing on the most likely options.
   * @default 50
   */
  topK?: number
  /**
   * A number that controls the diversity of generated text by reducing the likelihood of repeated sequences.
   * Higher values decrease repetition.
   * @default 1
   */
  repetitionPenalty?: number
  /**
   * How many completions to generate for each prompt.
   * @default 1
   */
  n?: number
  /**
   * If undefined, the function will hold until the entire response is generated until returning.
   * If not undefined, the response will be streamed to this function as it is received.
   * The callback is async so that it can be awaited for processing each event in order.
   * If you have no need for order, then you can simply not return a promise.
   * @param partialCompletion - a partial completion of the response, or 'done' when the response is complete.
   */
  streamCallback?: (partialCompletion: 'done' | TogetherChatStreamedResponse) => Promise<void> | void
}

export interface TogetherChatResponse {
  /**
   * A unique identifier for the response.
   */
  id: string
  /**
   * The list of completions for the prompt.
   * The number of completions is determined by the `n` parameter.
   */
  choices: Array<{
    /**
     * Why the response was finished.
     */
    finishReason: string
    /**
     * The index of the choice (corresponding to the `n` parameter)
     */
    index: number
    logprobs: null
    /**
     * The message completed from the LLM.
     */
    message: ChatMessage
  }>
  /**
   * The number of tokens used for the prompt & completion.
   */
  usage: TokenUsage
  /**
   * The timestamp of when the response was created.
   */
  created: number
  /**
   * Which model was used to generate the response.
   */
  model: TogetherChatModel
  /**
   * Which type of object this is.
   */
  object: 'chat.completion'
}

export interface TogetherChatStreamedResponse {
  /**
   * A unique identifier for the response.
   */
  id: string
  /**
   * The timestamp of when the response was created.
   */
  created: number
  /**
   * Which type of object this is.
   */
  object: 'chat.completion.chunk'
  /**
   * The partial completion of the response for each choice.
   */
  choices: Array<{
    /**
     * The index of the choice.
     */
    index: number
    /**
     * The partial completion of the response.
     */
    delta: {
      content: string
    }
  }>
  /**
   * Information about which token was generated.
   */
  token: {
    /**
     * The unique identifier for the token.
     */
    id: number
    /**
     * The text version of the token.
     */
    text: string
    /**
     * The log probability of the token.
     */
    logprob: number
    /**
     * If the token is special.
     */
    special: boolean
  }
  /**
   * The reason for finishing the response.
   * Undefined if the response is not finished.
   */
  finishReason?: string
  /**
   * The complete generated text.
   * Undefined if the response is not finished.
   */
  generatedText?: string
  stats: null
  /**
   * The usage information to be provided in the final event.
   * Undefined if the response is not finished.
   */
  usage?: TokenUsage
}

export type TogetherLanguageParams = Omit<TogetherChatParams, 'messages' | 'model' | 'streamCallback'> & {
  /**
   * The name of the model to query.
   */
  model: TogetherLanguageModel
  /**
   * A string providing context for the model to complete.
   */
  prompt: string
  /**
   * If undefined, the function will hold until the entire response is generated until returning.
   * If not undefined, the response will be streamed to this function as it is received.
   * The callback is async so that it can be awaited for processing each event in order.
   * If you have no need for order, then you can simply not return a promise.
   * @param partialCompletion - a partial completion of the response, or 'done' when the response is complete.
   */
  streamCallback?: (partialCompletion: 'done' | TogetherLanguageStreamedResponse) => Promise<void> | void
}

export type TogetherLanguageResponse = Omit<TogetherChatResponse, 'choices' | 'object' | 'model'> & {
  /**
   * The name of the model to query.
   */
  model: TogetherLanguageModel
  /**
   * Which type of object this is.
   */
  object: 'language.completion'
  /**
   * The list of completions for the prompt.
   * The number of completions is determined by the `n` parameter.
   */
  choices: Array<{
    /**
     * The completion of the prompt
     */
    text: string
  }>
}

export type TogetherLanguageStreamedResponse = Omit<TogetherChatStreamedResponse, 'stats' | 'choices' | 'object' | 'created'> & {
  /**
   * The choices coming back from the model.
   */
  choices: Array<{
    text: string
  }>
}

export type TogetherCodeParams = Omit<TogetherLanguageParams, 'model'> & {
  /**
   * The name of the model to query.
   */
  model: TogetherCodeModel
}

export type TogetherCodeResponse = TogetherLanguageResponse

export interface TogetherEmbeddingParams {
  /**
   * The name of the model to query.
   */
  model: TogetherEmbeddingModel
  /**
   * The string to embed.
   */
  input: string
}

export interface TogetherEmbeddingResponse {
  test: string
}

export interface TogetherImageParams {
  /**
   * The name of the model to query.
   */
  model: TogetherImageModel
  /**
   * The prompt for the image generator
   */
  prompt: string
  /**
   * The prompt for what not to include in the image
   * @default nothing
   */
  negativePrompt?: string
  /**
   * Width of the image to be generated
   * @default 1024
   */
  width?: number
  /**
   * Height of the image to be generated
   * @default 1024
   */
  height?: number
  /**
   * Number of steps to perform iterations on
   * @default 20
   */
  steps?: number
  /**
   * A seed to produce deterministic results
   * @default randomly generated
   */
  seed?: number
  /**
   * Number of images to generate
   * @default 1
   */
  n?: number
}

export type TogetherImageResponse = Pick<TogetherInferenceResponse, 'output'>

export interface TogetherInferenceParams {
  // both params
  model: TogetherChatModel | TogetherLanguageModel | TogetherCodeModel | TogetherImageModel | TogetherModerationModel | TogetherEmbeddingModel
  prompt?: string
  negativePrompt?: string
  n?: number
  requestType: string
  // language params
  messages?: ChatMessage[]
  maxTokens?: number
  promptFormatString?: string
  repetitionPenalty?: number
  stop?: string[]
  temperature?: number
  topP?: number
  topK?: number
  // image params
  seed?: number
  width?: number
  height?: number
  steps?: number
}

export interface TogetherInferenceResponse {
  args: TogetherInferenceParams
  model: TogetherInferenceParams['model']
  modelOwner: string
  numReturns: number
  output: {
    requestId: string
    resultType: string
    choices: Array<{
      imageBase64: string
    }>
  }
  prompt: string[]
  status: string
  subjobs: unknown[]
  tags: {}
}
