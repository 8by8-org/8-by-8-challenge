import { CompletedReminders } from './completed-reminders';

interface CompletedRemindersPageProps {
  searchParams: {
    hasError?: string;
  };
}

export default function CompletedRemindersPage({
  searchParams,
}: CompletedRemindersPageProps) {
  return <CompletedReminders hasError={searchParams.hasError === 'true'} />;
}
