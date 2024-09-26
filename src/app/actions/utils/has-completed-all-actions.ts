import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';

export function hasCompletedAllActions(user: User | null) {
  return (
    user &&
    user.type === UserType.Hybrid &&
    user.completedActions.electionReminders &&
    user.completedActions.registerToVote
  );
}
