'use client';
import { useState, useId } from 'react';
import { FormattedAddress } from '../formatted-address';
import { Button } from '@/components/utils/button';
import type { AddressComponents } from '../types/address-components';
import type { AddressForm } from '../types/address-form';
import styles from './styles.module.scss';

interface ConfirmAddressProps {
  enteredAddress: AddressComponents;
  recommendedAddress: AddressComponents;
  form: AddressForm;
  errorNumber: number;
  errorCount: number;
  nextOrContinue: () => void;
}

export function ConfirmAddress({
  enteredAddress,
  recommendedAddress,
  form,
  errorNumber,
  errorCount,
  nextOrContinue,
}: ConfirmAddressProps) {
  const [useRecommended, setUseRecommended] = useState(true);
  const enteredAddressRadioButtonId = useId();
  const recommendedAddressRadioButtonId = useId();

  const confirmChoice = () => {
    if (useRecommended) {
      form.fields.streetLine1.setValue(recommendedAddress.streetLine1.text);
      form.fields.streetLine2.setValue(
        recommendedAddress.streetLine2 ?
          recommendedAddress.streetLine2.text
        : '',
      );
      form.fields.city.setValue(recommendedAddress.city.text);
      form.fields.zip.setValue(recommendedAddress.zip.text);
      form.fields.state.setValue(recommendedAddress.state.text);
    }

    nextOrContinue();
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Confirm Address</p>
      <p className={styles.caption}>
        Would you like to use the recommended address?
      </p>
      <p className={styles.error_number_of_count}>
        {errorNumber} / {errorCount}
      </p>

      <div className={styles.radio_group}>
        <input
          type="radio"
          checked={!useRecommended}
          onChange={() => setUseRecommended(false)}
          id={enteredAddressRadioButtonId}
          name="selectAddress"
          className={styles.radio}
        />
        <label htmlFor={enteredAddressRadioButtonId} className={styles.label}>
          <span className="b3">Use what you entered</span>
          <FormattedAddress
            address={enteredAddress}
            className={styles.address}
          />
        </label>
      </div>

      <div className={styles.radio_group}>
        <input
          type="radio"
          checked={useRecommended}
          onChange={() => setUseRecommended(true)}
          id={recommendedAddressRadioButtonId}
          name="selectAddress"
          className={styles.radio}
        />
        <label
          htmlFor={recommendedAddressRadioButtonId}
          className={styles.label}
        >
          <span className="b3">Use recommended</span>
          <FormattedAddress
            address={recommendedAddress}
            className={styles.address}
          />
        </label>
      </div>

      <Button
        type="button"
        variant="inverted"
        size="sm"
        wide
        onClick={confirmChoice}
        className="mt_lg"
      >
        {errorNumber === errorCount ? 'Continue' : 'Next'}
      </Button>
    </div>
  );
}
