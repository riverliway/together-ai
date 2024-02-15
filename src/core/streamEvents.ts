import { snakeCase2camelCase } from '../utils/caseConverter'
import { removeFront } from '../utils/removeFront'

/**
 * Streams events from a reader and calls a callback with each event.
 * The reader can return partial events or multiple events in a single read,
 * so this function handles those cases
 * @param reader - the reader to stream from
 * @param callback - the callback to call with each event
 */
export const streamEvents = async (reader: ReadableStreamDefaultReader<Uint8Array>, callback: (v: 'done' | {}) => Promise<void>): Promise<void> => {
  let isDone = false
  let partialResponse = ''

  while (true) {
    const { done, value } = await reader.read()

    const text = new TextDecoder().decode(value)
    const fullText = (partialResponse + text).trim()
    // console.log(text)

    for (const line of fullText.split('\n')) {
      const trimmedLine = line.trim()
      if (trimmedLine.length === 0) continue

      if (trimmedLine === 'data: [DONE]') {
        isDone = true
        await callback('done')
        break
      }

      const rawObj = removeFront(trimmedLine, 'data:').trim()
      let json = {}
      try {
        json = JSON.parse(rawObj)
      } catch {
        partialResponse = rawObj
        continue
      }

      partialResponse = ''
      await callback(snakeCase2camelCase(json))
    }

    if (done) {
      break
    }
  }

  // If we didn't recieve a done event, call the callback with done
  if (!isDone) {
    await callback('done')
  }
}
