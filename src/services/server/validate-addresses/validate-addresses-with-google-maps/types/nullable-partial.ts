export type NullablePartial<T extends object> = {
  [K in keyof T]+?: T[K] | null;
};
