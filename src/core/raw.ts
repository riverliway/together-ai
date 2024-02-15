import { RecursiveNonNullable } from '../utils/utilTypes'
import { asyncTimeout } from '../utils/asyncTimeout'

export interface RawTogetherConfig {
  /**
   * The API key to authenticate the requests.
   * No default value is provided, so it is required.
   */
  apiKey: string
  /**
   * @default 'api.together.xyz'
   */
  address?: string
  /**
   * @default 'https'
   */
  protocol?: 'http' | 'https'
  /**
   * The endpoint to send the request to.
   * No default value is provided, so it is required.
   */
  endpoint: string
  /**
   * The parameters to pass to the API request.
   */
  requestParams?: {}
  /**
   * The retry cooldowns (milliseconds) to use when retrying the request.
   * Only used when the request fails with a 429 or 5XX error.
   * Pass an empty array to disable retries.
   * @default [1000, 5000, 30000]
   */
  retryCooldowns?: number[]
  /**
   * A custom fetch function to use to send the request.
   * Useful for testing, logging, or to use a different fetch implementation.
   * This library only uses the following fields from the fetch response:
   * - status
   * - body [Expecting stream reader]
   * - json()
   * @default built in fetch
   */
  customFetch?: typeof fetch
}

/**
 * A low level client to send requests to the Together API.
 * Recommended to use the `togetherClient` instead for users.
 * Can be helpful for new features or debugging.
 * @param userConfig - the configuration object
 */
export const rawTogetherRequest = async (userConfig: RawTogetherConfig): ReturnType<typeof fetch> => {
  const config = formConfig(userConfig)
  const url = `${config.protocol}://${config.address}/${config.endpoint}`

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(config.requestParams)
  }

  let response = await config.customFetch(url, options)
  let numTries = 0
  while (shouldRetry(response, config.retryCooldowns, numTries)) {
    const cooldown = config.retryCooldowns[numTries]
    await asyncTimeout(cooldown)

    response = await config.customFetch(url, options)
    numTries += 1
  }

  return response
}

/**
 * Should the request be retried?
 * @param response - the response from the request
 * @param retryCooldowns - the cooldowns to use when retrying
 * @param numTries - the number of retries that have been attempted
 * @returns true if the request should be retried
 */
const shouldRetry = (response: Response, retryCooldowns: number[], numTries: number): boolean => {
  const isRetryable = response.status === 429 || (response.status >= 500 && response.status < 600)
  if (!isRetryable) return false

  return numTries < retryCooldowns.length
}

/**
 * Form the user's configuration into a complete configuration object.
 * @param userConfig - the user's configuration
 * @returns the complete configuration object with no undefined values
 */
const formConfig = (userConfig: RawTogetherConfig): RecursiveNonNullable<RawTogetherConfig> => {
  return {
    apiKey: userConfig.apiKey,
    address: userConfig.address ?? 'api.together.xyz',
    protocol: userConfig.protocol ?? 'https',
    endpoint: userConfig.endpoint,
    requestParams: userConfig.requestParams ?? {},
    retryCooldowns: userConfig.retryCooldowns ?? [1000, 5000, 30000],
    customFetch: userConfig.customFetch ?? fetch
  }
}
