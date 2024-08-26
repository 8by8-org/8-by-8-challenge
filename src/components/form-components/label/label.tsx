'use client';
import { usePipe, type IField, type Field } from 'fully-formed';
import type { ReactNode } from 'react';
import styles from './styles.module.scss';

type LabelProps = {
  /**
   * A Fully Formed {@link Field} whose state controls whether or not a floating
   * label should float up to the top of the corresponding input element.
   *
   * The field also grants its `id` to the `htmlFor` attribute of the label.
   */
  field: IField;
  /**
   * If `'floating'`, the label will be positioned inside the input element
   * until the user interacts with it, at which point it will float up above
   * the input element.
   */
  variant: 'stationary' | 'floating';
  children?: ReactNode;
};

/**
 * Renders an HTML label element whose `htmlFor` property is assigned the id
 * of the {@link Field} it receives.
 *
 * If the `variant` prop is set to floating,
 * the label will be positioned inside the corresponding input element until the
 * user has interacted with it.
 *
 * @param props - {@link LabelProps}
 * @returns An HTML label element.
 */
export function Label({ field, variant, children }: LabelProps) {
  const className = usePipe(field, state => {
    const classNames = [styles.label];

    if (
      variant === 'floating' &&
      !(state.value || state.isInFocus || state.hasBeenBlurred)
    ) {
      classNames.push(styles.pristine_floating_label);
    }

    return classNames.join(' ');
  });

  return (
    <label htmlFor={field.id} className={className}>
      {children}
    </label>
  );
}
