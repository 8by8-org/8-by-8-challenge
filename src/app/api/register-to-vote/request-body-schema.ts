import { z } from 'zod';

const nameSchema = z.object({
  title: z.string(),
  first: z.string(),
  middle: z.string().optional(),
  last: z.string(),
  suffix: z.string().optional(),
});

const addressSchema = z.object({
  streetLine1: z.string(),
  streetLine2: z.string().optional(),
  city: z.string(),
  zip: z.string(),
  state: z.string(),
});

const homeAddressSchema = addressSchema.extend({
  phone: z.string(),
  phoneType: z.string(),
});

export const requestBodySchema = z.object({
  eligibility: z.object({
    email: z.string(),
    zip: z.string(),
    dob: z.string(),
    eighteenPlus: z.boolean(),
    isCitizen: z.boolean(),
    firstTimeRegistrant: z.boolean(),
  }),
  names: z.object({
    yourName: nameSchema,
    previousName: nameSchema.optional(),
  }),
  addresses: z.object({
    homeAddress: homeAddressSchema,
    mailingAddress: addressSchema.optional(),
    previousAddress: addressSchema.optional(),
  }),
  otherDetails: z.object({
    party: z.string(),
    race: z.string(),
    hasStateLicenseOrID: z.boolean(),
    idNumber: z.string(),
    receiveEmailsFromRTV: z.boolean(),
    receiveSMSFromRTV: z.boolean(),
  }),
});
