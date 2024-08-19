'use client';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { VoterRegistrationContext } from '../voter-registration-context';
import { NameFieldset } from './name-fieldset';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { Checkbox } from '@/components/form-components/checkbox';
import { ValidityUtils, useExclude } from 'fully-formed';
import { FormEventHandler, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VOTER_REGISTRATION_PATHNAMES } from '../constants/voter-registration-pathnames';
import { usePrefetch } from '@/hooks/functions/use-prefetch';

export default function Names() {
  usePrefetch('/register/addresses');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Names',
  );
  const namesForm = voterRegistrationForm.fields.names;
  const router = useRouter();

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    namesForm.setSubmitted();

    if (!ValidityUtils.isValid(namesForm)) return;

    router.push(VOTER_REGISTRATION_PATHNAMES[2]);
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
