import { OtherDetails } from './other-details';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

interface OtherDetailsProps {
  searchParams: {
    state?: string;
    zip?: string;
  };
}

export default async function OtherDetailsPage({
  searchParams,
}: OtherDetailsProps) {
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
