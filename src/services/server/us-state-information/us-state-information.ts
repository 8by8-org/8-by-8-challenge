import type { PoliticalPartiesAndRaceOptions } from '@/model/types/political-parties-and-race-options';

export interface USStateInformation {
  getPoliticalPartiesAndRaceOptions(
    state: string,
  ): Promise<PoliticalPartiesAndRaceOptions>;
}
