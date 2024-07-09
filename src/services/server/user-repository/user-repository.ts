import type { User } from '@/model/types/user';

export interface UserRepository {
  getUserById(userId: string): Promise<User | null>;
}
