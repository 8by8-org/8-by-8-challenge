import { render, cleanup } from '@testing-library/react';
import type { ReactNode } from 'react';

/**
 * A function that can be used to determine whether a component throws a certain
 * type of error.
 *
 * @param Component - A React component that may throw an error.
 * @returns The error thrown by the component or null if no error was thrown.
 */
export function getErrorThrownByComponent(Component: ReactNode): Error | null {
  let error: Error | null = null;

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  try {
    render(Component);
  } catch (e: any) {
    error = e;
  }

  cleanup();
  consoleSpy.mockRestore();

  return error;
}
