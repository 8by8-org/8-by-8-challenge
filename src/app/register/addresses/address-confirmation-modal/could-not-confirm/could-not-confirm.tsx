import { FormattedAddress } from '../formatted-address';
import { Button } from '@/components/utils/button';
import type { AddressComponents } from '../types/address-components';
import styles from './styles.module.scss';

interface CouldNotConfirmProps {
  enteredAddress: AddressComponents;
  errorNumber: number;
  errorCount: number;
  returnToEditing: () => void;
  nextOrContinue: () => void;
}

export function CouldNotConfirm({
  enteredAddress,
  errorNumber,
  errorCount,
  returnToEditing,
  nextOrContinue,
}: CouldNotConfirmProps) {
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
      <FormattedAddress address={enteredAddress} className={styles.address} />
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
