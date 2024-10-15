/**
 * Generates a crypographically secure random value to be used as a CSRF token.
 */
export function createCSRFToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = toHex(bytes);
  return token;
}

/**
 * Converts a Uint8Array into a hexadecimal string.
 */
function toHex(uInt8Arr: Uint8Array) {
  return Array.from(uInt8Arr)
    .map(i => i.toString(16).padStart(2, '0'))
    .join('');
}
