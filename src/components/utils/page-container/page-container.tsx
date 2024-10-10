import type { ReactNode } from 'react';
import styles from './styles.module.scss';

interface PageContainerProps {
  children?: ReactNode;
  theme?: 'light' | 'dark';
}

/**
 * Renders a container that centers its content and enforces min and max widths
 * for said content.
 */
export function PageContainer({
  children,
  theme = 'light',
}: PageContainerProps) {
  return (
    <div className={styles.outer_container}>
      <div
        className={
          theme === 'light' ?
            styles.inner_container_light
          : styles.inner_container_dark
        }
      >
        {children}
      </div>
    </div>
  );
}
