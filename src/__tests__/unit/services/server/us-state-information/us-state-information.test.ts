import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

describe('USStateInformation', () => {
  const usStateInfo = serverContainer.get(
    SERVER_SERVICE_KEYS.USStateInformation,
  );

  it(`returns an object containing a list of political parties, race options, 
  and an id number message.`, async () => {
    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails(
      US_STATE_ABBREVIATIONS.ALABAMA,
    );

    expect(Array.isArray(result.politicalParties)).toBe(true);
    expect(result.politicalParties.length).toBeGreaterThan(0);
    expect(
      result.politicalParties.every(party => typeof party === 'string'),
    ).toBe(true);

    expect(Array.isArray(result.raceOptions)).toBe(true);
    expect(result.raceOptions.length).toBeGreaterThan(0);
    expect(result.raceOptions.every(party => typeof party === 'string')).toBe(
      true,
    );

    expect(result.idNumberMessage).toEqual(expect.stringMatching(/.+/));
  });

  it(`returns an object containing empty arrays and an empty id number message 
  if the provided state is one of ND, NH, or WY.`, async () => {
    const states = [
      US_STATE_ABBREVIATIONS.NORTH_DAKOTA,
      US_STATE_ABBREVIATIONS.NEW_HAMPSHIRE,
      US_STATE_ABBREVIATIONS.WYOMING,
    ];

    for (const state of states) {
      const result =
        await usStateInfo.getPoliticalPartiesAndOtherDetails(state);

      expect(Array.isArray(result.politicalParties)).toBe(true);
      expect(result.politicalParties).toHaveLength(0);

      expect(Array.isArray(result.raceOptions)).toBe(true);
      expect(result.raceOptions).toHaveLength(0);

      expect(result.idNumberMessage).toHaveLength(0);
    }
  });

  it(`moves the 'Independent' option to the end if it is present in the list of 
  political parties returned by the fetch call.`, async () => {
    const fetchResponse = {
      party_list: ['Independent', 'Democrat', 'Republican', 'Green'],
      no_party_msg: '',
      race_list: [],
      id_number_msg: '',
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify(fetchResponse), { status: 200 }),
        );
      });

    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails('');
    expect(result.politicalParties).toStrictEqual([
      'Democrat',
      'Republican',
      'Green',
      'Independent',
    ]);

    fetchSpy.mockRestore();
  });

  it(`moves the 'Unenrolled' option to the end if it is present in the list of 
  political parties returned by the fetch call.`, async () => {
    const fetchResponse = {
      party_list: ['Unenrolled', 'Democrat', 'Republican', 'Green'],
      no_party_msg: '',
      race_list: [],
      id_number_msg: '',
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify(fetchResponse), { status: 200 }),
        );
      });

    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails('');
    expect(result.politicalParties).toStrictEqual([
      'Democrat',
      'Republican',
      'Green',
      'Unenrolled',
    ]);

    fetchSpy.mockRestore();
  });

  it(`moves the 'Independent' option to the penultimate spot and the 'Other' 
  option to the last spot of the list of political parties if both are present 
  in the list of political parties returned by the fetch call.`, async () => {
    const fetchResponse = {
      party_list: ['Other', 'Independent', 'Democrat', 'Republican', 'Green'],
      no_party_msg: '',
      race_list: [],
      id_number_msg: '',
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify(fetchResponse), { status: 200 }),
        );
      });

    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails('');
    expect(result.politicalParties).toStrictEqual([
      'Democrat',
      'Republican',
      'Green',
      'Independent',
      'Other',
    ]);

    fetchSpy.mockRestore();
  });

  it(`moves the 'Unenrolled' option to the penultimate spot and the 'Other' 
  option to the last spot of the list of political parties if both are present 
  in the list of political parties returned by the fetch call.`, async () => {
    const fetchResponse = {
      party_list: ['Other', 'Unenrolled', 'Democrat', 'Republican', 'Green'],
      no_party_msg: '',
      race_list: [],
      id_number_msg: '',
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify(fetchResponse), { status: 200 }),
        );
      });

    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails('');
    expect(result.politicalParties).toStrictEqual([
      'Democrat',
      'Republican',
      'Green',
      'Unenrolled',
      'Other',
    ]);

    fetchSpy.mockRestore();
  });

  it(`appends the no_party_msg returned by the fetch call to the list of 
  political parties if that list does not already include 'Independent' or 
  'Unenrolled.'`, async () => {
    const fetchResponse = {
      party_list: ['Democrat', 'Republican', 'Green'],
      no_party_msg: 'None',
      race_list: [],
      id_number_msg: '',
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify(fetchResponse), { status: 200 }),
        );
      });

    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails('');
    expect(result.politicalParties).toStrictEqual([
      'Democrat',
      'Republican',
      'Green',
      'None',
    ]);

    fetchSpy.mockRestore();
  });

  it(`moves the 'Other' option to the end after appending the no_party_message 
  to the list of political parties if neither 'Independent' nor 'Unenrolled
  are returned by the fetch call but 'Other' is.`, async () => {
    const fetchResponse = {
      party_list: ['Other', 'Democrat', 'Republican', 'Green'],
      no_party_msg: 'None',
      race_list: [],
      id_number_msg: '',
    };

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify(fetchResponse), { status: 200 }),
        );
      });

    const result = await usStateInfo.getPoliticalPartiesAndOtherDetails('');
    expect(result.politicalParties).toStrictEqual([
      'Democrat',
      'Republican',
      'Green',
      'None',
      'Other',
    ]);

    fetchSpy.mockRestore();
  });
});
