'use client';
import { createNamedContext } from '@/hooks/create-named-context';
import { Alert, useAlert } from '@/components/utils/alert';
import type { PropsWithChildren } from 'react';

interface AlertsContextType {
  showAlert(message: string, variant: 'error' | 'success'): void;
}

export const AlertsContext =
  createNamedContext<AlertsContextType>('AlertsContext');

export function AlertsContextProvider({ children }: PropsWithChildren) {
  const { alertRef, showAlert } = useAlert();

  return (
    <AlertsContext.Provider value={{ showAlert }}>
      <Alert ref={alertRef} />
      {children}
    </AlertsContext.Provider>
  );
}
