export interface USStateInformation {
  getBallotQualifiedPoliticalPartiesByLocation(
    state: string,
    zip: string,
  ): Promise<string[]>;
}
