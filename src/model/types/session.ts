import type { User } from './user';
import type { ChallengerData } from './challenger-data';

export interface Session {
  user: User | null;
  invitedBy: ChallengerData | null;
}
