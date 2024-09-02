'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';
import { Modal } from '@/components/utils/modal';
import { ConfirmAddress } from './confirm-address';
import { MissingUnit } from './missing-unit';
import { CouldNotConfirm } from './could-not-confirm';
import { ReviewAddresses } from './review-addresses';
import { AddressErrorType } from '../../../../model/enums/address-error-type';
import type { AddressesForm } from '../addresses-form';
import type { AddressError } from '../../../../model/types/addresses/address-errors';

interface AddressConfirmationModalProps {
  addressesForm: InstanceType<typeof AddressesForm>;
  errors: AddressError[];
  returnToEditing: () => void;
}

export function AddressConfirmationModal({
  addressesForm,
  errors,
  returnToEditing,
}: AddressConfirmationModalProps) {
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const router = useRouter();

  const continueToNextPage = () => {
    router.push(
      VoterRegistrationPathnames.OTHER_DETAILS +
        `?state=${addressesForm.state.value.homeAddress.state}&zip=${addressesForm.state.value.homeAddress.zip}`,
    );
  };

  const nextOrContinue = () => {
    if (currentErrorIndex < errors.length - 1) {
      setCurrentErrorIndex(currentErrorIndex + 1);
    } else {
      continueToNextPage();
    }
  };

  return (
    <Modal
      ariaLabel="Correct address validation errors"
      theme="light"
      isOpen={!!errors.length}
      closeModal={returnToEditing}
    >
      {(() => {
        const error = errors[currentErrorIndex];

        switch (error.type) {
          case AddressErrorType.ConfirmationNeeded:
            return (
              <ConfirmAddress
                enteredAddress={error.enteredAddress}
                recommendedAddress={error.recommendedAddress}
                form={addressesForm.fields[error.affectedForm]}
                errorNumber={currentErrorIndex + 1}
                errorCount={errors.length}
                nextOrContinue={nextOrContinue}
              />
            );
          case AddressErrorType.MissingUnit:
            return (
              <MissingUnit
                enteredAddress={error.enteredAddress}
                form={addressesForm.fields[error.affectedForm]}
                errorNumber={currentErrorIndex + 1}
                errorCount={errors.length}
                nextOrContinue={nextOrContinue}
              />
            );
          case AddressErrorType.FailedToConfirm:
            return (
              <CouldNotConfirm
                enteredAddress={error.enteredAddress}
                errorNumber={currentErrorIndex + 1}
                errorCount={errors.length}
                returnToEditing={returnToEditing}
                nextOrContinue={nextOrContinue}
              />
            );
          case AddressErrorType.FailedToValidate:
            return (
              <ReviewAddresses
                homeAddress={addressesForm.state.value.homeAddress}
                mailingAddress={addressesForm.state.value.mailingAddress}
                previousAddress={addressesForm.state.value.previousAddress}
                returnToEditing={returnToEditing}
                continueToNextPage={continueToNextPage}
              />
            );
        }
      })()}
    </Modal>
  );
}
