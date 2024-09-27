'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { LinkButton } from '@/components/utils/link-button';
import { Button } from '@/components/utils/button';
import { hasCompletedAllActions } from '../utils/has-completed-all-actions';
import { Modal } from '@/components/utils/modal';
import { UserType } from '@/model/enums/user-type';
import styles from './styles.module.scss';

export function AvailableActions() {
  const { user, takeTheChallenge } = useContextSafely(
    UserContext,
    'AvailableActions',
  );
  const { showAlert } = useContextSafely(AlertsContext, 'AvailableActions');
  const [modalToShow, setModalToShow] = useState<
    'none' | 'loading' | 'success'
  >('none');

  return hasCompletedAllActions(user) ?
      <>
        <LinkButton href="/progress" size="lg" wide className="mb_md">
          See Your Challenge
        </LinkButton>
        <LinkButton
          href="/share"
          variant="inverted"
          size="lg"
          wide
          className="mb_md"
        >
          Share About Your Actions
        </LinkButton>
      </>
    : <>
        {!user?.completedActions.registerToVote && (
          <LinkButton href="/register" size="lg" wide className="mb_md">
            Register to Vote
          </LinkButton>
        )}
        {!user?.completedActions.electionReminders && (
          <LinkButton
            href="/reminders"
            variant={
              user?.completedActions.registerToVote ? 'gradient' : 'inverted'
            }
            size="lg"
            wide
            className="mb_md"
          >
            Get Election Reminders
          </LinkButton>
        )}
        {user?.type === UserType.Player && (
          <Button
            variant={
              (
                user?.completedActions.registerToVote &&
                user?.completedActions.electionReminders
              ) ?
                'gradient'
              : 'inverted'
            }
            size="lg"
            wide
            type="button"
            className="mb_md"
            onClick={async () => {
              if (modalToShow !== 'none') return;

              setModalToShow('loading');

              try {
                await takeTheChallenge();
                setModalToShow('success');
              } catch (e) {
                setModalToShow('none');
                showAlert(
                  'Oops! Something went wrong. Please try again later.',
                  'error',
                );
              }
            }}
          >
            Take the Challenge
          </Button>
        )}
        <Modal
          ariaLabel={
            modalToShow === 'success' ? 'Challenge started' : (
              'Starting your challenge'
            )
          }
          theme="dark"
          isOpen={modalToShow !== 'none'}
          closeModal={
            modalToShow === 'success' ? () => setModalToShow('none') : () => {}
          }
        >
          {modalToShow === 'success' ?
            <>
              <h3 className={styles.modal_title}>Success!</h3>
              <p>You&apos;ve become an 8by8 Challenger!</p>
              <p>
                See your{' '}
                <Link href="/progress" className="link--teal">
                  progress
                </Link>
              </p>
              <Button
                size="sm"
                type="button"
                className="mt_md"
                onClick={() => setModalToShow('none')}
              >
                Ok, got it!
              </Button>
            </>
          : <p>Starting your challenge...</p>}
        </Modal>
      </>;
}
