import { sample } from 'effector';

import { signUpModel } from '~/features/auth/sign-up';
import { i18n } from '~/shared/config/i18n';
import { $launchParams, mainButton } from '~/shared/lib/tma';
import { routes } from '~/shared/routing';
import { chainAnonymous } from '~/shared/session';

export const currentRoute = routes.signUp;
export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise: routes.home.navigate,
});

sample({
  clock: currentRoute.opened,
  fn: () => ({
    text: i18n.t('signUp.submit'),
    handler: signUpModel.form.submit,
    hasShineEffect: true,
  }),
  target: mainButton.show,
});

sample({
  clock: [signUpModel.signUpTelegramMutation.$pending],
  fn: (isPending) => ({
    isLoaderVisible: isPending,
    isEnabled: !isPending,
  }),
  target: mainButton.show,
});

sample({
  clock: currentRoute.closed,
  target: mainButton.destroy,
});

sample({
  source: $launchParams,
  clock: currentRoute.opened,
  fn: (params) => ({
    username: params?.initData?.user?.firstName,
  }),
  target: signUpModel.form.setInitialForm,
});
