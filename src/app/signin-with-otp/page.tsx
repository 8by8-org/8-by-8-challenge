'use client';
import { useState, type FormEventHandler } from 'react';
import Image from 'next/image';
import { useForm, ValidityUtils } from 'fully-formed';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { Alert, useAlert } from '@/components/utils/alert';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { sentOTP } from '@/components/guards/sent-otp';
import { SignInWithOTPForm } from './signin-with-otp-form';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { isSignedOut } from '@/components/guards/is-signed-out';
import styles from './styles.module.scss';
import { useCountdown } from '@/hooks/functions/use-countdown';
import { delay } from '@/utils/client/delay';

function SignInWithOTP() {
  const form = useForm(new SignInWithOTPForm());
  const userContext = useContextSafely(UserContext, 'SignInWithOTP');
  const [isLoading, setIsLoading] = useState(false);
  const { countdown, restartCountdown } = useCountdown(10);
  const { alertRef, showAlert } = useAlert();

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    if (isLoading) return;
    form.setSubmitted();

    if (!ValidityUtils.isValid(form)) {
      focusOnElementById(form.fields.otp.id);
      return;
    }

    try {
      setIsLoading(true);
      await userContext.signInWithOTP(form.state.value);
    } catch (e) {
      setIsLoading(false);
      showAlert('There was a problem signing in. Please try again.', 'error');
    }
  };

  const resendOTP: FormEventHandler = async e => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      await userContext.resendOTP();
      delay(1000);
      showAlert('Code sent. Please check your email.', 'success');
    } catch (e) {
      showAlert('Error sending code. Please try again.', 'error');
    } finally {
      restartCountdown();
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      {isLoading && <LoadingWheel />}
      <form onSubmit={onSubmit} noValidate name="signInWithOTPForm">
        <Alert ref={alertRef} />
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
            <span className="b5">{userContext.emailForSignIn}</span>
          </p>
          <InputGroup
            field={form.fields.otp}
            type="number"
            labelVariant="floating"
            labelContent="One time passcode*"
            disabled={isLoading}
            containerClassName={styles.input_group}
          />
        </div>
        <div className={styles.resend_otp_container}>
          {countdown > 0 ?
            <p className={styles.countdown}>Resend Code ({countdown}s)</p>
          : <button onClick={resendOTP} className={styles.resend_otp}>
              Resend Code
            </button>
          }
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
