import type { Option } from '../types/option';
import styles from './styles.module.scss';

interface WidthSetterProps {
  label: string;
  options: Option[];
  hasMoreInfo: boolean;
}

export function WidthSetter({ label, options, hasMoreInfo }: WidthSetterProps) {
  return (
    <>
      <div
        className={
          hasMoreInfo ? styles.width_setter_with_more_info : styles.width_setter
        }
      >
        {label}
      </div>
      {options.map((option, index) => {
        return (
          <div className={styles.width_setter} key={index}>
            {option.text}
          </div>
        );
      })}
    </>
  );
}
