import { inject } from 'undecorated-di';
import { moveToEnd } from '@/stories/components/utils/move-to-end';
import type { USStateInformation } from './us-state-information';
import type { PoliticalPartiesAndOtherDetails } from '@/model/types/political-parties-and-other-details';

interface ResponseWithPoliticalPartiesAndOtherDetails {
  party_list: string[];
  no_party_msg: string;
  race_list: string[];
  id_number_msg: string;
}

export const RockTheVoteUSStateInformation = inject(
  class RockTheVoteUSStateInformation implements USStateInformation {
    private readonly API_URL =
      'https://register.rockthevote.com/api/v4/state_requirements.json?lang=en&home_state_id=';

    private readonly INDEPEDENT_PARTIES = {
      INDEPENDENT: 'Independent',
      UNENROLLED: 'Unenrolled',
    };

    async getPoliticalPartiesAndOtherDetails(
      state: string,
    ): Promise<PoliticalPartiesAndOtherDetails> {
      const response = await fetch(this.API_URL + state);
      const body = await response.json();

      if (this.isResponseWithPoliticalPartiesAndOtherDetails(body)) {
        return {
          politicalParties: this.formatPoliticalParties(
            body.party_list,
            body.no_party_msg,
          ),
          raceOptions: body.race_list,
          idNumberMessage: body.id_number_msg,
        };
      }

      return {
        politicalParties: [],
        raceOptions: [],
        idNumberMessage: '',
      };
    }

    private isResponseWithPoliticalPartiesAndOtherDetails(
      body: object,
    ): body is ResponseWithPoliticalPartiesAndOtherDetails {
      return (
        'party_list' in body &&
        Array.isArray(body.party_list) &&
        body.party_list.every(item => typeof item === 'string') &&
        'no_party_msg' in body &&
        typeof body.no_party_msg === 'string' &&
        'race_list' in body &&
        Array.isArray(body.race_list) &&
        body.race_list.every(item => typeof item === 'string') &&
        'id_number_msg' in body &&
        typeof body.id_number_msg === 'string'
      );
    }

    private formatPoliticalParties(
      politicalParties: string[],
      noAffiliationMessage: string,
    ): string[] {
      politicalParties;

      if (politicalParties.includes(this.INDEPEDENT_PARTIES.INDEPENDENT)) {
        politicalParties = moveToEnd(
          politicalParties,
          this.INDEPEDENT_PARTIES.INDEPENDENT,
        );
      } else if (
        politicalParties.includes(this.INDEPEDENT_PARTIES.UNENROLLED)
      ) {
        politicalParties = moveToEnd(
          politicalParties,
          this.INDEPEDENT_PARTIES.UNENROLLED,
        );
      } else {
        politicalParties.push(noAffiliationMessage);
      }

      if (politicalParties.includes('Other')) {
        politicalParties = moveToEnd(politicalParties, 'Other');
      }

      return politicalParties;
    }
  },
  [],
);
