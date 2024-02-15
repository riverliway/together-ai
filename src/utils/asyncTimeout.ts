/**
 * Waits for the timeout to expire, then runs the callback
 * Use this when needing to await the timeout:
 * `await asyncTimeout(func, 1000)`
 * @param timeout - number of milliseconds to wait
 * @param callback - the function to execute when the timeout is finished.
 * Acts as a blocking sleep function if no callback is provided
 */
export const asyncTimeout = async (timeout: number, callback?: () => void): Promise<void> => {
  return await new Promise(resolve => {
    setTimeout(() => {
      callback?.()
      resolve()
    }, timeout)
  })
}
