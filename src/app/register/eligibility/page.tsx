'use client';
import { useState, type FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { ValidityUtils, usePipe, useValue } from 'fully-formed';
import zipState from 'zip-state';
import { useContextSafely } from '@/hooks/use-context-safely';
import { usePrefetch } from '@/hooks/use-prefetch';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
import { Label } from '@/components/form-components/label';
import { Checkbox } from '@/components/form-components/checkbox';
import { InputGroup } from '@/components/form-components/input-group';
import { Messages } from '@/components/form-components/messages';
import { PreregistrationInfoModal } from './preregistration-info-modal';
import { NorthDakotaInfoModal } from './north-dakota-info-modal';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import { calculateAge } from './utils/calculate-age';
import styles from './styles.module.scss';

export default function Eligibility() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'Eligibility',
  );
  const eligibilityForm = voterRegistrationForm.fields.eligibility;

  const [showPreregistrationInfoModal, setShowPreregistrationInfoModal] =
    useState(false);
  const [showNorthDakotaInfoModal, setShowNorthDakotaInfoModal] =
    useState(false);

  const router = useRouter();
  usePrefetch(VoterRegistrationPathNames.NAMES);

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    eligibilityForm.setSubmitted();

    if (!ValidityUtils.isValid(eligibilityForm)) return;

    if (
      zipState(eligibilityForm.fields.zip.state.value) ===
      US_STATE_ABBREVIATIONS.NORTH_DAKOTA
    ) {
      setShowNorthDakotaInfoModal(true);
    } else if (calculateAge(eligibilityForm.fields.dob.state.value) < 18) {
      setShowPreregistrationInfoModal(true);
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
      />
      <Messages
        messageBearers={[eligibilityForm.fields.eighteenPlus]}
        hideMessages={usePipe(eligibilityForm.fields.eighteenPlus, state => {
          return !(
            state.hasBeenBlurred ||
            state.hasBeenModified ||
            state.submitted
          );
        })}
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
      />
      <Messages
        messageBearers={[eligibilityForm.fields.isCitizen]}
        hideMessages={usePipe(eligibilityForm.fields.isCitizen, state => {
          return !(
            state.hasBeenBlurred ||
            state.hasBeenModified ||
            state.submitted
          );
        })}
        containerStyle={{
          marginBottom: '40px',
        }}
      />
      <button type="submit" className="btn_gradient btn_lg btn_wide">
        Get Started
      </button>
      {showNorthDakotaInfoModal && (
        <NorthDakotaInfoModal
          showModal={showNorthDakotaInfoModal}
          setShowModal={setShowNorthDakotaInfoModal}
        />
      )}
      {showPreregistrationInfoModal && (
        <PreregistrationInfoModal
          zipCodeField={eligibilityForm.fields.zip}
          showModal={showPreregistrationInfoModal}
          setShowModal={setShowPreregistrationInfoModal}
        />
      )}
    </form>
  );
}
