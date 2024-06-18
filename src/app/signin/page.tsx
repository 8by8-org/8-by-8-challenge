'use client';
import { useState, type FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ValidityUtils } from 'fully-formed';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { useForm } from 'fully-formed';
import { SignInForm } from './signin-form';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { Turnstile } from '@/components/form-components/turnstile';
import { SubmissionError } from '@/components/form-components/submission-error';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { waitForPendingValidators } from '@/utils/wait-for-pending-validators';
import { scrollToElementById } from '@/utils/scroll-to-element-by-id';
import { focusOnElementById } from '@/utils/focus-on-element-by-id';
import { FormInvalidError } from '@/utils/form-invalid-error';
import styles from './styles.module.scss';

export default function SignIn() {
  const signInForm = useForm(new SignInForm());
  const { signInWithEmail } = useContextSafely(UserContext, 'SignIn');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmissionError, setHasSubmissionError] = useState(false);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    setHasSubmissionError(false);
    setIsLoading(true);
    signInForm.setSubmitted();

    try {
      const { email } = await waitForPendingValidators(signInForm);
      await signInWithEmail(email);
    } catch (e) {
      setIsLoading(false);

      if (e instanceof FormInvalidError) {
        if (!ValidityUtils.isValid(signInForm.fields.email)) {
          focusOnElementById(signInForm.fields.email.id);
        } else {
          scrollToElementById(signInForm.fields.captchaToken.id);
        }
      } else {
        setHasSubmissionError(true);
      }
    }
  };

  return (
    <PageContainer>
      <form onSubmit={onSubmit} noValidate name="signInForm">
        {hasSubmissionError && (
          <SubmissionError text="Something went wrong. Please try again." />
        )}
        {isLoading && <LoadingWheel />}
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
          <InputGroup
            field={signInForm.fields.email}
            type="email"
            labelVariant="floating"
            labelContent="Email address*"
            containerClassName={styles.input_group}
          />
          <Turnstile field={signInForm.fields.captchaToken} />
        </div>
        <div className={styles.submit_btn_container}>
          <button type="submit" className="btn_gradient btn_lg btn_wide">
            Sign in
          </button>
        </div>
      </form>
      <div className={styles.sign_up_link_container}>
        <p>
          New to 8by8?{' '}
          <Link href="/signup" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
