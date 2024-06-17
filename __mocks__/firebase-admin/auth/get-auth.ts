interface UserRecord {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
}

let users: UserRecord[] = [];

/**
 * A mock implementation of getAuth() that returns an object with methods
 * for creating and retrieving users. The auth db can be reset by calling
 * `resetAuth()` between each test.
 *
 * @remarks
 * Only methods/properties relevant to service classes and their corresponding
 * test suites have been mocked. If it becomes necessary to access additional
 * methods/properties, they should be added to the object returned by this
 * function.
 */
export const getAuth = jest.fn().mockImplementation(() => {
  return {
    createUser: jest
      .fn()
      .mockImplementation((properties: Omit<UserRecord, 'uid'>) => {
        return new Promise((resolve, reject) => {
          if (users.find(user => user.email === properties.email)) {
            reject(
              new Error(`User with email ${properties.email} already exists.`),
            );
          }

          users.push({
            uid: `${users.length}`,
            ...properties,
          });

          resolve(users.at(-1));
        });
      }),
    getUser: jest.fn().mockImplementation((uid: string) => {
      return new Promise<UserRecord>((resolve, reject) => {
        const user = users.find(user => user.uid === uid);

        if (!user) {
          reject(new Error(`User with uid ${uid} does not exist.`));
        } else {
          resolve(user);
        }
      });
    }),
    getUserByEmail: jest.fn().mockImplementation((email: string) => {
      return new Promise<UserRecord>((resolve, reject) => {
        const user = users.find(user => user.email === email);

        if (!user) {
          reject(new Error(`User with eamil ${email} does not exist.`));
        } else {
          resolve(user);
        }
      });
    }),
  };
});

/**
 * A function that can be imported into test suites in order to reset the
 * auth database between tests. Resetting the database between tests prevents
 * temporal coupling between tests.
 */
export function resetAuth() {
  users = [];
}
