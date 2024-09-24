export function collapseWhitespace(str: string) {
  return str.trim().replace(/(\s+)/g, ' ');
}
