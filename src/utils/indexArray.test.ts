import { indexArray } from './indexArray'
import { testmap } from './testmap'

describe('Index Array', () => {
  const testCases: Array<[number, number[]]> = [
    [-5, []],
    [0, []],
    [1, [0]],
    [2, [0, 1]],
    [5, [0, 1, 2, 3, 4]],
    [1 / 0, []],
    [2.2, [0, 1]]
  ]

  testmap(testCases, i => `Length ${i}`, indexArray)
})
