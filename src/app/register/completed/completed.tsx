'use client';
import Link from 'next/link';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { Button } from '@/components/utils/button';
import { UserType } from '@/model/enums/user-type';
import styles from './styles.module.scss';

interface RegistrationCompletedProps {
  pdfUrl: string;
}

export function RegistrationCompleted({ pdfUrl }: RegistrationCompletedProps) {
  const { user } = useContextSafely(UserContext, 'RegistrationCompleted');

  return (
    <div>
      <h1 className="mb_md">
        <span className="underline">You complete</span>d
        <br />
        the form!
      </h1>
      <p className="mb_md">
        We emailed you a <strong>Voter Registration PDF Form</strong> that you
        can print out and mail to your state. You can also access it here.
      </p>
      <Button
        size="lg"
        onClick={() => {
          window.open(pdfUrl, '_blank');
        }}
        className={styles.view_pdf_button}
      >
        View PDF
      </Button>
      <p className={styles.reminder}>
        Please remember that the registration process is{' '}
        <strong>not complete</strong> until you have signed and mailed your
        completed form to the government address listed on the form.
      </p>
      <Link
        href={user?.type === UserType.Player ? '/actions' : '/progress'}
        className={styles.link_to_challenge}
      >
        {user?.type === UserType.Player ?
          'Go to actions'
        : 'Go to 8by8 challenge'}
      </Link>
    </div>
  );
}
