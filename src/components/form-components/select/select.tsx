'use client';
import {
  useRef,
  useId,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { usePipe, type Field } from 'fully-formed';
import { Combobox } from './combobox';
import { Menu, type MenuRef } from './menu';
import { Messages } from '../messages';
import { WidthSetter } from './width-setter';
import type { FieldOfType } from 'fully-formed';
import type { Option } from './types/option';
import type { GroupConfigObject } from '../types/group-config-object';
import styles from './styles.module.scss';
import { MoreInfo } from '@/components/utils/more-info';

interface SelectProps {
  /**
   * Text to be displayed when no option is selected. The `aria-label` attribute
   * of the combobox is also set to this value.
   */
  label: string;
  /**
   * A Fully Formed {@link Field} that will control the state of the component.
   */
  field: FieldOfType<string>;
  /**
   * An array of {@link GroupConfigObject}s. The validity of each group included
   * in this array will count towards the validity displayed by the component.
   * Messages for groups whose config object contains `displayMessages: true`
   * will be displayed by this component.
   */
  groups?: GroupConfigObject[];
  /**
   * A list of selectable options to be displayed in the menu.
   */
  options: Option[];
  /**
   * If included, renders a {@link MoreInfo} component next to the combobox
   * which opens a modal containing the {@link ReactNode} passed in via this
   * prop.
   */
  moreInfo?: {
    buttonAltText: string;
    dialogAriaLabel: string;
    infoComponent: ReactNode;
  };
  className?: string;
  style?: CSSProperties;
  ['aria-required']?: boolean;
}

/**
 * A custom Select component that is fully accessible and whose value,
 * validity and messages are controlled by a {@link Field}.
 *
 * @param props - {@link SelectProps}
 *
 * @remarks
 * In addition to implementing mouse- and touch-based navigation, the component
 * implements the following keyboard navigation controls:
 * - From the combobox:
 *   - `Enter` - opens the menu and focuses on the currently selected option, or
 *      the first option if no option is selected.
 *   - `ArrowDown` - opens the menu and focuses on the first option.
 *   - `ArrowUp` - opens the menu and focuses on the last option.
 *   - Printable characters - opens the menu and focuses on the first option
 *     that starts with that character.
 * - From the menu:
 *   - `Enter` - accepts the currently focused option, closes the menu and
 *     returns focus to the combobox.
 *   - `Tab` - same as `Enter`.
 *   - `Escape` - closes the menu and returns focus to the combobox without
 *     accepting the currently focused option.
 *   - `ArrowDown` - focuses on the next option in the list.
 *   - `ArrowUp` - focuses on the previous option in the list.
 *   - Printable characters - focuses on the first option in the list that
 *     starts with that character.
 */
export function Select({
  label,
  field,
  groups = [],
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
  const messageBearers = [
    field,
    ...groups.filter(group => group.displayMessages).map(({ group }) => group),
  ];
  const hideMessages = usePipe(
    field,
    ({ hasBeenBlurred, hasBeenModified, submitted }) => {
      return !(hasBeenBlurred || hasBeenModified || submitted);
    },
  );

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
      field.blur();
    }

    document.addEventListener('click', handleClickOutsideSelect);

    return () =>
      document.removeEventListener('click', handleClickOutsideSelect);
  }, [field]);

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
          groups={groups.map(({ group }) => group)}
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
            buttonAltText={moreInfo.buttonAltText}
            dialogAriaLabel={moreInfo.dialogAriaLabel}
            info={moreInfo.infoComponent}
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
        messageBearers={messageBearers}
        id={messagesId}
        hideMessages={hideMessages}
      />
      <WidthSetter label={label} options={options} hasMoreInfo={!!moreInfo} />
    </div>
  );
}
