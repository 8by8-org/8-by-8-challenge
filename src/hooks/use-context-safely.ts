import { useContext } from 'react';
import { NullContextError } from '../errors/null-context-error';
import type { NamedContext } from './named-context';

/**
 * Calls useContext with the provided Context object and throws an error if the
 * value returned by useContext is null or undefined.
 *
 * @typeParam T - The type of value to be returned by this function.
 *
 * @param context - A {@link NamedContext} object.
 *
 * @returns A value of type T which will not be null or undefined.
 *
 * @throws A {@link NullContextError} if value returned by useContext is null
 * or undefined.
 *
 * @example
 * interface UserContextType {
 *   user : User | null;
 *   signIn : (email : string, password : string) => void;
 *   signOut : () => void;
 * }
 *
 * //Create a named context of this type
 * const UserContext = createNamedContext<UserContextType>('UserContext');
 *
 * //In a component, access that context
 * function ContextConsumer() {
 *   //this will throw an error if the component is rendered outside a context
 *   //provider
 *   const userContext = useContextSafely(UserContext);
 *
 *   //here, we can be sure that the value provided to this component is not null
 *   //or undefined
 *   return (
 *     <button onClick={userContext.signOut()}>Sign Out</button>
 *   );
 * }
 */
export function useContextSafely<T>(
  context: NamedContext<T>,
  consumerName: string,
) {
  const ctx = useContext(context);

  if (ctx === null || ctx === undefined)
    throw new NullContextError(context.displayName, consumerName);

  return ctx as NonNullable<T>;
}
