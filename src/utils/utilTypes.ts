/**
 * Recursively checks entire object so no fields may be undefined or null
 */
export type RecursiveNonNullable<T> = NonNullableObject<T> & NonNullable<T>
type NonNullableObject<T> = { [K in keyof T]-?: NonNullable<T[K]> & RecursiveNonNullable<T[K]> }
