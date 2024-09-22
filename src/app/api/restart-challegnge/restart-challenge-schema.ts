import { z } from 'zod';

export const restartChallengeSchema = z.object({
  userId: z.string().uuid(),
});