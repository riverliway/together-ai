# Together AI SDK
A 100% typescript client library to connect to the [together.ai](https://together.ai) API.

Features:

* Robust parsing and convenient wrapper for stream events
* Types for all request parameters, responses, and available models

* Automatic retry after failed API response with customizable cooldowns
* Allows for custom fetch implementation for testing or logging
* Browser support (although not recommended for security reasons)
* 100% test coverage
* No library dependencies

_This project is an open source community. It is not sponsored by the Together AI company._

If you have bugs or feature requests for the client library, feel free to submit an issue. If you have bugs or feature requests for the Together AI company, please [contact them directly](https://www.together.ai/contact).

## Installation

Install with NPM:

```
npm install together-ai-sdk
```

## Usage

See the [example scripts](https://github.com/riverliway/together-ai/tree/main/examples) for more example implementations.

Begin by instantiating a client with your API key:

```typescript
import { togetherClient } from 'together-ai-sdk'

const client = togetherClient({ apiKey: 'xxx' })
```

### Client Configuration

There are a number of configuration options supported to customize the behavior of the client.

**apiKey** - `string`

This is a required value that stores the API key for authenticating requests. Sign up for a key on [together.ai]()'s website.

**address** - `string`

An optional value to override the address of where the requests are sent to. Defaults to `api.together.xyz`.

**protocol** - `'http' | 'https'`

An optional value to override the protocol used in the requests. Defaults to `https`.

**retryCooldowns** - `number[]`

An optional value to set custom retry cooldowns for failed requests. Waits the specified number of milliseconds before retrying. The number of elements in this array determines how many retries are performed. Set to `[]` to disable retrying. Defaults to `[1000, 5000, 30000]`.

**customFetch** - `typeof fetch`

A custom fetch function to use to send the request. Useful for testing, logging, or to use a different fetch implementation. This library only uses the following fields from the fetch response:
   * status
   * body [Expecting stream reader]
   * json()

Defaults to built in `fetch`.

NOTE: If you are running in the browser, you _must_ set this field to: `customFetch: window.fetch.bind(window)`.

### Chat

To perform a chat inference, use the chat method on the client object:

```typescript
const result = await client.chat({
  model: TogetherChatModel.LLaMA_2_Chat_70B // or togetherModel.chat.meta.llamaChat.b70,
  messages: [{
    role: 'user',
    content: 'Hello, how are you?'
  }]
})
```

Users can use either the `TogetherChatModel` enum for a specific chat model, or the `togetherModel` object which enumerates every model by the inference type, organization, name, and size.

This inference request will wait until the LLM has finished processing to return the response from the API.

### Streaming Chat

To stream the inference while it is still in progress, simply add a callback to the request parameters:

```typescript
const result = await client.chat({
  model: TogetherChatModel.LLaMA_2_Chat_70B,
  messages: [{
    role: 'user',
    content: 'Hello, how are you?'
  }],
  streamCallback: v => console.log(v)
})
```

The `streamCallback` function will get called for every event sent by the API. It will still return the entire reponse when completed.

### Language

To perform a language inference, use the language method on the client object:

```typescript
const result = await client.language({
  model: TogetherLanguageModel.Falcon_40B,
  prompt: 'The capital of France is'
})
```

The same stream callback function can be added to the language request as well.

### Code

The same system works for the code inference:

```typescript
const result = await client.code({
  model: TogetherCodeModel.Code_Llama_Python_13B,
  prompt: '# Write a function for fibonacci'
})
```

The same stream callback function can be added to the code request as well.

### Image

To perform an image inference, use the image method on the client object:

```typescript
const result = await client.image({
  model: TogetherImageModel.Stable_Diffusion_XL_1_0,
  prompt: 'A picture of a cat',
  width: 1024,
  height: 1024,
  n: 2
})
```

The `width` and `height` parameters determine the size of the image in pixels. The `n` parameter determines how many images to generate. The stream callback is not available on image requests.

### Embedding

To perform an embedding, use the embedding method on the client object:

```typescript
const result = await client.embedding({
  model: TogetherEmbeddingModel.BERT,
  input: 'Hello, how are you?'
})
```

