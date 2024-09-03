'use client';
import { ValidityUtils } from 'fully-formed';
import Image from 'next/image';
import { Label } from '../label';
import { Input } from '../input';
import { Messages } from '../messages';
import {
  useMultiPipe,
  usePipe,
  type FieldOfType,
  type IGroup,
} from 'fully-formed';
import type { CSSProperties, ReactNode } from 'react';
import warningIconLight from '@/../public/static/images/components/shared/warning-icon-light.svg';
import styles from './styles.module.scss';

type InputGroupProps = {
  field: FieldOfType<string>;
  groups?: IGroup[];
  type: string;
  labelVariant: 'floating' | 'stationary';
  labelContent: ReactNode;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  max?: string;
  ['aria-required']?: boolean;
};

/**
 * Renders a {@link Label}, {@link Input} and {@link Messages} inside a
 * container.
 *
 * @param props - {@link InputGroupProps}
 *
 * @remarks
 *
 * The `htmlFor` attribute is set to the `id` of the provided field, and
 * the `aria-describedby` attribute of the input is set to the id provided to
 * the messages component, making the component optimized for screen readers.
 *
 * The messages will be hidden until the user has modified it, the input has
 * received focus and was then blurred, or the user submitted the form.
 *
 * The container can be styled, which facilitates changing the width of the
 * input, etc.
 */
export function InputGroup({
  field,
  groups = [],
  type,
  labelVariant,
  labelContent,
  containerClassName,
  containerStyle,
  placeholder,
  disabled,
  autoComplete,
  maxLength,
  max,
  ['aria-required']: ariaRequired,
}: InputGroupProps) {
  const messagesId = `${field.id}-messages`;
  const hideMessages = usePipe(field, state => {
    return !(state.hasBeenModified || state.hasBeenBlurred || state.submitted);
  });

  const showWarningIcon = useMultiPipe([field, ...groups], states => {
    const validity = ValidityUtils.minValidity(states);
    const fieldState = states[0];

    return (
      ValidityUtils.isCaution(validity) &&
      (fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted)
    );
  });

  return (
    <div className={containerClassName} style={containerStyle}>
      <Label field={field} variant={labelVariant}>
        {labelContent}
      </Label>
      <Input
        field={field}
        groups={groups}
        type={type}
        showText={labelVariant === 'stationary'}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-required={ariaRequired}
        aria-describedby={messagesId}
        maxLength={maxLength}
        max={max}
      />
      <div className={styles.messages_container}>
        {showWarningIcon && (
          <Image
            src={warningIconLight}
            alt="Warning Icon"
            className={styles.warning_icon}
          />
        )}
        <Messages
          messageBearers={[field, ...groups]}
          id={messagesId}
          hideMessages={hideMessages}
        />
      </div>
    </div>
  );
}
