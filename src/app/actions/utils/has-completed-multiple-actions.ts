import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';

export function hasCompletedMultipleActions(user: User | null) {
  let actionsCompleted = 0;

  actionsCompleted += Number(!!user?.completedActions.electionReminders);
  actionsCompleted += Number(!!user?.completedActions.registerToVote);
  actionsCompleted += Number(user?.type === UserType.Hybrid);

  return actionsCompleted > 1;
}
