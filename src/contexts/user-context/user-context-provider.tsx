import 'server-only';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ClientSideUserContextProvider } from './client-side-user-context-provider';
import type { PropsWithChildren } from 'react';

/**
 * A server component that reads user information from cookies and passes
 * said information into a {@link ClientSideUserContextProvider} in order to
 * pre-populate child components with user information, if the user is signed in.
 */
export async function UserContextProvider({ children }: PropsWithChildren) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);
  const user = await auth.loadSessionUser();
  const emailForSignIn = await cookies.loadEmailForSignIn();

  return (
    <ClientSideUserContextProvider user={user} emailForSignIn={emailForSignIn}>
      {children}
    </ClientSideUserContextProvider>
  );
}
