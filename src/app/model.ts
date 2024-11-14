import { createStore, sample } from 'effector';

import { signInTelegramModel } from '~/features/auth/signIn';
import { $launchParams } from '~/shared/lib/tma';
import { routes } from '~/shared/routing';
import { sessionRequestQuery } from '~/shared/session';

const $isInitialized = createStore(false);

sample({
  clock: [
    sessionRequestQuery.finished.success,
    signInTelegramModel.signInTelegramMutation.finished.success,
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
  target: signInTelegramModel.signInTelegramMutation.start,
});

sample({
  clock: signInTelegramModel.signInTelegramMutation.finished.success,
  filter: ({ result }) => result.status === 'needSignUp',
  target: routes.signUp.open,
});

sample({
  clock: signInTelegramModel.signInTelegramMutation.finished.success,
  filter: ({ result }) => result.status === 'success',
  target: sessionRequestQuery.start,
});

/* sample({ */
/*   source: $authenticationStatus,  */
/*   clock: $isInitialized, */
/*   filter: (status, isInitialized) => status === AuthStatus.Anonymous && isInitialized, */
/*   target: routes.error.open, */
/* }) */
