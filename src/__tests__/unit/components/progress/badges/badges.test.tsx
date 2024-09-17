import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { Badges } from '@/components/progress/badges';
import { Actions } from '@/model/enums/actions';
import { AVATARS } from '@/constants/avatars';
import type { Badge } from '@/model/types/badge';
import type { PlayerBadge } from '@/model/types/player-badge';

describe('Bagdes', () => {
  afterEach(cleanup);

  it('renders action badges.', () => {
    const actionBadges = [
      {
        action: Actions.SharedChallenge,
      },
      {
        action: Actions.RegisterToVote,
      },
      {
        action: Actions.ElectionReminders,
      },
    ];

    render(<Badges badges={actionBadges} />);

    const actionBadgeTextContent = [
      'You Shared',
      'You Registered',
      'Got Alerts',
    ];

    actionBadgeTextContent.forEach(badgeText => {
      expect(screen.queryByText(badgeText)).toBeInTheDocument();
    });
  });

  it('renders player badges.', () => {
    const playerBadges: PlayerBadge[] = [
      {
        playerName: 'Bob',
        playerAvatar: '0',
      },
      {
        playerName: 'Sue',
        playerAvatar: '1',
      },
      {
        playerName: 'Jack',
        playerAvatar: '2',
      },
      {
        playerName: 'Mary',
        playerAvatar: '3',
      },
    ];

    render(<Badges badges={playerBadges} />);

    playerBadges.forEach(badge => {
      expect(screen.queryByText(badge.playerName)).toBeInTheDocument();
      expect(
        screen.queryByAltText(AVATARS[badge.playerAvatar].altText),
      ).toBeInTheDocument();
    });
  });

  it(`renders up to 8 badge placeholders when the number of badges it receives
  is fewer than 8.`, () => {
    const maxBadgeCount = 8;
    const badges: Badge[] = [];

    while (badges.length < maxBadgeCount) {
      render(<Badges badges={badges} />);

      const firstEmptyBadgeNumber = badges.length + 1;
      for (let i = firstEmptyBadgeNumber; i <= maxBadgeCount; i++) {
        expect(screen.queryByText(i)).toBeInTheDocument();
      }

      const firstUnusedNumber = badges.length;
      for (let i = 1; i <= firstUnusedNumber; i++) {
        expect(screen.queryByText(i)).not.toBeInTheDocument();
      }

      cleanup();

      badges.push({
        playerName: '',
        playerAvatar: '0',
      });
    }
  });

  it(`renders a maximum of 8 badges even if the array of badges it receives
  contains more.`, () => {
    const badges: Badge[] = [];
    const playerName = 'test';

    for (let i = 0; i < 30; i++) {
      badges.push({
        playerName,
        playerAvatar: '0',
      });
    }

    render(<Badges badges={badges} />);
    const renderedBadges = screen.getAllByText(playerName);
    expect(renderedBadges.length).toBe(8);
  });
});
