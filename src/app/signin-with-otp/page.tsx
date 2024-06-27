'use client';
import { useState, type FormEventHandler } from 'react';
import { ValidityUtils } from 'fully-formed';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { useForm } from 'fully-formed';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { Turnstile } from '@/components/form-components/turnstile';
import { SubmissionError } from '@/components/form-components/submission-error';
import { waitForPendingValidators } from '@/utils/wait-for-pending-validators';
import { scrollToElementById } from '@/utils/scroll-to-element-by-id';
import { focusOnElementById } from '@/utils/focus-on-element-by-id';
import { FormInvalidError } from '@/utils/form-invalid-error';
import { sentOTP } from '@/components/guards/sent-otp';
import { SignInWithOTPForm } from './signin-with-otp-form';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { isSignedOut } from '@/components/guards/is-signed-out';

function SignInWithOTP() {
  const form = useForm(new SignInWithOTPForm());
  const { signInWithOTP } = useContextSafely(UserContext, 'SignInWithOTP');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmissionError, setHasSubmissionError] = useState(false);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    if (isLoading) return;

    setHasSubmissionError(false);
    form.setSubmitted();
    setIsLoading(true);

    try {
      const formValue = await waitForPendingValidators(form);
      await signInWithOTP(formValue);
    } catch (e) {
      setIsLoading(false);

      if (e instanceof FormInvalidError) {
        if (!ValidityUtils.isValid(form.fields.otp)) {
          focusOnElementById(form.fields.otp.id);
        } else {
          scrollToElementById(form.fields.captchaToken.id);
        }
      } else {
        setHasSubmissionError(true);
      }
    }
  };

  return (
    <PageContainer>
      {isLoading && <LoadingWheel />}
      <form onSubmit={onSubmit} noValidate name="signInWithOTPForm">
        {hasSubmissionError && (
          <SubmissionError text="Something went wrong. Please try again." />
        )}
        <div>
          <InputGroup
            field={form.fields.otp}
            type="text"
            labelVariant="floating"
            labelContent="Email address*"
            maxLength={6}
            disabled={isLoading}
          />
          <Turnstile field={form.fields.captchaToken} />
        </div>
        <div>
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
