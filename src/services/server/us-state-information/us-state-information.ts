import type { PoliticalPartiesAndOtherDetails } from '@/model/types/political-parties-and-other-details';
export interface USStateInformation {
  getPoliticalPartiesAndOtherDetails(
    state: string,
  ): Promise<PoliticalPartiesAndOtherDetails>;
}
