import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { Badges } from '@/components/progress/badges';
import type { Badge } from '@/model/types/badge';
import { Actions } from '@/model/enums/actions';

describe('Bagdes', () => {
  afterEach(cleanup);

  it('does not modify the original badges array.', () => {
    const badges: Badge[] = [
      { action: Actions.VoterRegistration },
      { action: Actions.SharedChallenge },
      { playerName: 'test', playerAvatar: '1' },
    ];
    render(<Badges badges={badges} />);

    expect(badges).toHaveLength(3);
  });

  it('does not modify the original badges array', () => {
    const badges: Badge[] = [
      { action: Actions.VoterRegistration },
      { action: Actions.SharedChallenge },
      { playerName: 'test', playerAvatar: '1' },
      { playerName: 'test1', playerAvatar: '1' },
      { playerName: 'test2', playerAvatar: '1' },
      { playerName: 'test3', playerAvatar: '1' },
      { playerName: 'test4', playerAvatar: '1' },
      { playerName: 'test5', playerAvatar: '1' },
      { playerName: 'test6', playerAvatar: '1' },
      { playerName: 'test7', playerAvatar: '1' },
    ];
    render(<Badges badges={badges} />);

    expect(badges).toHaveLength(10);
  });
});
