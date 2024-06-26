'use client';
import { useState, type FormEventHandler } from 'react';
import { useForm } from 'fully-formed';
import Link from 'next/link';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import { SignUpForm } from './signup-form';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { SelectAvatar } from './select-avatar';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { Turnstile } from '@/components/form-components/turnstile/turnstile';
import { SubmissionError } from '@/components/form-components/submission-error';
import { waitForPendingValidators } from '@/utils/wait-for-pending-validators';
import { getFirstNonValidInputId } from './get-first-non-valid-input-id';
import { focusOnElementById } from '@/utils/focus-on-element-by-id';
import { scrollToElementById } from '@/utils/scroll-to-element-by-id';
import { FormInvalidError } from '@/utils/form-invalid-error';
import styles from './styles.module.scss';
import { didNotSendOTP } from '@/components/guards/did-not-send-otp';

function SignUp() {
  const signUpForm = useForm(new SignUpForm());
  const { signUpWithEmail } = useContextSafely(UserContext, 'SignUp');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmissionError, setHasSubmissionError] = useState(false);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    setHasSubmissionError(false);
    setIsLoading(true);
    signUpForm.setSubmitted();

    try {
      const formValue = await waitForPendingValidators(signUpForm);
      await signUpWithEmail({ ...formValue, type: UserType.Challenger });
    } catch (e: any) {
      console.log(e.message);

      setIsLoading(false);

      if (e instanceof FormInvalidError) {
        const firstNonValidInputId = getFirstNonValidInputId(signUpForm);
        if (firstNonValidInputId === signUpForm.fields.captchaToken.id) {
          scrollToElementById(firstNonValidInputId);
        } else if (firstNonValidInputId) {
          focusOnElementById(firstNonValidInputId);
        }
      } else {
        setHasSubmissionError(true);
      }
    }
  };

  return (
    <PageContainer>
      {hasSubmissionError && (
        <SubmissionError text="Something went wrong. Please try again." />
      )}
      {isLoading && <LoadingWheel />}
      <form onSubmit={onSubmit} noValidate name="signUpForm">
        <div className={styles.title_and_fields_container}>
          <h1 className={styles.title}>
            <span className="underline">Sign Up</span>
            <br />
            to Start Your
            <br />
            8by8 Journey
          </h1>
          <p className={styles.instruction}>*Required information</p>
          <InputGroup
            type="text"
            field={signUpForm.fields.name}
            labelContent="Name*"
            labelVariant="floating"
            containerClassName={styles.input_group}
            maxLength={255}
            aria-required
          />
          <InputGroup
            type="email"
            field={signUpForm.fields.email}
            labelContent="Email address*"
            labelVariant="floating"
            containerClassName={styles.input_group}
            disabled={isLoading}
            aria-required
            autoComplete="email"
          />
          <InputGroup
            type="email"
            field={signUpForm.fields.confirmEmail}
            groups={[signUpForm.groups.emailGroup]}
            labelContent="Re-enter email address*"
            labelVariant="floating"
            containerClassName={styles.input_group}
            disabled={isLoading}
            aria-required
            autoComplete="email"
          />
        </div>
        <SelectAvatar field={signUpForm.fields.avatar} isLoading={isLoading} />
        <Turnstile field={signUpForm.fields.captchaToken} />
        <div className={styles.tos_agreement_container}>
          <p className={styles.tos_agreement}>
            By clicking on &quot;Sign Up,&quot; I agree to the{' '}
            <Link href="termsofservice" className="link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="privacypolicy" className="link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className={styles.submit_btn_container}>
          <button type="submit" className="btn_gradient btn_lg btn_wide">
            Sign Up
          </button>
        </div>
      </form>
      <div className={styles.sign_in_link_container}>
        <p>
          Already have an account?{' '}
          <Link href="/signin" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}

export default didNotSendOTP(SignUp);
