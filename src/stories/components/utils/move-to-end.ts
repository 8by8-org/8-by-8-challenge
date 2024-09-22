/**
 * Takes in an array and a value and returns a new array with the provided
 * value moved to the end.
 */
export function moveToEnd<T extends unknown[]>(
  array: T,
  value: T[number],
): Array<T[number]> {
  const filtered: Array<T[number]> = [];
  const append: Array<T[number]> = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      append.push(array[i]);
    } else {
      filtered.push(array[i]);
    }
  }

  return filtered.concat(append);
}
