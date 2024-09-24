import { z } from 'zod';

const addressSchema = z.object({
  streetLine1: z.string({ required_error: 'streetLine1 is required.' }),
  streetLine2: z.string().optional(),
  city: z.string({ required_error: 'city is required.' }),
  state: z
    .string({ required_error: 'state is required.' })
    .regex(/^[A-Z]{2}$/, 'state must be a 2-letter state abbreviation.'),
  zip: z
    .string({ required_error: 'zip is required.' })
    .regex(/^\d{5}$/, 'zip must be a 5-digit zip code.'),
});

export const requestBodySchema = z.object({
  homeAddress: addressSchema,
  mailingAddress: addressSchema.optional(),
  previousAddress: addressSchema.optional(),
});
