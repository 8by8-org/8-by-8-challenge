import { User } from '@/model/types/user';

/**
 * Parses a user record as returned from the database into a format that can
 * be consumed by frontend code, i.e. a {@link User}.
 */
export interface IUserRecordParser {
  parseUserRecord(dbUser: object): User;
}
