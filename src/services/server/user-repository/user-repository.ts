import type { User } from '@/model/types/user';
import { DateTime } from 'luxon';
/**
 * Provides methods for retrieving user information from a database.
 */
export interface UserRepository {
  getUserById(userId: string): Promise<User | null>;
  restartChallenge(userId: string): Promise<number>;
}
