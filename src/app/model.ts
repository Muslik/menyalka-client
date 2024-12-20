import { createStore, sample } from 'effector';

import { signInModel } from '~/features/auth/sign-in';
import { $launchParams } from '~/shared/lib/tma';
import { routes } from '~/shared/routing';
import { sessionRequestQuery } from '~/shared/session';

const $isInitialized = createStore(false);

sample({
  clock: [
    sessionRequestQuery.finished.success,
    signInModel.signInTelegramMutation.finished.success,
  ],
  fn: () => true,
  target: $isInitialized,
});

sample({
  source: [$isInitialized, $launchParams] as const,
  clock: sessionRequestQuery.finished.failure,
  filter: ([isInitialized, params]) => !isInitialized && !!params,
  fn: ([_, params]) => ({
    headers: {
      authorization: `tma ${params?.initDataRaw}`,
    },
  }),
  target: signInModel.signInTelegramMutation.start,
});

sample({
  clock: signInModel.signInTelegramMutation.finished.success,
  filter: ({ result }) => result.status === 'needSignUp',
  target: routes.signUp.open,
});

sample({
  clock: signInModel.signInTelegramMutation.finished.success,
  filter: ({ result }) => result.status === 'success',
  target: sessionRequestQuery.start,
});
