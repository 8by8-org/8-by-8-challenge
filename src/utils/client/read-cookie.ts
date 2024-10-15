export function readCookie(name: string): string {
  name += '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(';');

  for (const cookie of cookies) {
    const indexOfName = cookie.indexOf(name);
    if (indexOfName === -1) continue;

    return cookie.substring(indexOfName + name.length);
  }

  return '';
}
