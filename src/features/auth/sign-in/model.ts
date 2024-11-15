import { createMutation } from '@farfetched/core';

import { internalApi } from '~/shared/api';

export const signInTelegramMutation = createMutation({
  effect: internalApi.authOauthSignInFx,
});
