'use client';
import { useState, type FormEventHandler } from 'react';
import Image from 'next/image';
import { ValidityUtils } from 'fully-formed';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { useForm } from 'fully-formed';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { SubmissionError } from '@/components/form-components/submission-error';
import { focusOnElementById } from '@/utils/focus-on-element-by-id';
import { FormInvalidError } from '@/utils/form-invalid-error';
import { sentOTP } from '@/components/guards/sent-otp';
import { SignInWithOTPForm } from './signin-with-otp-form';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { isSignedOut } from '@/components/guards/is-signed-out';
import styles from './styles.module.scss';

function SignInWithOTP() {
  const form = useForm(new SignInWithOTPForm());
  const { emailForSignIn, signInWithOTP } = useContextSafely(
    UserContext,
    'SignInWithOTP',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmissionError, setHasSubmissionError] = useState(false);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    if (isLoading) return;

    setHasSubmissionError(false);
    form.setSubmitted();

    if (!ValidityUtils.isValid(form)) {
      focusOnElementById(form.fields.otp.id);
      return;
    }

    try {
      setIsLoading(true);
      await signInWithOTP(form.state.value);
    } catch (e) {
      setIsLoading(false);
      setHasSubmissionError(true);
    }
  };

  return (
    <PageContainer>
      {isLoading && <LoadingWheel />}
      <form onSubmit={onSubmit} noValidate name="signInWithOTPForm">
        {hasSubmissionError && (
          <SubmissionError text="Something went wrong. Please try again." />
        )}
        <div className={styles.title_and_fields_container}>
          <div className={styles.hero}>
            <h1>
              Welcome
              <br />
              back!
            </h1>
            <Image
              src="/static/images/pages/signin/person-voting.png"
              width={144}
              height={144}
              alt="person voting"
              className={styles.person_voting}
            />
          </div>
          <p className={styles.passcode_sent_to}>
            A one time passcode has been sent to
            <br />
            <span className="b5">{emailForSignIn}</span>
          </p>
          <InputGroup
            field={form.fields.otp}
            type="number"
            labelVariant="floating"
            labelContent="One time passcode*"
            disabled={isLoading}
            containerClassName={styles.input_group}
          />
          <p className={styles.resend_code}>Resend Code (60s)</p>
        </div>
        <div className={styles.submit_btn_container}>
          <button
            type="submit"
            className="btn_gradient btn_lg btn_wide"
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </form>
    </PageContainer>
  );
}

export default isSignedOut(sentOTP(SignInWithOTP));
