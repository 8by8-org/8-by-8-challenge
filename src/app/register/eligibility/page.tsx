'use client';
import { useState, useEffect, type FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { ValidityUtils, usePipe, useValue } from 'fully-formed';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../voter-registration-context';
import { Label } from '@/components/form-components/label';
import { Checkbox } from '@/components/form-components/checkbox';
import { InputGroup } from '@/components/form-components/input-group';
import { Modal } from '@/components/utils/modal';
import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
import { getEligibilityStatusMessage } from './get-eligibility-status-message';
import styles from './styles.module.scss';

export default function Eligibility() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Eligibility',
  );

  const eligibilityForm = voterRegistrationForm.fields.eligibility;

  const eligibilityStatusMessage = usePipe(eligibilityForm, state => {
    if (!ValidityUtils.isValid(state)) return '';

    return getEligibilityStatusMessage(state.value.dob, state.value.zip);
  });

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(VoterRegistrationPathNames.NAMES);
  }, [router]);

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    eligibilityForm.setSubmitted();

    if (!ValidityUtils.isValid(eligibilityForm)) return;

    if (eligibilityStatusMessage) {
      setShowModal(true);
    } else {
      router.push(VoterRegistrationPathNames.NAMES);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '80px' }}>
      <p style={{ marginBottom: '36px' }}>
        Registering to vote is easy, and only takes a few minutes!
      </p>
      <h2 style={{ marginBottom: '24px' }}>Eligibility</h2>
      <Label field={eligibilityForm.fields.email} variant="stationary">
        Email
      </Label>
      <input
        name={eligibilityForm.fields.email.name}
        id={eligibilityForm.fields.email.id}
        value={useValue(eligibilityForm.fields.email) || 'user@example.com'}
        type="email"
        readOnly
        className={styles.readonly_input}
      />
      <InputGroup
        type="text"
        field={eligibilityForm.fields.zip}
        labelVariant="floating"
        labelContent="Zip Code*"
        maxLength={5}
        containerStyle={{
          marginBottom: '30px',
        }}
      />
      <InputGroup
        type="date"
        field={eligibilityForm.fields.dob}
        labelVariant="floating"
        labelContent="Date of Birth*"
        containerStyle={{
          marginBottom: '30px',
        }}
      />
      <Checkbox
        name={eligibilityForm.fields.eighteenPlus.name}
        checked={useValue(eligibilityForm.fields.eighteenPlus)}
        onChange={e => {
          eligibilityForm.fields.eighteenPlus.setValue(e.target.checked);
        }}
        labelContent="I will be 18 years-old or older by the next election.*"
        containerStyle={{
          marginBottom: '24px',
        }}
      />
      <Checkbox
        name={eligibilityForm.fields.isCitizen.name}
        checked={useValue(eligibilityForm.fields.isCitizen)}
        onChange={e => {
          eligibilityForm.fields.isCitizen.setValue(e.target.checked);
        }}
        labelContent="I am a US citizen.*"
        containerStyle={{
          marginBottom: '40px',
        }}
      />
      <button type="submit" className="btn_gradient btn_lg btn_wide">
        Get Started
      </button>
      <Modal
        ariaLabel=""
        theme="light"
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
      >
        <h3 className="b1" style={{ marginBottom: '30px' }}>
          Hey there!
          <br />
          Looks like you&apos;re not 18 yet.
        </h3>
        <p>{eligibilityStatusMessage}</p>
        <div className={styles.modal_button_container}>
          <button
            className={styles.modal_button}
            type="button"
            onClick={() => {
              router.push(VoterRegistrationPathNames.NAMES);
            }}
          >
            <span>Keep Going</span>
          </button>
          <button
            className={styles.modal_button}
            type="button"
            onClick={() => setShowModal(false)}
          >
            <span>Nevermind</span>
          </button>
        </div>
      </Modal>
    </form>
  );
}
