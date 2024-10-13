import { LoadingWheel } from '../loading-wheel';
import styles from './styles.module.scss';

/**
 * A full-height loading screen that can be rendered by guards as a placeholder
 * instead of the protected page until the user is redirected to the protected
 * page.
 */
export function LoadingScreen() {
  return (
    <div className={styles.loading_screen}>
      <LoadingWheel />
    </div>
  );
}
