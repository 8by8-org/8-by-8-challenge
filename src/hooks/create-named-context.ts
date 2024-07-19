import { createContext } from 'react';
import type { NamedContext } from './named-context';

/**
 * Creates a React Context object with the provided displayName and a default
 * value of null.
 *
 * @typeParam T - The type of the value that providers of this context will
 * provide to consumers.
 *
 * @param displayName - The name that will be displayed when a NullContextError
 * is thrown by useContextSafely.
 *
 * @returns A React Context object with the provided displayName and a default
 * value of null.
 *
 * @remarks
 * For maximum clarity, the provided displayName should be the same as the name
 * of the variable you assign the context to.
 *
 * The displayName will also be used in React dev tools to refer to your
 * context.
 *
 * @example
 * interface ThemeContextType {
 *   theme : 'dark' | 'light' | 'system';
 * }
 *
 * const ThemeContext = createNamedContext<ThemeContextType>('ThemeContext');
 */
export function createNamedContext<T>(
  displayName: string,
): NamedContext<T | null> {
  const context = createContext<T | null>(null);
  context.displayName = displayName;
  return context as NamedContext<T | null>;
}
