import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

describe('USStateInformation', () => {
  const usStateInfo = serverContainer.get(
    SERVER_SERVICE_KEYS.USStateInformation,
  );

  it(`returns a lits of ballot-qualified political parties when it receives a 
  valid US state and zip.`, async () => {
    const statesWithZipCodes = [
      ['AL', '35203'],
      ['AK', '99501'],
      ['AZ', '85001'],
      ['AR', '72201'],
      ['CA', '90001'],
      ['CO', '80201'],
      ['CT', '06101'],
      ['DE', '19901'],
      ['FL', '33101'],
      ['GA', '30301'],
      ['HI', '96801'],
      ['ID', '83701'],
      ['IL', '60601'],
      ['IN', '46201'],
      ['IA', '50301'],
      ['KS', '66101'],
      ['KY', '40201'],
      ['LA', '70112'],
      ['ME', '04101'],
      ['MD', '21201'],
      ['MA', '02101'],
      ['MI', '48201'],
      ['MN', '55101'],
      ['MS', '39201'],
      ['MO', '63101'],
      ['MT', '59001'],
      ['NE', '68101'],
      ['NV', '89501'],
      ['NH', '03301'],
      ['NJ', '07001'],
      ['NM', '87501'],
      ['NY', '10001'],
      ['NC', '27501'],
      ['ND', '58102'],
      ['OH', '44101'],
      ['OK', '73101'],
      ['OR', '97201'],
      ['PA', '19101'],
      ['RI', '02901'],
      ['SC', '29201'],
      ['SD', '57101'],
      ['TN', '37201'],
      ['TX', '73301'],
      ['UT', '84101'],
      ['VT', '05601'],
      ['VA', '23218'],
      ['WA', '98001'],
      ['WV', '25301'],
      ['WI', '53201'],
      ['WY', '82001'],
    ];

    for (const [state, zip] of statesWithZipCodes) {
      const politicalParties =
        await usStateInfo.getBallotQualifiedPoliticalPartiesByLocation(
          state,
          zip,
        );
      expect(politicalParties.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns an empty array when it receives non US-states/zips', async () => {
    const canadianProvincesAndPostalCodes = [
      ['QC', 'G0A 1H0'],
      ['ON', 'POL'],
      ['SK', 'S4N 4H4'],
    ];

    for (const [province, postalCode] of canadianProvincesAndPostalCodes) {
      const politicalParties =
        await usStateInfo.getBallotQualifiedPoliticalPartiesByLocation(
          province,
          postalCode,
        );
      expect(politicalParties).toStrictEqual([]);
    }
  });
});
