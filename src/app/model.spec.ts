import { allSettled, fork } from 'effector';

import { signInModel } from '~/features/auth/sign-in';
import { $launchParams } from '~/shared/lib/tma';
import { routes } from '~/shared/routing';
import { sessionRequestQuery } from '~/shared/session';

import './model';

describe('App Initialization', () => {
  it('Should try to signIn if retrieve session is failed', async () => {
    const sessionRequestMock = vitest.fn();
    const signInRequestMock = vitest.fn();
    const scope = fork({
      handlers: [
        [sessionRequestQuery.__.executeFx, sessionRequestMock],
        [signInModel.signInTelegramMutation.__.executeFx, signInRequestMock],
      ],
      values: [[$launchParams, { initDataRaw: 'initDataRaw' }]],
    });

    sessionRequestMock.mockRejectedValue(undefined);
    signInRequestMock.mockResolvedValue({ status: 'success' });

    await allSettled(sessionRequestQuery.start, { scope });

    expect.soft(signInRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: 'tma initDataRaw',
        }),
      }),
    );

    expect(sessionRequestMock).toHaveBeenCalledTimes(2);
  });

  it('Should redirect to signUp page if status "needSignUp"', async () => {
    const sessionRequestMock = vitest.fn();
    const signInRequestMock = vitest.fn();
    const routeOpenedMock = vitest.fn();

    const scope = fork({
      handlers: [
        [sessionRequestQuery.__.executeFx, sessionRequestMock],
        [signInModel.signInTelegramMutation.__.executeFx, signInRequestMock],
        [routes.signUp.open, routeOpenedMock],
      ],
      values: [[$launchParams, { initDataRaw: 'initDataRaw' }]],
    });

    sessionRequestMock.mockRejectedValue(undefined);
    signInRequestMock.mockResolvedValue({ status: 'needSignUp' });

    await allSettled(sessionRequestQuery.start, { scope });

    expect(routeOpenedMock).toHaveBeenCalled();
  });
});
