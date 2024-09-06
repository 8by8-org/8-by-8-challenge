import { isEmphasized } from './utils/is-emphasized';
import { getText } from './utils/get-text';
import type { CSSProperties } from 'react';
import type { Address } from '@/model/types/addresses/address';
import type { AddressComponents } from '@/model/types/addresses/address-components';
import styles from './styles.module.scss';

interface FormattedAddressProps {
  address: Address | AddressComponents;
  className?: string;
  style?: CSSProperties;
}

export function FormattedAddress({
  address,
  className,
  style,
}: FormattedAddressProps) {
  return (
    <address className={className} style={style}>
      <span
        className={
          isEmphasized(address.streetLine1) ?
            styles.emphasized_text
          : styles.normal_text
        }
      >
        {getText(address.streetLine1)}
      </span>

      {', '}
      {address.streetLine2 && (
        <span
          className={
            isEmphasized(address.streetLine2) ?
              styles.emphasized_text
            : styles.normal_text
          }
        >
          {getText(address.streetLine2)}
        </span>
      )}
      <br />
      <span>
        <span
          className={
            isEmphasized(address.city) ?
              styles.emphasized_text
            : styles.normal_text
          }
        >
          {getText(address.city)}
        </span>

        {', '}
        <span className={styles.state_zip}>
          <span
            className={
              isEmphasized(address.state) ?
                styles.emphasized_text
              : styles.normal_text
            }
          >
            {getText(address.state)}
          </span>{' '}
          <span
            className={
              isEmphasized(address.zip) ?
                styles.emphasized_text
              : styles.normal_text
            }
          >
            {getText(address.zip)}
          </span>
        </span>
      </span>
    </address>
  );
}
