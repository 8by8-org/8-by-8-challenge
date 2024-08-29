'use client';
import { createNamedContext } from '@/hooks/create-named-context';
import { Alert, useAlert } from '@/components/utils/alert';
import type { PropsWithChildren } from 'react';
import { useContext } from 'react';

/**
 * The value provided to consumers of the {@link AlertsContext}.
 */
interface AlertsContextType {
  showAlert(message: string, variant: 'error' | 'success'): void;
}

/**
 * Exposes a `showAlert` function that can be used to display an alert at the
 * top of the page when an operation succeeds or fails. Alerts will
 * automatically disappear after a given amount of time.
 *
 * @example
 * ```
 * import { AlertsContext } from '@/contexts/alerts-context';
 * import { useContextSafely } from '@/hooks/use-context-safely';
 *
 * export function MyComponent() {
 *   const { showAlert } = useContextSafely(AlertsContext, 'MyComponent');
 *
 *   const myAsyncFunction () => {
 *     try {
 *       // attempt some async operation that can fail
 *       // if it succeeds, show a success alert
 *       showAlert('Operation succeeded!', 'success');
 *     } catch(e) {
 *       // otherwise, show an error message
 *       showAlert('Operation encountered an error.', 'error');
 *     }
 *   }
 *
 *   return (
 *     <button onClick={myAsyncFunction}>Click me</button>
 *   )
 * }
 *
 * ```
 */
export const AlertsContext =
  createNamedContext<AlertsContextType>('AlertsContext');

/**
 * Context provider for the {@link AlertsContext}. Provides a `showAlert`
 * function that can be used to display an alert at the top of the page when an
 * operation succeeds or fails. Alerts will automatically disappear after a
 * given amount of time.
 *
 * @param props - {@link PropsWithChildren}
 * @returns An {@link AlertsContext} provider.
 */
export function AlertsContextProvider({ children }: PropsWithChildren) {
  const { alertRef, showAlert } = useAlert();

  return (
    <AlertsContext.Provider value={{ showAlert }}>
      <Alert ref={alertRef} />
      {children}
    </AlertsContext.Provider>
  );
}
export function useAlertsContext() {
  const { alertRef, showAlert } = useAlert();

  return (
    <AlertsContext.Provider value={{ showAlert }}>
      <Alert ref={alertRef} />
      {'rerun'}
    </AlertsContext.Provider>
  );
}
