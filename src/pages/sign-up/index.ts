import { createRouteView } from 'atomic-router-react';
import { lazy } from 'react';

import { PageLoader } from '~/shared/ui/page-loader';

import { anonymousRoute, currentRoute } from './model';

export const SignUpRoute = {
  view: createRouteView({
    route: anonymousRoute,
    view: lazy(() => import('./sign-up.page')),
    otherwise: PageLoader,
  }),
  route: currentRoute,
};
