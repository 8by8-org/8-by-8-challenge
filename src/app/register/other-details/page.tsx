import dynamic from 'next/dynamic';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

interface OtherDetailsProps {
  searchParams: {
    state?: string;
    zip?: string;
  };
}

/*
  Render the other details form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const OtherDetails = dynamic(
  () => import('./other-details').then(module => module.OtherDetails),
  {
    ssr: false,
  },
);

export default async function Page({ searchParams }: OtherDetailsProps) {
  const USStateInformation = serverContainer.get(
    SERVER_SERVICE_KEYS.USStateInformation,
  );
  const ballotQualifiedPoliticalParties =
    await USStateInformation.getBallotQualifiedPoliticalPartiesByLocation(
      searchParams.state ?? '',
      searchParams.zip ?? '',
    );

  return (
    <OtherDetails
      ballotQualifiedPoliticalParties={ballotQualifiedPoliticalParties}
    />
  );
}
