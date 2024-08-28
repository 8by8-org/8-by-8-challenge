'use client';
import { useExclude, ValidityUtils } from 'fully-formed';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
import { HomeAddress } from './home-address';
import { Checkbox } from '@/components/form-components/checkbox';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { MailingAddress } from './mailing-address';
import { PreviousAddress } from './previous-address';
import { Button } from '@/components/utils/button';
import type { FormEventHandler } from 'react';
import styles from './styles.module.scss';

export default function Addresses() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Addresses',
  );
  const addressesForm = voterRegistrationForm.fields.addresses;

  const router = useRouter();
  useScrollToTop();

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    addressesForm.setSubmitted();
    if (!ValidityUtils.isValid(addressesForm)) return;

    router.push(
      VoterRegistrationPathNames.OTHER_DETAILS +
        `/${addressesForm.state.value.homeAddress.state}` +
        `/${addressesForm.state.value.homeAddress.zip}`,
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <HomeAddress />
      <Checkbox
        checked={!useExclude(addressesForm.fields.mailingAddress)}
        onChange={e => {
          addressesForm.fields.mailingAddress.setExclude(!e.target.checked);
        }}
        labelContent="I get my mail at a different address from the one above"
        name="hasMailingAddress"
        containerClassName={
          useExclude(addressesForm.fields.mailingAddress) ?
            styles.has_mailing_address_unchecked
          : styles.has_mailing_address_checked
        }
      />
      <ExcludableContent excludableField={addressesForm.fields.mailingAddress}>
        <MailingAddress />
      </ExcludableContent>
      <Checkbox
        checked={!useExclude(addressesForm.fields.previousAddress)}
        onChange={e => {
          addressesForm.fields.previousAddress.setExclude(!e.target.checked);
        }}
        labelContent="I've changed my address since the last time I registered to vote"
        name="hasPreviousAddress"
        containerClassName="mb_md"
      />
      <ExcludableContent excludableField={addressesForm.fields.previousAddress}>
        <PreviousAddress />
      </ExcludableContent>
      <Button type="submit" size="lg" wide className="mb_lg">
        Next
      </Button>
    </form>
  );
}