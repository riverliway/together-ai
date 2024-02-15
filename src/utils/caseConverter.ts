
/**
 * Recursively convert all keys of an object from snake_case to camelCase
 * @param obj - the object to convert
 * @returns the object with new keys
 */
export const snakeCase2camelCase = (obj: any): any => {
  if (typeof obj !== 'object' || Array.isArray(obj) || !obj) return obj

  const keys = Object.keys(obj)
  const newObj: any = {}

  keys.forEach(key => {
    newObj[convertSnakeCase(key)] = snakeCase2camelCase(obj[key])
  })

  return newObj
}

/**
 * Takes a snake case string and converts it into camel case
 * @param snakeCase - the string in snake case
 * @returns camel case string
 */
export const convertSnakeCase = (snakeCase: string): string => {
  if (!snakeCase.includes('_')) return snakeCase

  const result = snakeCase.split('_').map(titleCase).join('')
  return result[0].toLowerCase() + result.slice(1)
}

/**
 * Recursively convert all keys of an object from camelCase to snake_case
 * @param obj - the object to convert
 * @returns the object with new keys
 */
export const camelCase2snakeCase = (obj: any): any => {
  if (typeof obj !== 'object' || Array.isArray(obj) || !obj) return obj

  const keys = Object.keys(obj)
  const newObj: any = {}

  keys.forEach(key => {
    newObj[convertCamelCase(key)] = camelCase2snakeCase(obj[key])
  })

  return newObj
}

/**
 * Takes a camel case string and converts it into snake case
 * @param camelCase - the string in camel case
 * @returns snake case string
 */
export const convertCamelCase = (camelCase: string): string => {
  let snakeCase = ''
  let currentStr = ''
  for (let i = 0; i < camelCase.length; i++) {
    if (camelCase[i].toUpperCase() === camelCase[i] && /^[a-zA-Z()]+$/.test(camelCase[i])) {
      snakeCase += currentStr + '_'
      currentStr = camelCase[i].toLowerCase()
    } else {
      currentStr += camelCase[i]
    }
  }

  let str = snakeCase + currentStr

  while (str.startsWith('_')) {
    str = str.slice(1)
  }
  while (str.endsWith('_')) {
    str = str.slice(0, -1)
  }

  return str
}

/**
 * Uppercases the first letter and lowercases all other letters
 * @param str - the string to title case
 * @returns the title cased string
 */
export const titleCase = (str: string): string => {
  if (str.length < 1) return str

  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
