import { Label } from '../label';
import { Input } from '../input';
import { Messages } from '../messages';
import { usePipe, type FieldOfType, type IGroup } from 'fully-formed';
import type { CSSProperties, ReactNode } from 'react';

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
      />
      <Messages
        messageBearers={[field, ...groups]}
        id={messagesId}
        hideMessages={hideMessages}
      />
    </div>
  );
}
