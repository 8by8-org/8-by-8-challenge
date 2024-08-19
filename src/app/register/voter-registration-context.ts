'use client';
import { createNamedContext } from '@/hooks/functions/create-named-context';
import { VoterRegistrationForm } from './voter-registration-form';

type VoterRegistrationContextType = {
  voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
};

export const VoterRegistrationContext =
  createNamedContext<VoterRegistrationContextType>('VoterRegistrationContext');
