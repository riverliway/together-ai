import { removeFront } from './removeFront'

describe('removeFront', () => {
  test('Remove the first element of an array', () => {
    expect(removeFront('hello', 'hell')).toEqual('o')
  })

  test('Empty string', () => {
    expect(removeFront('', 'potato')).toEqual('')
  })
})
