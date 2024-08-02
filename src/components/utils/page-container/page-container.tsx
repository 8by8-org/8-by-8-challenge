import type { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

/**
 * Renders a container that centers its content and enforces min and max widths
 * for said content.
 */
export function PageContainer({ children }: PropsWithChildren) {
  return (
    <div className={styles.outer_container}>
      <div className={styles.inner_container}>{children}</div>
    </div>
  );
}
