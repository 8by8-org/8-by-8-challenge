import { inject } from 'undecorated-di';
import { rockTheVoteStateRequirementsResponseSchema } from './rtv-state-requirements-response-schema';
import { ServerError } from '@/errors/server-error';
import type { USStateInformation } from './us-state-information';
import type { USStateVotingInformation } from '@/model/types/us-state-voting-information';

export const RockTheVoteUSStateInformation = inject(
  class RockTheVoteUSStateInformation implements USStateInformation {
    private readonly API_URL =
      'https://register.rockthevote.com/api/v4/state_requirements.json?lang=en&home_state_id=';

    async getStateVotingInformation(
      state: string,
    ): Promise<USStateVotingInformation> {
      // need sensible defaults
      if (state === 'ND') {
        return {
          politicalParties: [],
          raceList: [
            'Asian',
            'Black or African American',
            'Hispanic or Latino',
            'Native American or Alaskan Native',
            'Native Hawaiian or Other Pacific Islander',
            'Other',
            'Two or More Races',
            'White',
            'Decline to state',
          ],
          idMessage: '',
        };
      }

      // graceful error handling?
      const response = await fetch(this.API_URL + state);

      if (!response.ok) {
        throw new ServerError(
          'There was a problem fetching the state requirements.',
          500,
        );
      }

      const responseBody = await response.json();
      const parsed =
        rockTheVoteStateRequirementsResponseSchema.parse(responseBody);

      const stateVotingInfo: USStateVotingInformation = {
        politicalParties:
          parsed.party_list.includes('Independent') ?
            parsed.party_list
          : [...parsed.party_list, parsed.no_party_msg],
        raceList: parsed.race_list,
        idMessage: parsed.id_number_msg,
      };

      return stateVotingInfo;
    }
  },
  [],
);
