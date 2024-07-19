'use client';
import { useContextSafely } from '../../../../hooks/use-context-safely';
import { UserContext } from '../../../../contexts/user-context/user-context';
import { UserType } from '../../../../model/enums/user-type';
import { ChallengerLinks } from './challenger-links';
import { HybridLinks } from './hybrid-links';
import { PlayerLinks } from './player-links';
import { SignedOutLinks } from './signed-out-links';

export function Links() {
  const { user } = useContextSafely(UserContext, 'Links');

  if (user) {
    switch (user.type) {
      case UserType.Player:
        return <PlayerLinks />;
      case UserType.Challenger:
        return <ChallengerLinks />;
      case UserType.Hybrid:
        return <HybridLinks />;
    }
  } else {
    return <SignedOutLinks />;
  }
}
