import { z } from 'zod';

export const requestBodySchema = z.object({
  city: z
    .string({ required_error: 'city not valid' })
    .min(1, 'must be at least 1 char'),
  street: z
    .string({ required_error: 'street not valid' })
    .min(1, 'must be at least 1 char'),
  name_first: z
    .string({ required_error: 'name_first not valid' })
    .min(1, 'must be at least 1 char'),
  name_last: z
    .string({ required_error: 'name_last not valid' })
    .min(1, 'must be at least 1 char'),
  dob: z
    .string({ required_error: 'dob not valid' })
    .min(1, 'must be at least 1 char'),
  zip: z
    .string({ required_error: 'zip not valid' })
    .min(1, 'must be at least 1 char'),
  email: z
    .string({ required_error: 'email not valid' })
    .min(1, 'must be at least 1 char'),
  citizen: z
    .string({ required_error: 'citizen not valid' })
    .min(1, 'must be at least 1 char'),
  party: z
    .string({ required_error: 'party not valid' })
    .min(1, 'must be at least 1 char'),
  name_middle: z
    .string({ required_error: 'party not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  suffix: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  change_of_name: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_title: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_name_first: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_name_middle: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_name_last: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_suffix: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  change_of_address: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_state: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_city: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_street: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_zip: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  prev_unit: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  diff_mail_address: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  mail_state: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  mail_city: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  mail_street: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  mail_zip: z
    .string({ required_error: 'unit not valid' })
    .min(1, 'must be at least 1 char')
    .optional(),
  state: z
    .string({ required_error: 'us_state not valid' })
    .min(2, 'must be at least 2 char'),
  eighteenPlus: z
    .string({ required_error: 'eighteen_plus not valid' })
    .min(1, 'must be at least 1 char'),
  idNumber: z
    .string({ required_error: 'id_number not valid' })
    .min(1, 'must be at least 1 char'),
});
