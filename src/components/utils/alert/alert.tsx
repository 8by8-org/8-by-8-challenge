'use client';
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  type ForwardedRef,
} from 'react';
import styles from './styles.module.scss';

export type AlertRefType = (
  message: string,
  variant: 'error' | 'success',
) => void;

export const Alert = forwardRef(function Alert(
  _props: {},
  ref: ForwardedRef<AlertRefType>,
) {
  const alertRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return (message: string, variant: 'error' | 'success') => {
      if (alertRef.current) {
        const alert = alertRef.current;
        alert.innerText = message;
        alert.className = styles[variant];
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            alert.className = `${styles[variant]} ${styles.slide_out}`;
          });
        });
      }
    };
  });

  return (
    <div className={styles.alert_container}>
      <div ref={alertRef} className={styles.hidden} role="alert"></div>
    </div>
  );
});
