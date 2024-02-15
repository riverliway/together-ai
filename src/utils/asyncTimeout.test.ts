import { asyncTimeout } from './asyncTimeout'

describe('Asynchronous Timeout', () => {
  test('Waits determined amount of time before running callback', async () => {
    const callback = jest.fn()

    // Make sure the callback is not called at the 100ms mark
    setTimeout(() => expect(callback).not.toHaveBeenCalled(), 100)

    // Make sure the callback has been called at the 300ms mark
    setTimeout(() => expect(callback).toHaveBeenCalledTimes(1), 300)

    // Block and call the callback at the 200ms mark
    await asyncTimeout(200, callback)

    // Simply block until the 300ms mark function has been run
    // This is necessary because the test will conclude prematurely if we don't block
    await asyncTimeout(200, () => {})
  })
})
