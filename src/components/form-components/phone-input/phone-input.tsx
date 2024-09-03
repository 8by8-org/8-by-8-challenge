'use client';
import { useRef, useEffect, useId } from 'react';
import {
  usePipe,
  useMultiPipe,
  useFocusEvents,
  ValidityUtils,
  type FieldOfType,
  type IGroup,
} from 'fully-formed';
import { PhoneInputInternals } from './phone-input-internals';
import type { CSSProperties } from 'react';
import styles from './styles.module.scss';

interface PhoneInputProps {
  field: FieldOfType<string>;
  groups?: IGroup[];
  showText?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  style?: CSSProperties;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
}

export function PhoneInput({
  field,
  groups = [],
  showText,
  placeholder,
  disabled,
  autoComplete,
  className: classNameProp,
  style,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy,
}: PhoneInputProps) {
  const value = usePipe(field, ({ value }) => {
    return PhoneInputInternals.formatPhoneNumber(value);
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);
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
      fieldState.hasBeenModified ||
      fieldState.hasBeenBlurred ||
      fieldState.submitted
    ) {
      if (ValidityUtils.isCaution(validity)) {
        classNames.push(styles.caution);
      } else if (ValidityUtils.isInvalid(validity)) {
        classNames.push(styles.invalid);
      }
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

  const warningMessage = useMultiPipe([field, ...groups], states => {
    const validity = ValidityUtils.minValidity(states);
    const fieldState = states[0];

    return (
        ValidityUtils.isCaution(validity) &&
          (fieldState.hasBeenModified ||
            fieldState.hasBeenBlurred ||
            fieldState.submitted)
      ) ?
        'The value of this field could not be confirmed. Please verify that it is correct.'
      : undefined;
  });

  const warningMessageId = useId();

  useEffect(() => {
    function handleBeforeInput(event: InputEvent) {
      PhoneInputInternals.handleBeforeInput(event, field, cursorPositionRef);
    }

    const input = inputRef.current;

    input?.addEventListener('beforeinput', handleBeforeInput);

    return () => {
      input?.removeEventListener('beforeinput', handleBeforeInput);
    };
  }, [field]);

  useEffect(() => {
    if (inputRef.current && cursorPositionRef.current !== null) {
      inputRef.current.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current,
      );
    }
  }, [value]);

  return (
    <>
      <input
        name={field.name}
        id={field.id}
        type="tel"
        inputMode="numeric"
        ref={inputRef}
        value={value}
        {...useFocusEvents(field)}
        onKeyDown={event => PhoneInputInternals.handleKeyDown(event)}
        onChange={e => {
          PhoneInputInternals.handleAutoComplete(e, field);
        }}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={ariaRequired}
        aria-describedby={
          ariaDescribedBy ?
            `${ariaDescribedBy} ${warningMessageId}`
          : warningMessageId
        }
        aria-invalid={ariaInvalid}
        className={className}
        style={style}
      />
      <span
        style={{ position: 'fixed', visibility: 'hidden' }}
        id={warningMessageId}
      >
        {warningMessage}
      </span>
    </>
  );
}
