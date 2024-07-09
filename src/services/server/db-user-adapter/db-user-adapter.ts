import { User } from '@/model/types/user';

export interface DBUserAdapter {
  adaptDBUser(dbUser: object): User;
}
