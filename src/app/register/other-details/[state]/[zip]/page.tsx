import { OtherDetailsFormComponent } from './other-info-form-component';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

interface OtherDetailsProps {
  params: {
    state: string;
    zip: string;
  };
}

export function OtherDetails({ params }: OtherDetailsProps) {
  // fetch data by state and zip
  console.log(params.state);
  console.log(params.zip);

  const politicalParties = ['Democratic', 'Republican', 'Green', 'Libertarian'];

  return <OtherDetailsFormComponent politicalParties={politicalParties} />;
}
