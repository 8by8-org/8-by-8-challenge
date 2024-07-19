import React, { type ButtonHTMLAttributes } from 'react';
import styles from './button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'btn_gradient' | 'btn_inverted';
  size?: 'btn_lg' | 'btn_sm';
  wide?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'btn_gradient',
  size = 'btn_lg',
  wide = false,
  children,
  ...htmlButtonProps
}: ButtonProps) {
  const classNames = [styles[variant], styles[size]];
  if (wide) {
    classNames.push(styles.btn_wide);
  }

  return (
    <button className={classNames.join(' ')} {...htmlButtonProps}>
      <span>{children}</span>
    </button>
  );
}
