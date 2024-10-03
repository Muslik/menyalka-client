import { lazy } from 'react';

import { currentRoute } from './model';

export const HomeRoute = {
  view: lazy(() => import('./home-page')),
  route: currentRoute,
};
