'use client';
import {
  forwardRef,
  type ForwardedRef,
  type KeyboardEventHandler,
  type RefObject,
} from 'react';
import {
  usePipe,
  useMultiPipe,
  useValue,
  ValidityUtils,
  type FieldOfType,
  type IGroup,
} from 'fully-formed';
import Image from 'next/image';
import { isPrintableCharacterKey } from '../utils/is-printable-character-key';
import caretDown from '../../../../../public/static/images/components/select/caret-down.svg';
import type { Option } from '../types/option';
import type { MenuRef } from '../menu';
import styles from './styles.module.scss';

interface ComboboxProps {
  label: string;
  field: FieldOfType<string>;
  groups: IGroup[];
  options: Option[];
  menuId: string;
  menuRef: RefObject<MenuRef>;
  hasMoreInfo: boolean;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
}

export const Combobox = forwardRef(function Combobox(
  props: ComboboxProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const displayValue = usePipe(props.field, ({ value }) => {
    const option = props.options.find(option => option.value === value);

    if (option) {
      return option.text;
    } else {
      return value;
    }
  });

  const comboboxClassName = useMultiPipe(
    [props.field, ...props.groups],
    states => {
      const fieldState = states[0];
      const classNames = [styles.combobox];

      const validity = ValidityUtils.minValidity(states, {
        pruneUnvalidatedGroups: true,
      });

      if (
        ValidityUtils.isInvalid(validity) &&
        (fieldState.hasBeenBlurred ||
          fieldState.hasBeenModified ||
          fieldState.submitted)
      ) {
        classNames.push(styles.invalid);
      }

      return classNames.join(' ');
    },
  );

  const ariaInvalid = usePipe(
    props.field,
    ({ validity, hasBeenBlurred, hasBeenModified, submitted }) => {
      return (
        ValidityUtils.isInvalid(validity) &&
        (hasBeenBlurred || hasBeenModified || submitted)
      );
    },
  );

  const handleKeyboardInput: KeyboardEventHandler = event => {
    const { key } = event;
    const controlKeys = ['ArrowDown', 'ArrowUp', 'Enter'];

    /* 
      Prevent default behavior (such as scrolling) ONLY when key is a control 
      key or a printable character, preserving default behavior for keys like
      tab.
    */
    if (controlKeys.includes(key) || isPrintableCharacterKey(key)) {
      event.preventDefault();
    }

    if (key === 'ArrowDown') {
      openMenuToFirstWithKeyboard();
    } else if (key === 'ArrowUp') {
      openMenuToLastWithKeyboard();
    } else if (key === 'Enter') {
      openMenuToSelectedOrFirstWithKeyboard();
    } else if (isPrintableCharacterKey(key)) {
      openMenuWithAutoComplete(key);
    }
  };

  function toggleMenuOnClick() {
    let indexOfOptionToReceiveFocus = getSelectedOptionIndex();

    if (indexOfOptionToReceiveFocus === -1) {
      indexOfOptionToReceiveFocus = 0;
    }

    props.menuRef.current?.toggleMenu(indexOfOptionToReceiveFocus, false);
  }

  function openMenuToFirstWithKeyboard() {
    props.menuRef.current?.openMenu(0, true);
  }

  function openMenuToLastWithKeyboard() {
    props.menuRef.current?.openMenu(props.options.length - 1, true);
  }

  function openMenuToSelectedOrFirstWithKeyboard() {
    let indexOfOptionToReceiveFocus = getSelectedOptionIndex();

    if (indexOfOptionToReceiveFocus === -1) {
      indexOfOptionToReceiveFocus = 0;
    }

    props.menuRef.current?.openMenu(indexOfOptionToReceiveFocus, true);
  }

  function openMenuWithAutoComplete(key: string) {
    const indexOfOptionToReceiveFocus = props.options.findIndex(option => {
      return option.text.toLowerCase().startsWith(key);
    });

    if (indexOfOptionToReceiveFocus >= 0) {
      props.menuRef.current?.openMenu(indexOfOptionToReceiveFocus, true);
    } else {
      openMenuToSelectedOrFirstWithKeyboard();
    }
  }

  function getSelectedOptionIndex() {
    return props.options.findIndex(option => {
      return option.value === props.field.state.value;
    });
  }

  return (
    <div
      className={
        props.hasMoreInfo ? styles.container_with_more_info : styles.container
      }
      onClick={toggleMenuOnClick}
    >
      <span aria-hidden className={comboboxClassName}>
        <span className={styles.selection}>
          {displayValue ? displayValue : props.label}
        </span>
        <Image src={caretDown} alt="" />
      </span>
      <input
        name={props.field.name}
        id={props.field.id}
        ref={ref}
        role="combobox"
        aria-controls={props.menuId}
        aria-expanded={false}
        aria-label={props.label}
        aria-describedby={props['aria-describedby']}
        aria-invalid={ariaInvalid}
        aria-required={props['aria-required']}
        type="text"
        value={useValue(props.field)}
        onKeyDown={handleKeyboardInput}
        className={styles.input}
        autoComplete="off"
        readOnly
      />
    </div>
  );
});
