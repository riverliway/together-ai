import { asyncTimeout } from '../utils/asyncTimeout'
import { streamEvents } from './streamEvents'

describe('Stream Events', () => {
  test('Valid clean events', async () => {
    const reader = buildMockedStream([
      `data: ${JSON.stringify({ id: 1 })}`,
      `data: ${JSON.stringify({ id: 2, created: 0 })}`,
      'data: [DONE]'
    ])

    const callback = jest.fn()

    await streamEvents(reader, callback)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(callback).toHaveBeenNthCalledWith(2, { id: 2, created: 0 })
    expect(callback).toHaveBeenNthCalledWith(3, 'done')
  })

  test('Works without end event', async () => {
    const reader = buildMockedStream([
      `data: ${JSON.stringify({ id: 1 })}`,
      `data: ${JSON.stringify({ id: 2, created: 0 })}`
    ])

    const callback = jest.fn()

    await streamEvents(reader, callback)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(callback).toHaveBeenNthCalledWith(2, { id: 2, created: 0 })
    expect(callback).toHaveBeenNthCalledWith(3, 'done')
  })

  test('Works with multiple events in one line', async () => {
    const reader = buildMockedStream([
      ` data: ${JSON.stringify({ id: 1 })}\n`,
      `data: ${JSON.stringify({ id: 2, created: 0 })}\ndata: ${JSON.stringify({ id: 3 })}`,
      `data: ${JSON.stringify({ id: 4, created: 0 })}\n\ndata: ${JSON.stringify({ id: 5 })}`,
      'data: [DONE]'
    ])

    const callback = jest.fn()

    await streamEvents(reader, callback)

    expect(callback).toHaveBeenCalledTimes(6)
    expect(callback).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(callback).toHaveBeenNthCalledWith(2, { id: 2, created: 0 })
    expect(callback).toHaveBeenNthCalledWith(3, { id: 3 })
    expect(callback).toHaveBeenNthCalledWith(4, { id: 4, created: 0 })
    expect(callback).toHaveBeenNthCalledWith(5, { id: 5 })
    expect(callback).toHaveBeenNthCalledWith(6, 'done')
  })

  test('Works with a single event spread over multiple reads', async () => {
    const payload = JSON.stringify({ someLongFieldName: 'someLongFieldValue' })
    const reader = buildMockedStream([
      `data: ${JSON.stringify({ id: 1 })}`,
      `data: ${payload.slice(0, 5)}`,
      payload.slice(5, 10),
      payload.slice(10),
      `data: ${JSON.stringify({ id: 2 })}`,
      'data: [DONE]'
    ])

    const callback = jest.fn()

    await streamEvents(reader, callback)

    expect(callback).toHaveBeenCalledTimes(4)
    expect(callback).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(callback).toHaveBeenNthCalledWith(2, { someLongFieldName: 'someLongFieldValue' })
    expect(callback).toHaveBeenNthCalledWith(3, { id: 2 })
    expect(callback).toHaveBeenNthCalledWith(4, 'done')
  })

  test('Works with done event spread over multiple reads', async () => {
    const reader = buildMockedStream([
      `data: ${JSON.stringify({ id: 1 })}`,
      'data: [DO',
      'NE]',
    ])

    const callback = jest.fn()

    await streamEvents(reader, callback)

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(callback).toHaveBeenNthCalledWith(2, 'done')
  })

  test('Callbacks are awaited' , async () => {
    const reader = buildMockedStream([
      `data: ${JSON.stringify({ id: 1 })}`,
      `data: ${JSON.stringify({ id: 2 })}`,
      `data: ${JSON.stringify({ id: 3 })}`,
      `data: ${JSON.stringify({ id: 4 })}`,
      `data: ${JSON.stringify({ id: 5 })}`,
      'data: [DONE]'
    ])

    // By sleeping in the callback, we can ensure that the events are processed in order
    const callback = jest.fn(async () => await asyncTimeout(100))

    await streamEvents(reader, callback)

    expect(callback).toHaveBeenCalledTimes(6)
    expect(callback).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(callback).toHaveBeenNthCalledWith(2, { id: 2 })
    expect(callback).toHaveBeenNthCalledWith(3, { id: 3 })
    expect(callback).toHaveBeenNthCalledWith(4, { id: 4 })
    expect(callback).toHaveBeenNthCalledWith(5, { id: 5 })
  })
})

const buildMockedStream = (events: string[]): ReadableStreamDefaultReader<Uint8Array> => {
  let i = 0
  return {
    read: async () => {
      const value = new TextEncoder().encode(events[i])
      i++
      return { done: i === events.length, value }
    }
  } as ReadableStreamDefaultReader<Uint8Array>
}
