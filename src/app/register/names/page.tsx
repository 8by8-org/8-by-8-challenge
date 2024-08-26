'use client';
import { useRouter } from 'next/navigation';
import { ValidityUtils, useExclude } from 'fully-formed';
import { useContextSafely } from '@/hooks/use-context-safely';
import { usePrefetch } from '@/hooks/use-prefetch';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
import { NameFieldset } from './names-fieldset/name-fieldset';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { Checkbox } from '@/components/form-components/checkbox';
import type { FormEventHandler } from 'react';

export default function Names() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Names',
  );
  const namesForm = voterRegistrationForm.fields.names;
  const router = useRouter();
  usePrefetch(VoterRegistrationPathNames.ADDRESSES);
  useScrollToTop();

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    namesForm.setSubmitted();
    if (!ValidityUtils.isValid(namesForm)) return;

    router.push(VoterRegistrationPathNames.ADDRESSES);
  };

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '80px' }}>
      <NameFieldset title="Your Name" form={namesForm.fields.yourName} />
      <Checkbox
        checked={!useExclude(namesForm.fields.previousName)}
        onChange={e => {
          namesForm.fields.previousName.setExclude(!e.target.checked);
        }}
        labelContent="I've changed my name."
        name="changedName"
        containerStyle={{ marginBottom: '30px' }}
      />
      <ExcludableContent excludableField={namesForm.fields.previousName}>
        <NameFieldset
          title="Previous Name"
          form={namesForm.fields.previousName}
        />
      </ExcludableContent>
      <button
        type="submit"
        className="btn_gradient btn_lg btn_wide"
        style={{ marginTop: '10px' }}
      >
        Next
      </button>
    </form>
  );
}
