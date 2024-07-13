import { User } from '@/model/types/user';

export interface IUserRecordParser {
  parseUserRecord(dbUser: object): User;
}
