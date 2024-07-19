import {
  useUserInput,
  useFocusEvents,
  useMultiPipe,
  ValidityUtils,
  type FieldOfType,
  type IGroup,
  type Field,
  type Group,
} from 'fully-formed';
import type { CSSProperties } from 'react';
import styles from './styles.module.scss';

interface InputProps {
  /**
   * A Fully Formed {@link Field} that will control the state of the input.
   */
  field: FieldOfType<string>;
  /**
   * An array of Fully Formed {@link Group}s. If these groups' validators have
   * executed and returned an invalid result, the input will appear invalid.
   */
  groups?: IGroup[];
  type: string;
  /**
   * If true, the placeholder and value text will be opaque even before the user
   * has interacted with the field. Set this to true if you are pairing the
   * input with a stationary label. Set this to false if you are pairing the
   * input with a floating label.
   */
  showText?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  style?: CSSProperties;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
}

/**
 * Renders an HTML input element whose value and appearance are controlled by
 * the state of a {@link Field}.
 *
 * @param props - {@link InputProps}
 *
 * @remarks
 * If the provide field is invalid, the returned input element will appear
 * invalid once the user has interacted with it.
 *
 * If `groups` are provided, the field will appear invalid if any of those
 * groups' validators have failed and the user has interacted with it.
 */
export function Input({
  field,
  groups = [],
  type,
  showText,
  placeholder,
  disabled,
  autoComplete,
  maxLength,
  className: classNameProp,
  style,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy,
}: InputProps) {
  const className = useMultiPipe([field, ...groups], states => {
    const classNames = [styles.input];
    const fieldState = states[0];

    if (
      showText ||
      fieldState.isInFocus ||
      fieldState.hasBeenBlurred ||
      fieldState.value
    ) {
      classNames.push(styles.show_text);
    }

    const validity = ValidityUtils.minValidity(states, {
      pruneUnvalidatedGroups: true,
    });

    if (
      ValidityUtils.isInvalid(validity) &&
      (fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted)
    ) {
      classNames.push(styles.invalid);
    }

    if (classNameProp) {
      classNames.push(classNameProp);
    }

    return classNames.join(' ');
  });

  const ariaInvalid = useMultiPipe([field, ...groups], states => {
    const validity = ValidityUtils.minValidity(states);
    const fieldState = states[0];

    return (
      ValidityUtils.isInvalid(validity) &&
      (fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted)
    );
  });

  return (
    <input
      name={field.name}
      id={field.id}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      maxLength={maxLength}
      aria-required={ariaRequired}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      {...useUserInput(field)}
      {...useFocusEvents(field)}
      className={className}
      style={style}
    />
  );
}
