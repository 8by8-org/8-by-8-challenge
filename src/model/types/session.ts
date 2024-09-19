import type { User } from './user';
import type { InvitedBy } from './invited-by';

export interface Session {
  user: User | null;
  invitedBy: InvitedBy | null;
}
