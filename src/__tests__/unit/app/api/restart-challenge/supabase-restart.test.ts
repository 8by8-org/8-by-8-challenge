import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';
import { DateTime } from 'luxon';
import { serverContainer } from '@/services/server/container';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { UserRepository } from '@/services/server/user-repository/user-repository';

describe('SupabaseUserRepository.restartChallenge', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it('should return the new challenge end timestamp if the challenge was successfully restarted', async () => {
    const userId = '123e789b-12d3-a456426614174000';
    const newTimestamp = DateTime.now().plus({ days: 8 }).toUnixInteger();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return {
            restartChallenge: jest.fn().mockResolvedValue(newTimestamp),
            getUserById: jest.fn(),
            makeHybrid: jest.fn(),
            awardRegisterToVoteBadge: jest.fn(),
            awardElectionRemindersBadge: jest.fn(),
          } as UserRepository;
        }
        return getActualService(key);
      });

    const userRepository = serverContainer.get(
      SERVER_SERVICE_KEYS.UserRepository,
    ) as UserRepository;
    const result = await userRepository.restartChallenge(userId);

    expect(result).toBe(newTimestamp);

    containerSpy.mockRestore();
  });

  it('should throw a ServerError if the update operation fails', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return {
            restartChallenge: jest
              .fn()
              .mockRejectedValue(
                new ServerError('Failed to update user.', 500),
              ),
            getUserById: jest.fn(),
            makeHybrid: jest.fn(),
            awardRegisterToVoteBadge: jest.fn(),
            awardElectionRemindersBadge: jest.fn(),
          } as UserRepository;
        }
        return getActualService(key);
      });

    const userRepository = serverContainer.get(
      SERVER_SERVICE_KEYS.UserRepository,
    ) as UserRepository;

    await expect(userRepository.restartChallenge(userId)).rejects.toThrow(
      ServerError,
    );

    containerSpy.mockRestore();
  });

  it('should throw a generic error if an unknown error occurs', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return {
            restartChallenge: jest
              .fn()
              .mockRejectedValue(new Error('Unknown error')),
            getUserById: jest.fn(),
            makeHybrid: jest.fn(),
            awardRegisterToVoteBadge: jest.fn(),
            awardElectionRemindersBadge: jest.fn(),
          } as UserRepository;
        }
        return getActualService(key);
      });

    const userRepository = serverContainer.get(
      SERVER_SERVICE_KEYS.UserRepository,
    ) as UserRepository;

    await expect(userRepository.restartChallenge(userId)).rejects.toThrow(
      'Unknown error',
    );

    containerSpy.mockRestore();
  });
});
