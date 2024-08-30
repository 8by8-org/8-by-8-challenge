import 'server-only';
import { inject } from 'undecorated-di';
import { MockData } from './mock-data';
import type { USStateInformation } from './us-state-information';

/**
 * An implementation of USStateInformation that provides state-specific
 * information sourced from mock data. Can be used to approximate the
 * values returned by the RTV Rock API /state_requirements endpoint until
 * such time as we are able to integrate it.
 */
export const MockUSStateInformation = inject(
  class MockUSStateInformation implements USStateInformation {
    getBallotQualifiedPoliticalPartiesByLocation(
      state: string,
      zip: string,
    ): Promise<string[]> {
      if (!(state in MockData)) {
        return Promise.resolve([]);
      }

      return Promise.resolve(MockData[state]);
    }
  },
  [],
);
