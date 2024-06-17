const apps: Array<unknown> = [];

/**
 * A mock implementation of the Firebase admin module. This mock provides the
 * minimum interface required to test service classes. If additional
 * properties of Firebase admin are accessed, this mock should be modified
 * accordingly.
 */
export const admin = {
  apps,
  initializeApp: jest.fn().mockImplementation(() => {
    apps.push({
      getToken: jest.fn(),
      getCachedToken: jest.fn(),
      addAuthTokenListener: jest.fn(),
      removeAuthTokenListener: jest.fn(),
    });
  }),
  credential: {
    cert: jest.fn().mockImplementation(() => ({
      getAccessToken: jest.fn(),
    })),
  },
};
