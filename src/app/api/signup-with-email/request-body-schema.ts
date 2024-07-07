import { z } from 'zod';
import { EmailRegExp } from 'fully-formed';
import { UserType } from '@/model/enums/user-type';

export const requestBodySchema = z.object({
  email: z.string().regex(new EmailRegExp()),
  name: z.string().min(1).max(255),
  avatar: z.enum(['0', '1', '2', '3']),
  type: z.nativeEnum(UserType),
  captchaToken: z.string(),
});
