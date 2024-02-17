import { snakeCase2camelCase, convertCamelCase, convertSnakeCase, titleCase, camelCase2snakeCase } from './caseConverter'

describe('Converting cases', () => {
  describe('snakeCase2camelCase', () => {
    test('boolean', () => {
      expect(snakeCase2camelCase(true)).toBe(true)
    })

    test('number', () => {
      expect(snakeCase2camelCase(324)).toBe(324)
    })

    test('string', () => {
      expect(snakeCase2camelCase('true')).toBe('true')
    })

    test('array', () => {
      const result = snakeCase2camelCase([1, 2, 3])
      expect(result.length).toEqual(3)
      expect(result[0]).toBe(1)
      expect(result[1]).toBe(2)
      expect(result[2]).toBe(3)
    })

    test('array of objects', () => {
      const result = snakeCase2camelCase([{ hi_you: 'hi_you', yeah_you: 'yeah_you' }])
      expect(result.length).toEqual(1)
      expect(result[0]).toHaveProperty('hiYou')
      expect(result[0]).not.toHaveProperty('hi_you')
      expect(result[0].hiYou).toBe('hi_you')

      expect(result[0]).toHaveProperty('yeahYou')
      expect(result[0]).not.toHaveProperty('yeah_you')
      expect(result[0].yeahYou).toBe('yeah_you')
    })

    test('object without case', () => {
      const result = snakeCase2camelCase({ hi: 'hi', yeah: 'yeah' })
      expect(result).toHaveProperty('hi')
      expect(result.hi).toBe('hi')

      expect(result).toHaveProperty('yeah')
      expect(result.yeah).toBe('yeah')
    })

    test('surface level object', () => {
      const result = snakeCase2camelCase({ hi_you: 'hi_you', yeah_you: 'yeah_you' })
      expect(result).toHaveProperty('hiYou')
      expect(result).not.toHaveProperty('hi_you')
      expect(result.hiYou).toBe('hi_you')

      expect(result).toHaveProperty('yeahYou')
      expect(result).not.toHaveProperty('yeah_you')
      expect(result.yeahYou).toBe('yeah_you')
    })

    test('object with undefined', () => {
      const result = snakeCase2camelCase({ hey_hey: undefined, you_you: null })

      expect(result).toHaveProperty('heyHey')
      expect(result).not.toHaveProperty('hey_hey')
      expect(result.heyHey).toBe(undefined)

      expect(result).toHaveProperty('youYou')
      expect(result).not.toHaveProperty('you_you')
      expect(result.youYou).toBe(null)
    })

    test('recursive object', () => {
      const obj = {
        hey_hey: 'hey_hey',
        nice: {
          potato: 'potato',
          there_there: {
            you_you: 'you_you',
            six_num: 6,
            true_bool: true,
            array_5: [6, 7, 8, 9, 10],
            double__: 5.4,
            __float: 4.6,
            d_____f: 9.9,
            '32 hungry beans': 'wow',
            alreadyCamel: 'yay'
          }
        }
      }

      const result = snakeCase2camelCase(obj)
      expect(result).toHaveProperty('heyHey')
      expect(result).not.toHaveProperty('hey_hey')
      expect(result.heyHey).toBe('hey_hey')

      expect(result).toHaveProperty('nice')
      expect(result.nice).toHaveProperty('potato')
      expect(result.nice.potato).toBe('potato')

      expect(result.nice).toHaveProperty('thereThere')
      expect(result.nice).not.toHaveProperty('there_there')
    
      expect(result.nice.thereThere).toHaveProperty('youYou')
      expect(result.nice.thereThere).not.toHaveProperty('you_you')
      expect(result.nice.thereThere.youYou).toBe('you_you')

      expect(result.nice.thereThere).toHaveProperty('sixNum')
      expect(result.nice.thereThere).not.toHaveProperty('six_num')
      expect(result.nice.thereThere.sixNum).toBe(6)

      expect(result.nice.thereThere).toHaveProperty('trueBool')
      expect(result.nice.thereThere).not.toHaveProperty('true_bool')
      expect(result.nice.thereThere.trueBool).toBe(true)

      expect(result.nice.thereThere).toHaveProperty('array5')
      expect(result.nice.thereThere).not.toHaveProperty('array_5')
      expect(result.nice.thereThere.array5.length).toBe(5)

      expect(result.nice.thereThere).toHaveProperty('double')
      expect(result.nice.thereThere).not.toHaveProperty('double__')
      expect(result.nice.thereThere.double).toBe(5.4)

      expect(result.nice.thereThere).toHaveProperty('float')
      expect(result.nice.thereThere).not.toHaveProperty('__float')
      expect(result.nice.thereThere.float).toBe(4.6)

      expect(result.nice.thereThere).toHaveProperty('dF')
      expect(result.nice.thereThere).not.toHaveProperty('d_____f')
      expect(result.nice.thereThere.dF).toBe(9.9)

      expect(result.nice.thereThere).toHaveProperty('32 hungry beans')
      expect(result.nice.thereThere['32 hungry beans']).toBe('wow')

      expect(result.nice.thereThere).toHaveProperty('alreadyCamel')
      expect(result.nice.thereThere).not.toHaveProperty('already_camel')
      expect(result.nice.thereThere.alreadyCamel).toBe('yay')
    })
  })

  describe('camelCase2snakeCase', () => {
    test('boolean', () => {
      expect(camelCase2snakeCase(true)).toBe(true)
    })

    test('number', () => {
      expect(camelCase2snakeCase(324)).toBe(324)
    })

    test('string', () => {
      expect(camelCase2snakeCase('true')).toBe('true')
    })

    test('array', () => {
      const result = camelCase2snakeCase([1, 2, 3])
      expect(result.length).toEqual(3)
      expect(result[0]).toBe(1)
      expect(result[1]).toBe(2)
      expect(result[2]).toBe(3)
    })

    test('array of objects', () => {
      const result = camelCase2snakeCase([{ hiYou: 'hi_you', yeahYou: 'yeah_you' }])
      expect(result.length).toEqual(1)
      expect(result[0]).toHaveProperty('hi_you')
      expect(result[0]).not.toHaveProperty('hiYou')
      expect(result[0].hi_you).toBe('hi_you')

      expect(result[0]).toHaveProperty('yeah_you')
      expect(result[0]).not.toHaveProperty('yeahYou')
      expect(result[0].yeah_you).toBe('yeah_you')
    })

    test('object without case', () => {
      const result = camelCase2snakeCase({ hi: 'hi', yeah: 'yeah' })
      expect(result).toHaveProperty('hi')
      expect(result.hi).toBe('hi')

      expect(result).toHaveProperty('yeah')
      expect(result.yeah).toBe('yeah')
    })

    test('surface level object', () => {
      const result = camelCase2snakeCase({ hiYou: 'hi_you', yeahYou: 'yeah_you' })
      expect(result).toHaveProperty('hi_you')
      expect(result).not.toHaveProperty('hiYou')
      expect(result.hi_you).toBe('hi_you')

      expect(result).toHaveProperty('yeah_you')
      expect(result).not.toHaveProperty('yeahYou')
      expect(result.yeah_you).toBe('yeah_you')
    })

    test('object with undefined', () => {
      const result = camelCase2snakeCase({ heyHey: undefined, youYou: null })

      expect(result).toHaveProperty('hey_hey')
      expect(result).not.toHaveProperty('heyHey')
      expect(result.hey_hey).toBe(undefined)

      expect(result).toHaveProperty('you_you')
      expect(result).not.toHaveProperty('youYou')
      expect(result.you_you).toBe(null)
    })

    test('recursive object', () => {
      const obj = {
        heyHey: 'hey_hey',
        nice: {
          potato: 'potato',
          thereThere: {
            youYou: 'you_you',
            sixNum: 6,
            trueBool: true,
            array5: [6, 7, 8, 9, 10],
            doubleDD: 5.4,
            FFFFF: 4.6,
            d_____f: 9.9,
            '32 hungry beans': 'wow',
            already_snake: 'yay'
          }
        }
      }

      const result = camelCase2snakeCase(obj)
      expect(result).toHaveProperty('hey_hey')
      expect(result).not.toHaveProperty('heyHey')
      expect(result.hey_hey).toBe('hey_hey')

      expect(result).toHaveProperty('nice')
      expect(result.nice).toHaveProperty('potato')
      expect(result.nice.potato).toBe('potato')

      expect(result.nice).toHaveProperty('there_there')
      expect(result.nice).not.toHaveProperty('thereThere')
    
      expect(result.nice.there_there).toHaveProperty('you_you')
      expect(result.nice.there_there).not.toHaveProperty('youYou')
      expect(result.nice.there_there.you_you).toBe('you_you')

      expect(result.nice.there_there).toHaveProperty('six_num')
      expect(result.nice.there_there).not.toHaveProperty('sixNum')
      expect(result.nice.there_there.six_num).toBe(6)

      expect(result.nice.there_there).toHaveProperty('true_bool')
      expect(result.nice.there_there).not.toHaveProperty('trueBool')
      expect(result.nice.there_there.true_bool).toBe(true)

      expect(result.nice.there_there).toHaveProperty('array5')
      expect(result.nice.there_there).not.toHaveProperty('array_5')
      expect(result.nice.there_there.array5.length).toBe(5)

      expect(result.nice.there_there).toHaveProperty('double_d_d')
      expect(result.nice.there_there).not.toHaveProperty('doubleDD')
      expect(result.nice.there_there.double_d_d).toBe(5.4)

      expect(result.nice.there_there).toHaveProperty('f_f_f_f_f')
      expect(result.nice.there_there).not.toHaveProperty('FFFFF')
      expect(result.nice.there_there.f_f_f_f_f).toBe(4.6)

      expect(result.nice.there_there).toHaveProperty('d_____f')
      expect(result.nice.there_there).not.toHaveProperty('dF')
      expect(result.nice.there_there).not.toHaveProperty('df')
      expect(result.nice.there_there.d_____f).toBe(9.9)

      expect(result.nice.there_there).toHaveProperty('32 hungry beans')
      expect(result.nice.there_there).not.toHaveProperty('32_hungry_beans')
      expect(result.nice.there_there['32 hungry beans']).toBe('wow')

      expect(result.nice.there_there).toHaveProperty('already_snake')
      expect(result.nice.there_there).not.toHaveProperty('alreadySnake')
      expect(result.nice.there_there.already_snake).toBe('yay')
    })
  })

  describe('convertSnakeCase', () => {
    test('Empty string', () => {
      expect(convertSnakeCase('')).toBe('')
    })

    test('Ends with number', () => {
      expect(convertSnakeCase('hello_a5')).toBe('helloA5')
    })
  })

  describe('convertCamelCase', () => {
    test('Empty string', () => {
      expect(convertCamelCase('')).toBe('')
    })

    test('Ends with underscore', () => {
      expect(convertCamelCase('hello_')).toBe('hello')
    })
  })

  describe('titleCase', () => {
    test('Empty string', () => {
      expect(titleCase('')).toBe('')
    })

    test('One letter', () => {
      expect(titleCase('a')).toBe('A')
    })

    test('Two letters', () => {
      expect(titleCase('ab')).toBe('Ab')
    })

    test('2 words', () => {
      expect(titleCase('hello world')).toBe('Hello world')
    })
  })
})
