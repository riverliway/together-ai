import { rawTogetherRequest } from './raw'

describe('Raw Request', () => {
  test('Succeed with valid response', async () => {
    const result = {
      hi: 'hi'
    }

    const customFetch = jest.fn().mockResolvedValue({ status: 200, json: () => result })

    const response = await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'chat',
      requestParams: { prompt: 'hello' },
      customFetch
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual(result)
    expect(customFetch).toHaveBeenCalledTimes(1)
  })

  test('Calls with custom url', async () => {
    const customFetch = jest.fn().mockResolvedValue({ status: 200, json: () => {} })

    await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'v1/chat',
      address: 'custom.together.xyz',
      protocol: 'http',
      requestParams: { prompt: 'hello' },
      customFetch
    })

    expect(customFetch).toHaveBeenCalledTimes(1)
    expect(customFetch).toHaveBeenCalledWith('http://custom.together.xyz/v1/chat', expect.any(Object))
  })

  test('Do not retry on a bad request', async () => {
    const result = {
      hi: 'hi'
    }

    const customFetch = jest.fn().mockResolvedValue({ status: 404, json: () => result })

    const response = await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'chat',
      requestParams: { prompt: 'hello' },
      customFetch,
      retryCooldowns: [1000, 5000, 30000]
    })

    expect(response.status).toBe(404)
    expect(await response.json()).toStrictEqual(result)
    expect(customFetch).toHaveBeenCalledTimes(1)
  })

  test('Do not retry with no cooldowns', async () => {
    const result = {
      hi: 'hi'
    }

    const customFetch = jest.fn().mockResolvedValue({ status: 540, json: () => result })

    await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'chat',
      requestParams: { prompt: 'hello' },
      customFetch,
      retryCooldowns: []
    })
  
    expect(customFetch).toHaveBeenCalledTimes(1)
  })

  test('Retry on rate limit', async () => {
    const result = {
      hi: 'hi'
    }

    const customFetch = jest.fn().mockResolvedValue({ status: 429, json: () => result })

    const response = await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'chat',
      requestParams: { prompt: 'hello' },
      customFetch,
      retryCooldowns: [1, 10, 100]
    })

    expect(response.status).toBe(429)
    expect(await response.json()).toStrictEqual(result)
    expect(customFetch).toHaveBeenCalledTimes(4)
  })

  test('Do not retry when response changes to OK', async () => {
    let status = 510
    const result = {
      hi: 'hi'
    }

    const customFetch = jest.fn(async () => {
      const res = { status, json: () => result }
      status = 200
      return res
    }) as unknown as typeof fetch

    const response = await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'chat',
      requestParams: { prompt: 'hello' },
      customFetch,
      retryCooldowns: [1, 10, 100]
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual(result)
    expect(customFetch).toHaveBeenCalledTimes(2)
  })

  test('Empty request params is an empty object', async () => {
    const customFetch = jest.fn().mockResolvedValue({ status: 200, json: () => {} })

    const response = await rawTogetherRequest({
      apiKey: '123',
      endpoint: 'chat',
      customFetch
    })

    expect(response.status).toBe(200)
    expect(customFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ body: '{}' }))
  })
})
