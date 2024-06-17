interface Doc {
  exists: boolean;
  data(): object | undefined;
}

interface DocRef {
  set(properties: object): void;
  get(): Promise<Doc>;
}

interface Collection {
  doc(id: string): DocRef;
}

let firestore: Record<string, Collection> = {};

/**
 * A mock implementation of getFirestore() that stores data in memory. The
 * database can be reset by calling `resetFirestore()` between tests.
 *
 * @remarks
 * Only methods/properties relevant to service classes and their corresponding
 * test suites have been mocked. If it becomes necessary to access additional
 * methods/properties, they should be added to the object returned by this
 * function.
 */
export const getFirestore = jest.fn().mockImplementation(() => {
  return {
    collection: jest.fn().mockImplementation((collectionName: string) => {
      if (!(collectionName in firestore)) {
        const data: Record<string, object> = {};
        const collection: Collection = {
          doc: (id: string): DocRef => ({
            set: (properties: object) => {
              data[id] = properties;
            },
            get: () => {
              return Promise.resolve({
                exists: id in data,
                data: () => {
                  return data[id];
                },
              });
            },
          }),
        };

        firestore[collectionName] = collection;
      }

      return firestore[collectionName];
    }),
  };
});

/**
 * A function that can be imported into test suites in order to reset the
 * firestore database between tests. Resetting the database between tests
 * prevents temporal coupling between tests.
 */
export function resetFirestore() {
  firestore = {};
}
