'use client';
import { useRouter } from 'next/navigation';
import { ValidityUtils, useExclude } from 'fully-formed';
import { useContextSafely } from '@/hooks/use-context-safely';
import { usePrefetch } from '@/hooks/use-prefetch';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathnames } from '../constants/voter-registration-pathnames';
import { YourName } from './your-name';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { PreviousName } from './previous-name';
import { Checkbox } from '@/components/form-components/checkbox';
import { MoreInfo } from '@/components/utils/more-info';
import { Button } from '@/components/utils/button';
import { getFirstNonValidInputId } from './utils/get-first-non-valid-input-id';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import type { FormEventHandler } from 'react';
import styles from './styles.module.scss';

export function Names() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Names',
  );
  const namesForm = voterRegistrationForm.fields.names;
  const router = useRouter();
  usePrefetch(VoterRegistrationPathnames.ADDRESSES);
  useScrollToTop();

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    namesForm.setSubmitted();

    if (!ValidityUtils.isValid(namesForm)) {
      const firstNonValidInputId = getFirstNonValidInputId(namesForm);
      firstNonValidInputId && focusOnElementById(firstNonValidInputId);
      return;
    }

    router.push(VoterRegistrationPathnames.ADDRESSES);
  };

  return (
    <form onSubmit={onSubmit}>
      <YourName />
      <div className={styles.checkbox_container}>
        <Checkbox
          checked={!useExclude(namesForm.fields.previousName)}
          onChange={e => {
            namesForm.fields.previousName.setExclude(!e.target.checked);
          }}
          labelContent="I've changed my name."
          name="changedName"
          containerClassName={styles.checkbox}
        />
        <MoreInfo
          buttonAltText={
            'Click for more information about entering a previous name.'
          }
          dialogAriaLabel={'More information about entering a previous name.'}
          info={
            <p>
              If you have changed your name since your last registration, check
              this box and enter your previous name below.
            </p>
          }
          className={styles.more_info_button}
        />
      </div>
      <ExcludableContent excludableField={namesForm.fields.previousName}>
        <PreviousName />
      </ExcludableContent>
      <Button type="submit" size="lg" wide className="mb_lg">
        Next
      </Button>
    </form>
  );
}
