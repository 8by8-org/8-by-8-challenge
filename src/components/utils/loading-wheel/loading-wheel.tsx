import Image from 'next/image';
import styles from './styles.module.scss';

export function LoadingWheel() {
  return (
    <>
      <div className={styles.transparent_overlay}></div>
      <div className={styles.spinner_container}>
        <Image
          src="/static/images/components/spinner/spinner.png"
          width={82}
          height={82}
          alt="loading"
          className={styles.spinner}
          priority
        />
      </div>
    </>
  );
}
