import { z } from 'zod';

export const RTVResponseBodySchema = z.object({
  pdfurl: z.string(),
  uid: z.string(),
});
