type MethodKeys<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function saveActualImplementation<
  T extends object,
  K extends MethodKeys<T>,
>(object: T, methodName: K) {
  const method = object[methodName] as (...args: any[]) => any;

  return function (...args: any[]) {
    return method.call(object, ...args);
  } as T[K];
}
