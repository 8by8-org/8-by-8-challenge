import { useRef } from 'react';
import { ToastRefType } from './toast';

export function useToast() {
  const toastRef = useRef<ToastRefType>(null);

  const showToast = (message: string) => {
    toastRef.current && toastRef.current(message);
  };

  return {
    toastRef,
    showToast,
  };
}
