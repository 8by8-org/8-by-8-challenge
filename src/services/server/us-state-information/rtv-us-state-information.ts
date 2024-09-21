import { inject } from 'undecorated-di';
import { moveToEnd } from '@/stories/components/utils/move-to-end';
import type { USStateInformation } from './us-state-information';
import type { PoliticalPartiesAndRaceOptions } from '@/model/types/political-parties-and-race-options';

export const RockTheVoteUSStateInformation = inject(
  class RockTheVoteUSStateInformation implements USStateInformation {
    private readonly API_URL =
      'https://register.rockthevote.com/api/v4/state_requirements.json?lang=en&home_state_id=';

    private readonly INDEPEDENT_PARTIES = {
      INDEPENDENT: 'Independent',
      UNENROLLED: 'Unenrolled',
    };

    async getPoliticalPartiesAndRaceOptions(
      state: string,
    ): Promise<PoliticalPartiesAndRaceOptions> {
      try {
        const response = await fetch(this.API_URL + state);
        const body = await response.json();

        if (
          'party_list' in body &&
          'no_party_msg' in body &&
          'race_list' in body
        ) {
          return {
            politicalParties: this.formatPoliticalParties(
              body.party_list,
              body.no_party_msg,
            ),
            raceOptions: body.race_list,
          };
        }
      } catch (e) {
        console.error(e);
      }

      return {
        politicalParties: [],
        raceOptions: [],
      };
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
