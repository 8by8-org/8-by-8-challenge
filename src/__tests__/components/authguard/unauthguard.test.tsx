import '@testing-library/jest-dom';
import {
    render,
    screen,
    cleanup,
    waitFor,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import navigation from 'next/navigation';
import { UnAuthGuard } from "@/components/utils/authguard/unauthguard";
import { User } from '@/model/types/user';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { useState } from 'react';
import { DateTime } from 'luxon';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

describe('Unauthguard', () => {

    let router: AppRouterInstance;

    beforeEach(() => {
        router = Builder<AppRouterInstance>().push(jest.fn()).build();
        jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
    });

    afterEach(cleanup);

    it('renders a child component', () => {
        const userContextValue = Builder<UserContextType>().user(null).build();

        render(
            <UserContext.Provider value={userContextValue}>
                <UnAuthGuard>
                    <div data-testid="test"></div>
                </UnAuthGuard>
            </UserContext.Provider>,
        );
        expect(screen.queryByTestId('test')).toBeInTheDocument();
    })

    it('blocks an inaccesible page if the user is signed in', () => {
        const user: User = {
            uid: '',
            email: '',
            name: '',
            avatar: '2',
            type: UserType.Challenger,
            completedActions: {
                electionReminders: false,
                registerToVote: false,
                sharedChallenge: false,
            },
            badges: [],
            challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
            completedChallenge: false,
            redeemedAward: false,
            contributedTo: [],
            inviteCode: '',
        };
        const userContextValue = Builder<UserContextType>().user(user).build();

        render(
            <UserContext.Provider value={userContextValue}>
                <UnAuthGuard>
                </UnAuthGuard>
            </UserContext.Provider>,
        );
        expect(router.push).toHaveBeenCalled();

    })

    it('allows acces to a page if the user is signed out', () => {
        const userContextValue = Builder<UserContextType>().user(null).build();

        render(
            <UserContext.Provider value={userContextValue}>
                <UnAuthGuard>
                </UnAuthGuard>
            </UserContext.Provider>,
        );
        expect(router.push).not.toHaveBeenCalled();
    })
})