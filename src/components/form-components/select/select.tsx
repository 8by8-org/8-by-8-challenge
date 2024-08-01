'use client';
import {
  useRef,
  useId,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { usePipe } from 'fully-formed';
import { Combobox } from './combobox';
import { Menu, type MenuRef } from './menu';
import { Messages } from '../messages';
import { WidthSetter } from './width-setter';
import type { FieldOfType } from 'fully-formed';
import type { Option } from './types/option';
import styles from './styles.module.scss';
import { MoreInfo } from '@/components/utils/more-info';

interface SelectProps {
  label: string;
  field: FieldOfType<string>;
  options: Option[];
  moreInfo?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ['aria-required']?: boolean;
}

export function Select({
  label,
  field,
  options,
  moreInfo,
  className,
  style,
  ['aria-required']: ariaRequired,
}: SelectProps) {
  const selectRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<MenuRef>(null);
  const menuId = useId();
  const messagesId = useId();

  const hideMessages = usePipe(field, ({ hasBeenModified, submitted }) => {
    return !(hasBeenModified || submitted);
  });

  const classNames = [styles.select];

  if (className) {
    classNames.push(className);
  }

  useEffect(() => {
    function handleClickOutsideSelect(e: MouseEvent) {
      let node = e.target as HTMLElement | ParentNode | null;

      while (node) {
        if (node == selectRef.current) return;
        node = node.parentNode;
      }

      menuRef.current?.closeMenu();
    }

    document.addEventListener('click', handleClickOutsideSelect);

    return () =>
      document.removeEventListener('click', handleClickOutsideSelect);
  }, []);

  return (
    <div
      className={classNames.join(' ')}
      ref={selectRef}
      style={style}
      title={label}
    >
      <div className={styles.combobox_container}>
        <Combobox
          label={label}
          field={field}
          menuId={menuId}
          options={options}
          menuRef={menuRef}
          ref={comboboxRef}
          hasMoreInfo={!!moreInfo}
          aria-required={ariaRequired}
          aria-describedby={messagesId}
        />
        {moreInfo && (
          <MoreInfo
            topic={label}
            info={moreInfo}
            className={styles.open_more_info}
          />
        )}
        <Menu
          field={field}
          id={menuId}
          options={options}
          comboboxRef={comboboxRef}
          ref={menuRef}
        />
      </div>
      <Messages
        messageBearers={[field]}
        id={messagesId}
        hideMessages={hideMessages}
      />
      <WidthSetter label={label} options={options} hasMoreInfo={!!moreInfo} />
    </div>
  );
}
