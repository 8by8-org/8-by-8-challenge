import { z } from 'zod';

export const rockTheVoteStateRequirementsResponseSchema = z.object({
  no_party_msg: z.string({ required_error: 'no_party_msg is required.' }),
  party_list: z.array(z.string()),
  race_list: z.array(z.string()),
  id_number_msg: z.string({ required_error: 'id_number_msg is required.' }),
});
