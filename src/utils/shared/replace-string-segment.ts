export function replaceStringSegment(
  str: string,
  replacementStr: string,
  start: number,
  end: number,
) {
  return str.slice(0, start) + replacementStr + str.slice(end);
}
