'use client';
import { useState, useId } from 'react';
import { useValue, ValidityUtils } from 'fully-formed';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../voter-registration-context';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { Select } from '@/components/form-components/select';
import { Checkbox } from '@/components/form-components/checkbox';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { InputGroup } from '@/components/form-components/input-group';
import { Button } from '@/components/utils/button';
import { Input } from '@/components/form-components/input';
import { Label } from '@/components/form-components/label';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { getFirstNonValidInputId } from './get-first-non-valid-input-id';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import type { FormEventHandler } from 'react';
import type { PoliticalPartiesAndOtherDetails } from '@/model/types/political-parties-and-other-details';
import styles from './styles.module.scss';

export function OtherDetails({
  politicalParties,
  raceOptions,
  idNumberMessage,
}: PoliticalPartiesAndOtherDetails) {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'OtherDetails',
  );
  const form = voterRegistrationForm.fields.otherDetails;
  const idFieldDescriptionId = useId();
  const { registerToVote } = useContextSafely(UserContext, 'OtherDetails');
  const { showAlert } = useContextSafely(AlertsContext, 'OtherDetails');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    if (isSubmitting) return;

    form.setSubmitted();

    if (!ValidityUtils.isValid(form)) {
      const firstNonValidInputId = getFirstNonValidInputId(form);
      firstNonValidInputId && focusOnElementById(firstNonValidInputId);
      return;
    }

    try {
      setIsSubmitting(true);
      await registerToVote(voterRegistrationForm.state.value);
    } catch (e) {
      setIsSubmitting(false);
      showAlert('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Other Details</h2>
      <Select
        field={form.fields.party}
        label="Political party*"
        options={politicalParties.map(party => ({
          text: party,
          value: party,
        }))}
        className={styles.select}
        aria-required
      />
      <ExcludableContent excludableField={form.fields.otherParty}>
        <InputGroup
          field={form.fields.otherParty}
          type="text"
          labelVariant="floating"
          labelContent="If other, please specify*"
          containerClassName={styles.other_party}
          aria-required
        />
      </ExcludableContent>
      <Checkbox
        checked={useValue(form.fields.changedParties)}
        onChange={e => form.fields.changedParties.setValue(e.target.checked)}
        name={form.fields.changedParties.name}
        labelContent="I've changed political parties"
        containerClassName={styles.checkbox}
      />
      <Select
        field={form.fields.race}
        label="Race*"
        options={raceOptions.map(value => {
          return {
            text: value,
            value,
          };
        })}
        className={styles.race}
        moreInfo={{
          buttonAltText:
            'Click for more details about why we collect this information',
          dialogAriaLabel: 'More details about why we collect this information',
          infoComponent: (
            <p>
              We appreciate this information in order to measure the
              effectiveness of our voter registration efforts. Additionally,
              this information is required by some states.
            </p>
          ),
        }}
        aria-required
      />
      <Label field={form.fields.id} variant="floating">
        ID number*
      </Label>
      <Input
        field={form.fields.id}
        type="text"
        aria-required
        aria-describedby={idFieldDescriptionId}
      />
      <p className={styles.id_explainer} id={idFieldDescriptionId}>
        {idNumberMessage}
      </p>
      <Button type="submit" size="lg" wide className="mb_lg">
        Submit
      </Button>
      {isSubmitting && <LoadingWheel />}
    </form>
  );
}
