import { OtherInfoFormComponent } from './other-info-form-component';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

interface OtherInfoProps {
  params: {
    state: string;
    zip: string;
  };
}

export function OtherInfo({ params }: OtherInfoProps) {
  // fetch data by state and zip
  console.log(params.state);
  console.log(params.zip);

  const politicalParties = ['Democratic', 'Republican', 'Green', 'Libertarian'];

  return <OtherInfoFormComponent politicalParties={politicalParties} />;
}
