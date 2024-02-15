import { TogetherChatModel, TogetherCodeModel, TogetherEmbeddingModel, TogetherImageModel, TogetherLanguageModel, TogetherModerationModel, togetherModel } from './models.types'

describe('Are strings', () => {
  test('Chat models', () => {
    expect(Object.values(TogetherChatModel).every(v => typeof v === 'string')).toBe(true)
  })

  test('Language models', () => {
    expect(Object.values(TogetherLanguageModel).every(v => typeof v === 'string')).toBe(true)
  })

  test('Code models', () => {
    expect(Object.values(TogetherCodeModel).every(v => typeof v === 'string')).toBe(true)
  })

  test('Image models', () => {
    expect(Object.values(TogetherImageModel).every(v => typeof v === 'string')).toBe(true)
  })

  test('Moderation models', () => {
    expect(Object.values(TogetherModerationModel).every(v => typeof v === 'string')).toBe(true)
  })

  test('Embedding models', () => {
    expect(Object.values(TogetherEmbeddingModel).every(v => typeof v === 'string')).toBe(true)
  })
})

describe('Are unique', () => {
  test('Chat models', () => {
    const values = Object.values(TogetherChatModel)
    expect(new Set(values).size).toBe(values.length)
  })

  test('Language models', () => {
    const values = Object.values(TogetherLanguageModel)
    expect(new Set(values).size).toBe(values.length)
  })

  test('Code models', () => {
    const values = Object.values(TogetherCodeModel)
    expect(new Set(values).size).toBe(values.length)
  })

  test('Image models', () => {
    const values = Object.values(TogetherImageModel)
    expect(new Set(values).size).toBe(values.length)
  })

  test('Moderation models', () => {
    const values = Object.values(TogetherModerationModel)
    expect(new Set(values).size).toBe(values.length)
  })

  test('Embedding models', () => {
    const values = Object.values(TogetherEmbeddingModel)
    expect(new Set(values).size).toBe(values.length)
  })

  test('All models', () => {
    const values = getRecursiveValues(togetherModel)
    expect(new Set(values).size).toBe(values.length)
  })
})

describe('1-1 mapping', () => {
  test('Chat models', () => {
    const enumValues = Object.values(TogetherChatModel).sort()
    const objValues = getRecursiveValues(togetherModel.chat).sort()
    
    expect(enumValues).toStrictEqual(objValues)
  })

  test('Language models', () => {
    const enumValues = Object.values(TogetherLanguageModel).sort()
    const objValues = getRecursiveValues(togetherModel.language).sort()
    
    expect(enumValues).toStrictEqual(objValues)
  })

  test('Code models', () => {
    const enumValues = Object.values(TogetherCodeModel).sort()
    const objValues = getRecursiveValues(togetherModel.code).sort()
    
    expect(enumValues).toStrictEqual(objValues)
  })

  test('Image models', () => {
    const enumValues = Object.values(TogetherImageModel).sort()
    const objValues = getRecursiveValues(togetherModel.image).sort()
    
    expect(enumValues).toStrictEqual(objValues)
  })

  test('Moderation models', () => {
    const enumValues = Object.values(TogetherModerationModel).sort()
    const objValues = getRecursiveValues(togetherModel.moderation).sort()
    
    expect(enumValues).toStrictEqual(objValues)
  })

  test('Embedding models', () => {
    const enumValues = Object.values(TogetherEmbeddingModel).sort()
    const objValues = getRecursiveValues(togetherModel.embedding).sort()
    
    expect(enumValues).toStrictEqual(objValues)
  })
})

const getRecursiveValues = (obj: {}): string[] => {
  if (typeof obj === 'string') {
    return [obj]
  }

  return Object.values(obj).flatMap(v => getRecursiveValues(v as {}))
}
