/**
 * Determines if a key received from a keyboard event is a printable character.
 *
 * @param key - A key received from a keyboard event (e.g. 'Enter',
 * 'ArrowDown', 'a', etc.).
 *
 * @returns A boolean indicating whether or not the received key is a printable
 * character.
 */
export function isPrintableCharacterKey(key: string) {
  return /^\w{1}$/.test(key);
}
