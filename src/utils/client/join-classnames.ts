/**
 * Joins an arbitrary number of classNames into a space-separated string which
 * can be provided to the className prop of a JSX element, removing undefined
 * classNames and empty strings.
 */
export function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(className => !!className).join(' ');
}
