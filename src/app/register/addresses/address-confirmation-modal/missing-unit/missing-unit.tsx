import { FormattedAddress } from '../formatted-address';
import { Label } from '@/components/form-components/label';
import { Input } from '@/components/form-components/input';
import { Button } from '@/components/utils/button';
import type { Address } from '../types/address';
import type { AddressForm } from '../types/address-form';
import styles from './styles.module.scss';

interface MissingUnitProps {
  enteredAddress: Address;
  form: AddressForm;
  errorNumber: number;
  errorCount: number;
  nextOrContinue: () => void;
}

export function MissingUnit({
  enteredAddress,
  form,
  errorNumber,
  errorCount,
  nextOrContinue,
}: MissingUnitProps) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Missing Information</p>
      <p className={styles.caption}>Does your building have multiple units?</p>
      <p className={styles.error_number_of_count}>
        {errorNumber} / {errorCount}
      </p>

      <p className={styles.what_you_entered}>What you entered</p>
      <FormattedAddress address={enteredAddress} className={styles.address} />

      <p className={styles.missing_information}>Missing Information</p>
      <Label field={form.fields.streetLine2} variant="floating">
        Address Line 2
      </Label>
      <Input type="text" field={form.fields.streetLine2} />

      <Button
        type="button"
        onClick={nextOrContinue}
        variant="inverted"
        size="sm"
        wide
        className="mt_lg"
      >
        {errorNumber === errorCount ? 'Continue' : 'Next'}
      </Button>
    </div>
  );
}
