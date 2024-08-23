'use client';
import { useExclude, ValidityUtils } from 'fully-formed';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { usePrefetch } from '@/hooks/use-prefetch';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
import { AddressFieldset } from './address-fieldset';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { Checkbox } from '@/components/form-components/checkbox';
import type { FormEventHandler } from 'react';

export default function Addresses() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Addresses',
  );
  const addressesForm = voterRegistrationForm.fields.addresses;

  const router = useRouter();
  usePrefetch(VoterRegistrationPathNames.OTHER_INFO);
  useScrollToTop();

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    addressesForm.setSubmitted();
    if (!ValidityUtils.isValid(addressesForm)) return;

    router.push(VoterRegistrationPathNames.OTHER_INFO);
  };

  return (
    <form onSubmit={onSubmit}>
      <AddressFieldset
        title="Home Address"
        form={addressesForm.fields.homeAddress}
      />
      <Checkbox
        checked={!useExclude(addressesForm.fields.mailingAddress)}
        onChange={e => {
          addressesForm.fields.mailingAddress.setExclude(!e.target.checked);
        }}
        labelContent="I get my mail at a different address from the one above"
        name="hasMailingAddress"
      />
      <ExcludableContent excludableField={addressesForm.fields.mailingAddress}>
        <AddressFieldset
          title="Mailing Address"
          form={addressesForm.fields.mailingAddress}
        />
      </ExcludableContent>
      <Checkbox
        checked={!useExclude(addressesForm.fields.previousAddress)}
        onChange={e => {
          addressesForm.fields.previousAddress.setExclude(!e.target.checked);
        }}
        labelContent="I've changed my address since the last time I registered to vote"
        name="hasPreviousAddress"
      />
      <ExcludableContent excludableField={addressesForm.fields.previousAddress}>
        <AddressFieldset
          title="Previous Address"
          form={addressesForm.fields.previousAddress}
        />
      </ExcludableContent>
      <button
        type="submit"
        className="btn_gradient btn_lg btn_wide"
        style={{ marginTop: '40px' }}
      >
        Next
      </button>
    </form>
  );
}
