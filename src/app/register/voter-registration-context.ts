'use client';
import { createNamedContext } from '@/hooks/create-named-context';
import { VoterRegistrationForm } from './voter-registration-form';

type VoterRegistrationContextType = {
  voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
};

export const VoterRegistrationContext =
  createNamedContext<VoterRegistrationContextType>('VoterRegistrationContext');
