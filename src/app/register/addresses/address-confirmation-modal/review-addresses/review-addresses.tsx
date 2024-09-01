'use client';
import { useRouter } from 'next/navigation';
import { FormattedAddress } from '../formatted-address';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import { Button } from '@/components/utils/button';
import type { Address } from '../types/address';
import styles from './styles.module.scss';

interface ReviewAddressesProps {
  homeAddress: Address;
  mailingAddress?: Address;
  previousAddress?: Address;
  returnToEditing?: () => void;
}

export function ReviewAddresses({
  homeAddress,
  mailingAddress,
  previousAddress,
  returnToEditing,
}: ReviewAddressesProps) {
  const router = useRouter();

  return (
    <div>
      <p className={styles.title}>
        {(mailingAddress || previousAddress ?
          'These are the addresses you entered.'
        : 'This is the address you entered.') + ' Would you like to continue?'}
      </p>
      <p className={styles.address_title}>Home Address</p>
      <FormattedAddress address={homeAddress} className={styles.address} />
      {mailingAddress && (
        <>
          <p className={styles.address_title}>Mailing Address</p>
          <FormattedAddress
            address={mailingAddress}
            className={styles.address}
          />
        </>
      )}
      {previousAddress && (
        <>
          <p className={styles.address_title}>Previous Address</p>
          <FormattedAddress
            address={previousAddress}
            className={styles.address}
          />
        </>
      )}
      <div className="mt_sm">
        <Button
          type="button"
          size="sm"
          wide
          className="mb_sm"
          onClick={returnToEditing}
        >
          Edit Addresses
        </Button>
        <Button
          type="button"
          variant="inverted"
          size="sm"
          wide
          onClick={() => {
            router.push(
              VoterRegistrationPathnames.OTHER_DETAILS +
                `?state=${homeAddress.state}&zip=${homeAddress.zip}`,
            );
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
