import { createQuery } from '@farfetched/core';

import { internalApi } from '~/shared/api';

export const rulesQuery = createQuery({
  effect: internalApi.rulesGetRulesFx,
  initialData: '',
});
