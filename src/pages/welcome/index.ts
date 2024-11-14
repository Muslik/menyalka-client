import { createRouteView } from 'atomic-router-react';
import { lazy } from 'react';

import { PageLoader } from '~/shared/ui/PageLoader';

import { anonymousRoute, currentRoute } from './model';

export const WelcomeRoute = {
  view: createRouteView({
    route: anonymousRoute,
    view: lazy(() => import('./welcome.page')),
    otherwise: PageLoader,
  }),
  route: currentRoute,
};
