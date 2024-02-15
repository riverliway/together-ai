
/**
 * Returns an array of defined length where each element is its index
 * @param length - the length of the array
 * @returns an array with defined length
 */
export const indexArray = (length: number): number[] => {
  if (length <= 0 || !isFinite(length)) return []
  return [...(new Array(Math.floor(length))).keys()]
}
