import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { RegistrationCompleted } from './completed';

export default async function Page() {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const voterRegistrationDataRepo = serverContainer.get(
    SERVER_SERVICE_KEYS.VoterRegistrationDataRepository,
  );
  const user = await auth.loadSessionUser();
  const pdfUrl =
    user ? await voterRegistrationDataRepo.getPDFUrlByUserId(user.uid) : '';

  return <RegistrationCompleted pdfUrl={pdfUrl} />;
}
