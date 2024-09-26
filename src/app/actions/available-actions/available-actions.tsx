'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { Button } from '@/components/utils/button';
import { hasCompletedAllActions } from '../utils/has-completed-all-actions';
import styles from './styles.module.scss';

export function AvailableActions() {
  const { user } = useContextSafely(UserContext, 'AvailableActions');

  return hasCompletedAllActions(user) ?
      <div>
        <Button size="lg" wide>
          See Your Challenge
        </Button>
        <Button variant="inverted" size="lg" wide>
          Share About Your Actions
        </Button>
      </div>
    : <div></div>;
}
