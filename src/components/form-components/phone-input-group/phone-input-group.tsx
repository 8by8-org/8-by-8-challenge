'use client';
import { Label } from '../label';
import { PhoneInput } from '../phone-input/phone-input';
import { Messages } from '../messages';
import { usePipe, type FieldOfType, type IGroup } from 'fully-formed';
import type { CSSProperties, ReactNode } from 'react';

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
      <Messages
        messageBearers={[field, ...groups]}
        id={messagesId}
        hideMessages={hideMessages}
      />
    </div>
  );
}
