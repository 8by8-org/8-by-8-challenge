'use client';
import {
  usePipe,
  useMultiPipe,
  ValidityUtils,
  type FieldOfType,
  type IGroup,
} from 'fully-formed';
import Image from 'next/image';
import { Label } from '../label';
import { PhoneInput } from '../phone-input/phone-input';
import { Messages } from '../messages';
import type { CSSProperties, ReactNode } from 'react';
import warningIconLight from '@/../public/static/images/components/shared/warning-icon-light.svg';
import styles from './styles.module.scss';

type InputGroupProps = {
  field: FieldOfType<string>;
  groups?: IGroup[];
  labelVariant: 'floating' | 'stationary';
  labelContent: ReactNode;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  ['aria-required']?: boolean;
};

export function PhoneInputGroup({
  field,
  groups = [],
  labelVariant,
  labelContent,
  containerClassName,
  containerStyle,
  placeholder,
  disabled,
  autoComplete,
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
      <PhoneInput
        field={field}
        groups={groups}
        showText={labelVariant === 'stationary'}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-required={ariaRequired}
        aria-describedby={messagesId}
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
