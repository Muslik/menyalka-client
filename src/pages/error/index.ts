import { lazy } from 'react';

import { currentRoute } from './model';

export const ErrorRoute = {
  view: lazy(() => import('./error.page')),
  route: currentRoute,
};
