import { useRef } from 'react';
import { AlertRefType } from './alert';

export function useAlert() {
  const alertRef = useRef<AlertRefType>(null);

  const showAlert = (message: string, variant: 'error' | 'success') => {
    alertRef.current && alertRef.current(message, variant);
  };

  return {
    alertRef,
    showAlert,
  };
}
