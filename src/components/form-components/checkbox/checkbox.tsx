'use client';
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
  id?: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
  ['aria-invalid']?: boolean;
};

export function Checkbox({
  name,
  labelContent,
  checked,
  onChange,
  id,
  containerClassName,
  containerStyle,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy,
  ['aria-invalid']: ariaInvalid,
}: CheckboxProps) {
  const defaultId = useId();

  return (
    <div
      className={
        containerClassName ?
          `${styles.container} ${containerClassName}`
        : styles.container
      }
      style={containerStyle}
    >
      <input
        type="checkbox"
        name={name}
        id={id ?? defaultId}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
        aria-required={ariaRequired}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />
      <label htmlFor={id ?? defaultId} className={styles.label}>
        {labelContent}
      </label>
    </div>
  );
}
