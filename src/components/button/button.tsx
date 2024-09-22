// Button.tsx
import React, { FC } from 'react';
import styles from './button.module.scss';

type ButtonProps = {
  variant?: 'btn_gradient' | 'btn_inverted';
  size?: 'btn_lg' | 'btn_sm';
  wide?: boolean;
  children: React.ReactNode;
};

const Button: FC<ButtonProps> = ({ variant = 'btn_gradient', size = 'btn_lg', wide = false, children }) => {
  const classNames = [styles[variant], styles[size]];
  if (wide) {
    classNames.push(styles.btn_wide);
  }

  console.log('Button classNames:', classNames); // Debugging line

  return (
    <button className={classNames.join(' ')}>
      <span>{children}</span>
    </button>
  );
};

export default Button;
