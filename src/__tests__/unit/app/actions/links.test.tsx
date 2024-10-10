import { Links } from '@/app/actions/links';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import { Builder } from 'builder-pattern';
import { createId } from '@paralleldrive/cuid2';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('Links', () => {
  afterEach(cleanup);

  it(`returns null if the user has completed all actions that would award an 
  inviting challenger a badge.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Hybrid)
      .completedActions({
        registerToVote: true,
        electionReminders: true,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <div data-testid="container">
          <Links />
        </div>
      </UserContext.Provider>,
    );

    const container = screen.getByTestId('container');
    expect(container.childNodes).toHaveLength(0);
  });

  it(`renders the text 'Thanks for your actions!' and 'Share about your actions'
  when the user has completed multiple actions and the inviting challenger is 
  also the challenger that the user last contributed to.`, async () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Player)
      .completedActions({
        registerToVote: true,
        electionReminders: true,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Links />
      </UserContext.Provider>,
    );

    expect(screen.queryByText(/thanks for your actions!/i)).toBeInTheDocument();
    expect(screen.queryByText(/share about your actions/i)).toBeInTheDocument();
  });

  it(`renders the text 'Thanks for getting election reminders!' and 
  'Share about your action' when getting election reminders is the only action 
  the user has taken and the inviting challenger is also the challenger that the 
  user last contributed to.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Player)
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Links />
      </UserContext.Provider>,
    );

    expect(
      screen.queryByText(/thanks for getting election reminders!/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/^share about your action$/i),
    ).toBeInTheDocument();
  });

  it(`renders the text 'Thanks for registering to vote!' and 
  'Share about your action' when registering to vote is the only action 
  the user has taken and the inviting challenger is also the challenger that the 
  user last contributed to.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Player)
      .completedActions({
        registerToVote: true,
        electionReminders: false,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Links />
      </UserContext.Provider>,
    );

    expect(
      screen.queryByText(/thanks for registering to vote!/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/^share about your action$/i),
    ).toBeInTheDocument();
  });

  it(`renders the text 'Thanks for taking the challenge!' when taking the 
  challenge is the only action the user has taken and the inviting challenger is 
  also the challenger that the user last contributed to.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Hybrid)
      .completedActions({
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Links />
      </UserContext.Provider>,
    );

    expect(
      screen.queryByText(/thanks for taking the challenge!/i),
    ).toBeInTheDocument();
  });

  it(`renders the text 'Here for something else?' if the user was not invited 
  by the last challenger they contributed to, but they have taken the 
  challenge.`, () => {
    const challengerA: ChallengerData = {
      challengerName: 'Challenger A',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerB: ChallengerData = {
      challengerName: 'Challenger B',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const user = Builder<User>()
      .type(UserType.Hybrid)
      .completedActions({
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      })
      .contributedTo([challengerA])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challengerB)
          .build()}
      >
        <Links />
      </UserContext.Provider>,
    );

    expect(
      screen.queryByText(/here for something else\?/i),
    ).toBeInTheDocument();
  });

  it(`renders the text 'See your progress' if the user has taken the challenge 
  but has at least one incomplete action.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Hybrid)
      .completedActions({
        registerToVote: true,
        electionReminders: false,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Links />
      </UserContext.Provider>,
    );

    expect(screen.queryByText(/see your progress/i)).toBeInTheDocument();
  });
});
