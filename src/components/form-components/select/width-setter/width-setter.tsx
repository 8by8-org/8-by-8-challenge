import type { Option } from '../types/option';
import styles from './styles.module.scss';

interface WidthSetterProps {
  /**
   * Text to be displayed by the parent `Select` component when no option is
   * selected.
   */
  label: string;
  /**
   * A list of selectable options to be displayed in the menu of the parent
   * `Select` component.
   */
  options: Option[];
  /**
   * A `boolean` flag indicating whether or not the parent `Select` component
   * will render a `MoreInfo` button. If so, the {@link WidthSetter} will be
   * wider to accomodate the width of this button and its margins.
   */
  hasMoreInfo: boolean;
}

/**
 * Renders all options plus the label in order to ensure that the width of the
 * parent `Select` component can accomodate the width of the widest option or
 * the label.
 *
 * @param props - {@link WidthSetterProps}
 */
export function WidthSetter({ label, options, hasMoreInfo }: WidthSetterProps) {
  return (
    <>
      <div
        className={
          hasMoreInfo ? styles.width_setter_with_more_info : styles.width_setter
        }
      >
        {label}
      </div>
      {options.map((option, index) => {
        return (
          <div className={styles.width_setter} key={index}>
            {option.text}
          </div>
        );
      })}
    </>
  );
}
