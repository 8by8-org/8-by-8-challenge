import { z } from 'zod';
import { EmailRegExp } from 'fully-formed';

export const requestBodySchema = z.object({
  email: z.string().regex(new EmailRegExp()),
});
