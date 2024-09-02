import { FormattedAddress } from '../formatted-address';
import { Button } from '@/components/utils/button';
import type { AddressComponents } from '@/model/types/addresses/address-components';
import styles from './styles.module.scss';

interface UnconfirmedComponentsProps {
  unconfirmedComponents: AddressComponents;
  errorNumber: number;
  errorCount: number;
  returnToEditing: () => void;
  nextOrContinue: () => void;
}

export function UnconfirmedComponents({
  unconfirmedComponents,
  errorNumber,
  errorCount,
  returnToEditing,
  nextOrContinue,
}: UnconfirmedComponentsProps) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>We couldn&apos;t confirm the address.</p>
      <p className={styles.caption}>
        Please review the <span className={styles.emphasized}>underlined</span>{' '}
        part of the address.
      </p>
      <p className={styles.error_number_of_count}>
        {errorNumber} / {errorCount}
      </p>
      <p className={styles.subtitle}>What you entered</p>
      <FormattedAddress
        address={unconfirmedComponents}
        className={styles.address}
      />
      <Button
        type="button"
        onClick={returnToEditing}
        size="sm"
        wide
        className="mb_sm"
      >
        Edit Address
      </Button>
      <Button
        type="button"
        onClick={nextOrContinue}
        variant="inverted"
        size="sm"
        wide
      >
        {errorNumber === errorCount ? 'Continue Anyway' : 'Next'}
      </Button>
    </div>
  );
}
