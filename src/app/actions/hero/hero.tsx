'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { hasCompletedAllActions } from '../utils/has-completed-all-actions';
import { HasCompletedAllActions } from './has-completed-all-actions';
import { HasIncompleteActions } from './has-incomplete-actions';

export function Hero() {
  const { user } = useContextSafely(UserContext, 'Hero');

  return hasCompletedAllActions(user) ?
    <HasCompletedAllActions />
    : <HasIncompleteActions />;
}
