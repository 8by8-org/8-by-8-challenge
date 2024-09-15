import type { User } from '@/model/types/user';
import type { Badge } from '@/model/types/badge';

/**
 * Provides methods for retrieving user information from a database.
 */
export interface UserRepository {
  getUserById(userId: string): Promise<User | null>;
  awardAndUpdateVoterRegistrationBadgeAndAction(user: User): Promise<void>;
}
