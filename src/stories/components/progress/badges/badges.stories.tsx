import { Meta, StoryObj } from '@storybook/react';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { NumberBadge } from '@/components/progress/badges/number-badge';
import { ActionBadge } from '@/components/progress/badges/action-badge';
import { PlayerBadge } from '@/components/progress/badges/player-badge';
import { Badges } from '@/components/progress/badges';
import type { Badge } from '@/model/types/badge';
import { Actions } from '@/model/enums/actions';

const meta: Meta<typeof Badges> = {
  component: Badges,
};

export default meta;

type Story = StoryObj<typeof Badges>;

export const SingleNumberBadge: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <NumberBadge index={1} />
      </GlobalStylesProvider>
    );
  },
};

export const SingleActionBadge: Story = {
  render: () => {
    const actionBadge: Badge = { action: Actions.VoterRegistration };
    return (
      <GlobalStylesProvider>
        <ActionBadge badge={actionBadge} index={2} />
      </GlobalStylesProvider>
    );
  },
};

export const SinglePlayerBadge: Story = {
  render: () => {
    const playerBadge: Badge = { playerName: 'Player', playerAvatar: '1' };
    return (
      <GlobalStylesProvider>
        <PlayerBadge badge={playerBadge} index={3} />
      </GlobalStylesProvider>
    );
  },
};

export const AllBadgeTypes: Story = {
  render: () => {
    const badges: Badge[] = [
      { action: Actions.VoterRegistration },
      { action: Actions.SharedChallenge },
      { action: Actions.ElectionReminders },
      { playerName: 'Player', playerAvatar: '1' },
    ];
    return (
      <GlobalStylesProvider>
        <Badges badges={badges} />
      </GlobalStylesProvider>
    );
  },
};
