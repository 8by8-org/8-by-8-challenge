'use client';
import { useState } from 'react';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { LinkButton } from '@/components/utils/link-button';
import { Button } from '@/components/utils/button';
import { hasCompletedAllActions } from '../utils/has-completed-all-actions';
import { TakeTheChallengeModal } from '@/app/actions/take-the-challenge-modal';
import { UserType } from '@/model/enums/user-type';

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
        <TakeTheChallengeModal
          isOpen={modalToShow !== 'none'}
          succeeded={modalToShow === 'success'}
          closeModal={
            modalToShow === 'success' ? () => setModalToShow('none') : () => {}
          }
        />
      </>;
}
