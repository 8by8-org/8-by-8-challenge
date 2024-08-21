import {
  useId,
  type CSSProperties,
  type ChangeEventHandler,
  type ReactNode,
} from 'react';
import styles from './styles.module.scss';

type CheckboxProps = {
  name: string;
  labelContent: ReactNode;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  containerStyle?: CSSProperties;
};

export function Checkbox({
  name,
  labelContent,
  checked,
  onChange,
  containerStyle,
}: CheckboxProps) {
  const checkboxId = useId();

  return (
    <div className={styles.container} style={containerStyle}>
      <input
        type="checkbox"
        name={name}
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
      />
      <label htmlFor={checkboxId} className={styles.label}>
        {labelContent}
      </label>
    </div>
  );
}
